import { ActivityCategory, UnitConversionRule } from "./types";

export interface EmissionFactorDefinition {
  category: ActivityCategory;
  activityType: string;
  label: string;
  supportedUnits: string[];
  baseUnit: string;
  factorKgCO2e: number;
  region: string;
  source: string;
  version: string;
  description: string;
  assumptions: string;
  minAmount: number;
  maxAmount: number;
}

export const OFFICIAL_FACTORS: EmissionFactorDefinition[] = [
  // HOME ENERGY - INDIA GRID
  {
    category: "HOME_ENERGY",
    activityType: "electricity_grid",
    label: "Grid Electricity (India)",
    supportedUnits: ["kWh", "MWh", "units"],
    baseUnit: "kWh",
    factorKgCO2e: 0.716,
    region: "IN",
    source: "Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector, User Guide Version 19.0 (2024)",
    version: "CEA-v19.0-2024",
    description: "National grid average emission factor (combined margin) for India.",
    assumptions: "Combined margin accounting for operating margin and build margin across state and central utilities in India.",
    minAmount: 0.1,
    maxAmount: 100000,
  },
  // HOME ENERGY - GLOBAL GRID
  {
    category: "HOME_ENERGY",
    activityType: "electricity_grid_global",
    label: "Grid Electricity (Global Average)",
    supportedUnits: ["kWh", "MWh", "units"],
    baseUnit: "kWh",
    factorKgCO2e: 0.207,
    region: "GLOBAL",
    source: "UK Department for Energy Security and Net Zero (DESNZ) / DEFRA 2024 Conversion Factors",
    version: "DEFRA-2024.1",
    description: "Global/European average grid electricity generation and transmission emission factor.",
    assumptions: "Includes generation, transmission, and distribution grid losses.",
    minAmount: 0.1,
    maxAmount: 100000,
  },
  // HOME ENERGY - NATURAL GAS
  {
    category: "HOME_ENERGY",
    activityType: "natural_gas",
    label: "Piped Natural Gas (PNG)",
    supportedUnits: ["kWh", "m3", "therms", "SCM"],
    baseUnit: "kWh",
    factorKgCO2e: 0.183,
    region: "GLOBAL",
    source: "UK DESNZ / DEFRA 2024 Conversion Factors (Gross CV)",
    version: "DEFRA-2024.1",
    description: "Direct combustion of natural gas for domestic heating/cooking.",
    assumptions: "Calculated using gross calorific value (1 SCM or m3 ≈ 10.55 kWh).",
    minAmount: 0.1,
    maxAmount: 50000,
  },
  // HOME ENERGY - LPG CYLINDER
  {
    category: "HOME_ENERGY",
    activityType: "lpg_cylinder",
    label: "LPG Cooking Gas",
    supportedUnits: ["kg", "cylinders"],
    baseUnit: "kg",
    factorKgCO2e: 2.983,
    region: "IN",
    source: "IPCC Guidelines for National Greenhouse Gas Inventories & Indian Oil Corp reference",
    version: "IPCC-2024-IN",
    description: "Standard domestic LPG cylinder combustion.",
    assumptions: "Standard Indian domestic cylinder contains 14.2 kg LPG (approx 42.36 kg CO2e per full cylinder).",
    minAmount: 0.1,
    maxAmount: 1000,
  },

  // TRANSPORT - PETROL CAR
  {
    category: "TRANSPORT",
    activityType: "car_petrol",
    label: "Petrol Car (Solo / Passenger)",
    supportedUnits: ["km", "miles"],
    baseUnit: "km",
    factorKgCO2e: 0.171,
    region: "GLOBAL",
    source: "UK DESNZ / DEFRA 2024 Passenger Vehicles - Average petrol car",
    version: "DEFRA-2024.1",
    description: "Medium petrol passenger vehicle emissions per kilometre.",
    assumptions: "Includes direct tailpipe emissions and indirect fuel lifecycle emissions (Well-To-Tank).",
    minAmount: 0.1,
    maxAmount: 10000,
  },
  // TRANSPORT - DIESEL CAR
  {
    category: "TRANSPORT",
    activityType: "car_diesel",
    label: "Diesel Car",
    supportedUnits: ["km", "miles"],
    baseUnit: "km",
    factorKgCO2e: 0.168,
    region: "GLOBAL",
    source: "UK DESNZ / DEFRA 2024 Passenger Vehicles - Average diesel car",
    version: "DEFRA-2024.1",
    description: "Medium diesel passenger vehicle emissions per kilometre.",
    assumptions: "Average diesel passenger car fuel efficiency under typical driving cycles.",
    minAmount: 0.1,
    maxAmount: 10000,
  },
  // TRANSPORT - ELECTRIC VEHICLE
  {
    category: "TRANSPORT",
    activityType: "electric_vehicle",
    label: "Electric Vehicle (EV)",
    supportedUnits: ["km", "miles"],
    baseUnit: "km",
    factorKgCO2e: 0.053,
    region: "GLOBAL",
    source: "International Energy Agency (IEA) Global EV Outlook 2024",
    version: "IEA-2024-EV",
    description: "Battery electric vehicle consumption per km.",
    assumptions: "Derived from 0.18 kWh/km vehicle efficiency and average grid mix.",
    minAmount: 0.1,
    maxAmount: 10000,
  },
  // TRANSPORT - TWO WHEELER MOTORCYCLE
  {
    category: "TRANSPORT",
    activityType: "motorcycle_petrol",
    label: "Motorcycle / Scooter (Petrol)",
    supportedUnits: ["km", "miles"],
    baseUnit: "km",
    factorKgCO2e: 0.084,
    region: "IN",
    source: "Automotive Research Association of India (ARAI) & DEFRA 2024 benchmark",
    version: "ARAI-2024-IN",
    description: "Standard 100cc-150cc commuter motorcycle / scooter per kilometre.",
    assumptions: "Single rider commuting average fuel consumption of ~45 km/litre.",
    minAmount: 0.1,
    maxAmount: 10000,
  },
  // TRANSPORT - PUBLIC BUS
  {
    category: "TRANSPORT",
    activityType: "bus_public",
    label: "Public Bus (City transit)",
    supportedUnits: ["km", "miles"],
    baseUnit: "km",
    factorKgCO2e: 0.041,
    region: "GLOBAL",
    source: "UK DESNZ / DEFRA 2024 Public Transport - Local bus average",
    version: "DEFRA-2024.1",
    description: "City public bus per passenger kilometre.",
    assumptions: "Average urban passenger load factor and stop-and-go driving cycle.",
    minAmount: 0.1,
    maxAmount: 5000,
  },
  // TRANSPORT - METRO / COMMUTER RAIL
  {
    category: "TRANSPORT",
    activityType: "train_metro",
    label: "Metro / Electric Train",
    supportedUnits: ["km", "miles"],
    baseUnit: "km",
    factorKgCO2e: 0.028,
    region: "GLOBAL",
    source: "Delhi Metro Rail Corporation (DMRC) & European Environment Agency (EEA) benchmark",
    version: "DMRC-EEA-2024",
    description: "Electric urban rapid transit and suburban rail per passenger kilometre.",
    assumptions: "High passenger capacity and electric traction regenerative braking.",
    minAmount: 0.1,
    maxAmount: 5000,
  },
  // TRANSPORT - DOMESTIC FLIGHT
  {
    category: "TRANSPORT",
    activityType: "flight_domestic",
    label: "Flight (Domestic < 1,000 km)",
    supportedUnits: ["km", "miles", "flights"],
    baseUnit: "km",
    factorKgCO2e: 0.246,
    region: "GLOBAL",
    source: "UK DESNZ / DEFRA 2024 Aviation factors with Radiative Forcing (RF)",
    version: "DEFRA-2024.1",
    description: "Domestic scheduled flight per passenger kilometre.",
    assumptions: "Includes RF multiplier (1.9x) for high-altitude non-CO2 radiative forcing effects. 1 domestic flight defaults to 600 km.",
    minAmount: 1,
    maxAmount: 20000,
  },
  // TRANSPORT - INTERNATIONAL FLIGHT
  {
    category: "TRANSPORT",
    activityType: "flight_international",
    label: "Flight (International / Long-haul)",
    supportedUnits: ["km", "miles", "flights"],
    baseUnit: "km",
    factorKgCO2e: 0.193,
    region: "GLOBAL",
    source: "UK DESNZ / DEFRA 2024 Aviation factors with Radiative Forcing",
    version: "DEFRA-2024.1",
    description: "International scheduled long-haul flight per passenger kilometre.",
    assumptions: "Economy class passenger share with RF multiplier. 1 international flight defaults to 4,500 km.",
    minAmount: 1,
    maxAmount: 50000,
  },

  // FOOD - BEEF / RUMINANT MEAT
  {
    category: "FOOD",
    activityType: "meal_beef",
    label: "Meal with Beef / Lamb",
    supportedUnits: ["meals", "servings"],
    baseUnit: "meals",
    factorKgCO2e: 6.61,
    region: "GLOBAL",
    source: "Poore & Nemecek (Science 2018), Our World in Data Food Emissions Database 2024",
    version: "OWID-POORE-2024",
    description: "Single portion meal featuring ruminant meat (beef or lamb).",
    assumptions: "Portion size ~150g cooked meat, including land-use change and enteric fermentation emissions.",
    minAmount: 1,
    maxAmount: 100,
  },
  // FOOD - POULTRY / CHICKEN / EGGS
  {
    category: "FOOD",
    activityType: "meal_poultry",
    label: "Meal with Chicken / Fish / Eggs",
    supportedUnits: ["meals", "servings"],
    baseUnit: "meals",
    factorKgCO2e: 1.82,
    region: "GLOBAL",
    source: "Poore & Nemecek (Science 2018), Our World in Data Food Emissions Database 2024",
    version: "OWID-POORE-2024",
    description: "Single portion meal featuring poultry, fish, or egg protein.",
    assumptions: "Portion size ~150g, accounting for feed production and farm processing.",
    minAmount: 1,
    maxAmount: 100,
  },
  // FOOD - VEGETARIAN
  {
    category: "FOOD",
    activityType: "meal_vegetarian",
    label: "Vegetarian Meal (Legumes, Dairy, Vegetables)",
    supportedUnits: ["meals", "servings"],
    baseUnit: "meals",
    factorKgCO2e: 0.85,
    region: "GLOBAL",
    source: "Scarborough et al. (Nature Food 2023) comparative dietary greenhouse gas database",
    version: "NATFOOD-2024",
    description: "Nutritious plant and dairy based meal.",
    assumptions: "Contains lentils, chickpeas, paneer/dairy, vegetables, and grains.",
    minAmount: 1,
    maxAmount: 100,
  },
  // FOOD - VEGAN / PLANT-BASED
  {
    category: "FOOD",
    activityType: "meal_vegan",
    label: "Vegan / 100% Plant-Based Meal",
    supportedUnits: ["meals", "servings"],
    baseUnit: "meals",
    factorKgCO2e: 0.49,
    region: "GLOBAL",
    source: "Scarborough et al. (Nature Food 2023) comparative dietary greenhouse gas database",
    version: "NATFOOD-2024",
    description: "Pure plant meal (pulses, beans, tofu, seasonal greens, grains).",
    assumptions: "Zero animal products; seasonal crop sourcing baseline.",
    minAmount: 1,
    maxAmount: 100,
  },

  // WATER - TAP WATER
  {
    category: "WATER",
    activityType: "water_tap",
    label: "Municipal Tap Water",
    supportedUnits: ["litres", "m3", "gallons"],
    baseUnit: "litres",
    factorKgCO2e: 0.000344,
    region: "GLOBAL",
    source: "UK Water Industry Research (UKWIR) & DEFRA 2024 Water Supply & Wastewater",
    version: "DEFRA-2024.1",
    description: "Potable tap water supply, treatment, and municipal wastewater discharge.",
    assumptions: "0.344 kg CO2e per 1,000 litres (1 cubic metre). 1 m3 = 1,000 litres. 1 gallon ≈ 3.785 litres.",
    minAmount: 1,
    maxAmount: 500000,
  },

  // WASTE - LANDFILL
  {
    category: "WASTE",
    activityType: "waste_landfill",
    label: "Mixed Landfill Waste",
    supportedUnits: ["kg", "lbs", "bags"],
    baseUnit: "kg",
    factorKgCO2e: 0.587,
    region: "GLOBAL",
    source: "IPCC Waste Model & DEFRA 2024 Municipal Landfill greenhouse gas factors",
    version: "DEFRA-2024.1",
    description: "Unsorted mixed domestic refuse sent to municipal landfill sites.",
    assumptions: "Standard 30-litre kitchen waste bag is estimated at 5.0 kg mixed refuse. 1 lb = 0.453592 kg.",
    minAmount: 0.1,
    maxAmount: 5000,
  },
  // WASTE - COMPOSTED
  {
    category: "WASTE",
    activityType: "waste_composted",
    label: "Kitchen Waste Composted",
    supportedUnits: ["kg", "lbs", "bags"],
    baseUnit: "kg",
    factorKgCO2e: 0.010,
    region: "GLOBAL",
    source: "DEFRA 2024 Organic waste composting greenhouse balance",
    version: "DEFRA-2024.1",
    description: "Vegetable peels and food scraps diverted into aerobic compost.",
    assumptions: "Net emissions from managed aerobic composting process. 1 standard food caddy bag ≈ 3 kg.",
    minAmount: 0.1,
    maxAmount: 2000,
  },
  // WASTE - RECYCLED
  {
    category: "WASTE",
    activityType: "waste_recycled",
    label: "Recycled Material (Dry recyclables)",
    supportedUnits: ["kg", "lbs"],
    baseUnit: "kg",
    factorKgCO2e: 0.021,
    region: "GLOBAL",
    source: "DEFRA 2024 Material recycling collection and secondary processing model",
    version: "DEFRA-2024.1",
    description: "Sorted paper, glass, plastic, or metal diverted for material recovery.",
    assumptions: "Accounts for collection sorting and transport to reprocessing centres.",
    minAmount: 0.1,
    maxAmount: 2000,
  },
];

// Unit conversion functions
export const UNIT_CONVERSIONS: Record<string, Record<string, UnitConversionRule>> = {
  // Energy
  kWh: {
    kWh: { targetUnit: "kWh", convert: (v) => v },
    units: { targetUnit: "kWh", convert: (v) => v }, // In India, 1 electric unit = 1 kWh
    MWh: { targetUnit: "kWh", convert: (v) => v * 1000 },
    m3: { targetUnit: "kWh", convert: (v) => v * 10.55 }, // 1 m3 natural gas ≈ 10.55 kWh
    SCM: { targetUnit: "kWh", convert: (v) => v * 10.55 }, // Standard Cubic Metres
    therms: { targetUnit: "kWh", convert: (v) => v * 29.3 },
  },
  kg: {
    kg: { targetUnit: "kg", convert: (v) => v },
    lbs: { targetUnit: "kg", convert: (v) => v * 0.45359237 },
    cylinders: { targetUnit: "kg", convert: (v) => v * 14.2 }, // Domestic LPG cylinder = 14.2 kg
    bags: { targetUnit: "kg", convert: (v) => v * 5.0 }, // Standard 30L rubbish bag ≈ 5 kg
  },
  km: {
    km: { targetUnit: "km", convert: (v) => v },
    miles: { targetUnit: "km", convert: (v) => v * 1.609344 },
    flights: { targetUnit: "km", convert: (v) => v * 600 }, // Default domestic flight distance fallback
  },
  meals: {
    meals: { targetUnit: "meals", convert: (v) => v },
    servings: { targetUnit: "meals", convert: (v) => v },
  },
  litres: {
    litres: { targetUnit: "litres", convert: (v) => v },
    m3: { targetUnit: "litres", convert: (v) => v * 1000 },
    gallons: { targetUnit: "litres", convert: (v) => v * 3.78541 },
  },
};
