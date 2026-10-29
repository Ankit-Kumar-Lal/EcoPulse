export type ActivityCategory =
  | "HOME_ENERGY"
  | "TRANSPORT"
  | "FOOD"
  | "WATER"
  | "WASTE";

export type DataClassification = "user_entered" | "measured" | "estimated";

export interface CalculationInput {
  category: ActivityCategory;
  activityType: string;
  amount: number;
  unit: string;
  region?: string; // default "IN" or "GLOBAL"
}

export interface CalculationOutput {
  calculatedKgCO2e: number;
  normalizedAmount: number;
  normalizedUnit: string;
  factorValue: number;
  factorUnit: string;
  factorSource: string;
  factorVersion: string;
  region: string;
  estimationMethod: string;
  assumptions: string;
  methodologyNote: string;
  dataClassification: DataClassification;
}

export interface UnitConversionRule {
  targetUnit: string;
  convert: (val: number) => number;
}
