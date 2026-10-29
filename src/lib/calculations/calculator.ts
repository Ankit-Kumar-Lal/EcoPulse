import { OFFICIAL_FACTORS, UNIT_CONVERSIONS } from "./factors";
import { CalculationInput, CalculationOutput } from "./types";

export class CalculationError extends Error {
  constructor(message: string, public readonly code: string = "CALCULATION_ERROR") {
    super(message);
    this.name = "CalculationError";
  }
}

/**
 * Normalizes an input quantity to the factor's base unit.
 * Throws CalculationError if units are incompatible or unsupported.
 */
export function normalizeUnit(
  amount: number,
  fromUnit: string,
  baseUnit: string
): { normalizedAmount: number; normalizedUnit: string } {
  const baseTable = UNIT_CONVERSIONS[baseUnit];
  if (!baseTable) {
    throw new CalculationError(
      `Unsupported base unit '${baseUnit}'.`,
      "UNSUPPORTED_BASE_UNIT"
    );
  }

  const rule = baseTable[fromUnit];
  if (!rule) {
    throw new CalculationError(
      `Cannot convert from '${fromUnit}' to base unit '${baseUnit}'. Units are incompatible.`,
      "INCOMPATIBLE_UNITS"
    );
  }

  const normalized = rule.convert(amount);
  return {
    normalizedAmount: normalized,
    normalizedUnit: rule.targetUnit,
  };
}

/**
 * Core calculation function that maps an activity entry to a transparent carbon footprint.
 */
export function calculateFootprint(input: CalculationInput): CalculationOutput {
  // 1. Validate amount
  if (typeof input.amount !== "number" || isNaN(input.amount)) {
    throw new CalculationError("Activity amount must be a valid number.", "INVALID_AMOUNT");
  }
  if (input.amount <= 0) {
    throw new CalculationError("Activity amount must be strictly greater than zero.", "NON_POSITIVE_AMOUNT");
  }

  // 2. Locate matching factor
  const region = input.region?.toUpperCase() || "IN";
  
  // Try exact region first, then fallback to GLOBAL
  let factorDef = OFFICIAL_FACTORS.find(
    (f) => f.activityType === input.activityType && f.region === region
  );

  if (!factorDef) {
    factorDef = OFFICIAL_FACTORS.find(
      (f) => f.activityType === input.activityType && f.region === "GLOBAL"
    );
  }

  if (!factorDef) {
    // If not found by region, look for any match for the activity type
    factorDef = OFFICIAL_FACTORS.find((f) => f.activityType === input.activityType);
  }

  if (!factorDef) {
    throw new CalculationError(
      `No official emission factor found for activity '${input.activityType}'.`,
      "FACTOR_NOT_FOUND"
    );
  }

  // 3. Validate supported units
  const inputUnit = input.unit.trim();
  if (!factorDef.supportedUnits.includes(inputUnit)) {
    throw new CalculationError(
      `Unit '${inputUnit}' is not supported for ${factorDef.label}. Supported units are: ${factorDef.supportedUnits.join(", ")}.`,
      "UNSUPPORTED_UNIT"
    );
  }

  // Special case for flight count vs flight distance
  let calculatedAmount = input.amount;
  if (inputUnit === "flights") {
    if (factorDef.activityType === "flight_domestic") {
      calculatedAmount = input.amount * 600; // typical 600 km domestic sector
    } else if (factorDef.activityType === "flight_international") {
      calculatedAmount = input.amount * 4500; // typical 4,500 km long-haul sector
    }
  }

  // 4. Normalize unit
  const fromUnit = inputUnit === "flights" ? "km" : inputUnit;
  const { normalizedAmount, normalizedUnit } = normalizeUnit(
    calculatedAmount,
    fromUnit,
    factorDef.baseUnit
  );

  // 5. Boundary check
  if (normalizedAmount > factorDef.maxAmount * 1.5) {
    throw new CalculationError(
      `Entered amount (${input.amount} ${input.unit}) exceeds plausible operational limits for a single entry. Please verify the value.`,
      "EXCEEDS_MAX_LIMIT"
    );
  }

  // 6. Calculate kg CO2e
  const rawKgCO2e = normalizedAmount * factorDef.factorKgCO2e;
  const calculatedKgCO2e = Math.round(rawKgCO2e * 100) / 100;

  // 7. Generate plain-language explanation
  const methodologyNote = `Estimated using ${factorDef.source} (${factorDef.version}). Multiplied ${normalizedAmount.toFixed(1)} ${normalizedUnit} by factor of ${factorDef.factorKgCO2e} kg CO₂e/${factorDef.baseUnit}.`;

  return {
    calculatedKgCO2e,
    normalizedAmount: Math.round(normalizedAmount * 100) / 100,
    normalizedUnit,
    factorValue: factorDef.factorKgCO2e,
    factorUnit: `kg CO2e/${factorDef.baseUnit}`,
    factorSource: factorDef.source,
    factorVersion: factorDef.version,
    region: factorDef.region,
    estimationMethod: "Direct emission factor multiplication per unit activity (Tier 1/2 GHG Protocol)",
    assumptions: factorDef.assumptions,
    methodologyNote,
    dataClassification: "estimated",
  };
}
