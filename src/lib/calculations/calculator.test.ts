import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateFootprint, normalizeUnit, CalculationError } from "./calculator";

describe("EcoPulse Calculation Module", () => {
  it("calculates Indian grid electricity accurately with CEA factor (0.716 kg CO2e/kWh)", () => {
    const result = calculateFootprint({
      category: "HOME_ENERGY",
      activityType: "electricity_grid",
      amount: 100,
      unit: "kWh",
      region: "IN",
    });

    assert.equal(result.calculatedKgCO2e, 71.6);
    assert.equal(result.normalizedAmount, 100);
    assert.equal(result.normalizedUnit, "kWh");
    assert.equal(result.factorValue, 0.716);
    assert.match(result.factorSource, /Central Electricity Authority/);
    assert.equal(result.factorVersion, "CEA-v19.0-2024");
  });

  it("converts miles to kilometres correctly for passenger vehicle travel", () => {
    // 50 miles = 50 * 1.609344 = 80.4672 km
    // 80.4672 km * 0.171 kg/km = 13.76 kg CO2e
    const result = calculateFootprint({
      category: "TRANSPORT",
      activityType: "car_petrol",
      amount: 50,
      unit: "miles",
    });

    assert.equal(result.normalizedUnit, "km");
    assert.equal(result.normalizedAmount, 80.47);
    assert.equal(result.calculatedKgCO2e, 13.76);
  });

  it("converts domestic LPG cylinders to kilograms correctly", () => {
    // 1 cylinder = 14.2 kg * 2.983 kg CO2e/kg = 42.36 kg CO2e
    const result = calculateFootprint({
      category: "HOME_ENERGY",
      activityType: "lpg_cylinder",
      amount: 1,
      unit: "cylinders",
      region: "IN",
    });

    assert.equal(result.normalizedUnit, "kg");
    assert.equal(result.normalizedAmount, 14.2);
    assert.equal(result.calculatedKgCO2e, 42.36);
  });

  it("calculates flight emissions using radiative forcing correctly", () => {
    const result = calculateFootprint({
      category: "TRANSPORT",
      activityType: "flight_domestic",
      amount: 1,
      unit: "flights",
    });

    // 1 domestic flight = 600 km * 0.246 = 147.6 kg CO2e
    assert.equal(result.normalizedAmount, 600);
    assert.equal(result.calculatedKgCO2e, 147.6);
  });

  it("rejects non-positive numbers with specific error", () => {
    assert.throws(
      () =>
        calculateFootprint({
          category: "HOME_ENERGY",
          activityType: "electricity_grid",
          amount: 0,
          unit: "kWh",
        }),
      (err: any) => err instanceof CalculationError && err.code === "NON_POSITIVE_AMOUNT"
    );

    assert.throws(
      () =>
        calculateFootprint({
          category: "HOME_ENERGY",
          activityType: "electricity_grid",
          amount: -25,
          unit: "kWh",
        }),
      (err: any) => err instanceof CalculationError && err.code === "NON_POSITIVE_AMOUNT"
    );
  });

  it("rejects incompatible units with clear explanation", () => {
    assert.throws(
      () =>
        calculateFootprint({
          category: "HOME_ENERGY",
          activityType: "electricity_grid",
          amount: 10,
          unit: "km", // Cannot measure electricity in kilometres!
        }),
      (err: any) => err instanceof CalculationError && err.code === "UNSUPPORTED_UNIT"
    );
  });

  it("rejects implausibly high single-entry values", () => {
    assert.throws(
      () =>
        calculateFootprint({
          category: "TRANSPORT",
          activityType: "car_petrol",
          amount: 500000, // 500,000 km in one entry
          unit: "km",
        }),
      (err: any) => err instanceof CalculationError && err.code === "EXCEEDS_MAX_LIMIT"
    );
  });

  it("never outputs false floating-point precision", () => {
    const result = calculateFootprint({
      category: "WATER",
      activityType: "water_tap",
      amount: 450,
      unit: "litres",
    });

    // 450 * 0.000344 = 0.1548 -> 0.15
    assert.equal(result.calculatedKgCO2e, 0.15);
    assert.equal(typeof result.calculatedKgCO2e, "number");
  });
});
