import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding emission factors, recommendations, and starter challenges...");

  // 1. Emission Factors
  const emissionFactors = [
    // HOME ENERGY - INDIA
    {
      category: "HOME_ENERGY",
      activityType: "electricity_grid",
      unit: "kWh",
      factorKgCO2e: 0.716,
      region: "IN",
      source: "Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector, User Guide Version 19.0 (2024)",
      version: "CEA-v19.0-2024",
      description: "Weighted average emission factor for the Indian national grid (combined margin).",
    },
    // HOME ENERGY - GLOBAL / UK
    {
      category: "HOME_ENERGY",
      activityType: "electricity_grid",
      unit: "kWh",
      factorKgCO2e: 0.207,
      region: "GLOBAL",
      source: "UK Department for Energy Security and Net Zero (DESNZ) / DEFRA Conversion Factors 2024",
      version: "DEFRA-2024.1",
      description: "Standard global/European grid electricity generation and distribution average factor.",
    },
    {
      category: "HOME_ENERGY",
      activityType: "natural_gas",
      unit: "kWh",
      factorKgCO2e: 0.183,
      region: "GLOBAL",
      source: "UK DESNZ / DEFRA Greenhouse Gas Reporting: Conversion Factors 2024",
      version: "DEFRA-2024.1",
      description: "Direct combustion of natural gas for domestic heating/cooking.",
    },
    {
      category: "HOME_ENERGY",
      activityType: "lpg_cylinder",
      unit: "kg",
      factorKgCO2e: 2.983,
      region: "IN",
      source: "IPCC Guidelines for National Greenhouse Gas Inventories & Indian Oil Corp lifecycle reference",
      version: "IPCC-2024-IN",
      description: "Liquefied petroleum gas (LPG) combustion in standard domestic cylinders (14.2 kg).",
    },

    // TRANSPORT
    {
      category: "TRANSPORT",
      activityType: "car_petrol",
      unit: "km",
      factorKgCO2e: 0.171,
      region: "GLOBAL",
      source: "UK DESNZ / DEFRA 2024 Passenger Vehicles - Average petrol car",
      version: "DEFRA-2024.1",
      description: "Average medium petrol passenger car tailpipe and well-to-tank emissions.",
    },
    {
      category: "TRANSPORT",
      activityType: "car_diesel",
      unit: "km",
      factorKgCO2e: 0.168,
      region: "GLOBAL",
      source: "UK DESNZ / DEFRA 2024 Passenger Vehicles - Average diesel car",
      version: "DEFRA-2024.1",
      description: "Average medium diesel passenger car emissions per vehicle kilometre.",
    },
    {
      category: "TRANSPORT",
      activityType: "electric_vehicle",
      unit: "km",
      factorKgCO2e: 0.053,
      region: "GLOBAL",
      source: "International Energy Agency (IEA) Global EV Outlook 2024 (Average grid mix)",
      version: "IEA-2024-EV",
      description: "Battery electric vehicle consumption based on typical 0.18 kWh/km efficiency.",
    },
    {
      category: "TRANSPORT",
      activityType: "motorcycle_petrol",
      unit: "km",
      factorKgCO2e: 0.084,
      region: "IN",
      source: "Automotive Research Association of India (ARAI) & DEFRA 2024 small two-wheeler average",
      version: "ARAI-2024-IN",
      description: "Two-wheeler/motorcycle commuter journey per passenger kilometre.",
    },
    {
      category: "TRANSPORT",
      activityType: "bus_public",
      unit: "km",
      factorKgCO2e: 0.041,
      region: "GLOBAL",
      source: "UK DESNZ / DEFRA 2024 Public transport - Local bus average occupancy",
      version: "DEFRA-2024.1",
      description: "Local public transit bus per passenger kilometre at average occupancy.",
    },
    {
      category: "TRANSPORT",
      activityType: "train_metro",
      unit: "km",
      factorKgCO2e: 0.028,
      region: "GLOBAL",
      source: "Delhi Metro Rail Corp (DMRC) / European Environment Agency (EEA) urban rail benchmark",
      version: "DMRC-EEA-2024",
      description: "Urban electric metro and suburban commuter rail per passenger kilometre.",
    },
    {
      category: "TRANSPORT",
      activityType: "flight_domestic",
      unit: "km",
      factorKgCO2e: 0.246,
      region: "GLOBAL",
      source: "UK DESNZ / DEFRA 2024 Aviation factors with Radiative Forcing index",
      version: "DEFRA-2024.1",
      description: "Domestic scheduled passenger flight (<1000 km) including radiative forcing.",
    },
    {
      category: "TRANSPORT",
      activityType: "flight_international",
      unit: "km",
      factorKgCO2e: 0.193,
      region: "GLOBAL",
      source: "UK DESNZ / DEFRA 2024 Long-haul economy passenger flight with Radiative Forcing",
      version: "DEFRA-2024.1",
      description: "International scheduled long-haul flight per passenger kilometre.",
    },

    // FOOD
    {
      category: "FOOD",
      activityType: "meal_beef",
      unit: "meals",
      factorKgCO2e: 6.61,
      region: "GLOBAL",
      source: "Poore & Nemecek (Science 2018), Our World in Data Food Emissions Database 2024 update",
      version: "OWID-POORE-2024",
      description: "Single meal containing beef or ruminant meat (~150g portion).",
    },
    {
      category: "FOOD",
      activityType: "meal_poultry",
      unit: "meals",
      factorKgCO2e: 1.82,
      region: "GLOBAL",
      source: "Poore & Nemecek (Science 2018), Our World in Data Food Emissions Database 2024 update",
      version: "OWID-POORE-2024",
      description: "Single meal containing chicken, poultry, or eggs (~150g portion).",
    },
    {
      category: "FOOD",
      activityType: "meal_vegetarian",
      unit: "meals",
      factorKgCO2e: 0.85,
      region: "GLOBAL",
      source: "Scarborough et al. (Nature Food 2023) dietary GHG comparative database",
      version: "NATFOOD-2024",
      description: "Vegetarian meal containing legumes, dairy, vegetables, and grains.",
    },
    {
      category: "FOOD",
      activityType: "meal_vegan",
      unit: "meals",
      factorKgCO2e: 0.49,
      region: "GLOBAL",
      source: "Scarborough et al. (Nature Food 2023) dietary GHG comparative database",
      version: "NATFOOD-2024",
      description: "Plant-based meal (legumes, pulses, seasonal produce, whole grains).",
    },

    // WATER
    {
      category: "WATER",
      activityType: "water_tap",
      unit: "litres",
      factorKgCO2e: 0.000344, // 0.344 kg per 1000 litres
      region: "GLOBAL",
      source: "UK Water Industry Research (UKWIR) / DEFRA 2024 Water Supply & Wastewater Treatment",
      version: "DEFRA-2024.1",
      description: "Municipal drinking water treatment, distribution, and wastewater processing.",
    },

    // WASTE
    {
      category: "WASTE",
      activityType: "waste_landfill",
      unit: "kg",
      factorKgCO2e: 0.587,
      region: "GLOBAL",
      source: "IPCC Waste Model & DEFRA 2024 Municipal Landfill waste factors",
      version: "DEFRA-2024.1",
      description: "Unsorted mixed municipal waste sent to landfill with methane generation.",
    },
    {
      category: "WASTE",
      activityType: "waste_composted",
      unit: "kg",
      factorKgCO2e: 0.010,
      region: "GLOBAL",
      source: "DEFRA 2024 Organic waste composting greenhouse balance",
      version: "DEFRA-2024.1",
      description: "Organic kitchen/garden waste composted aerobically at home or community facility.",
    },
    {
      category: "WASTE",
      activityType: "waste_recycled",
      unit: "kg",
      factorKgCO2e: 0.021,
      region: "GLOBAL",
      source: "DEFRA 2024 Material circularity and recycling collection offset model",
      version: "DEFRA-2024.1",
      description: "Paper, plastic, metal or glass separated for clean material recycling.",
    },
  ];

  for (const factor of emissionFactors) {
    await prisma.emissionFactor.upsert({
      where: {
        activityType_region_version: {
          activityType: factor.activityType,
          region: factor.region,
          version: factor.version,
        },
      },
      update: factor,
      create: factor,
    });
  }

  // 2. Starter Recommendations (Rules-based, explainable, no "AI" claims)
  const recommendations = [
    {
      category: "HOME_ENERGY",
      title: "Optimize AC Setpoint to 24°C–25°C",
      description: "Adjusting your air conditioner thermostat by 1°C closer to ambient saves roughly 6% of compressor electricity.",
      effort: "LOW",
      potentialSavingKgCO2e: 24.5,
      actionSteps: JSON.stringify([
        "Set daytime cooling temperature to 24°C or 25°C instead of 20°C.",
        "Use a ceiling fan on low speed simultaneously to maintain air circulation and perceived comfort.",
        "Clean or vacuum the intake dust mesh every 3 weeks to maintain airflow efficiency."
      ]),
      assumptions: "Assumes 1.5-ton 3-star split inverter AC operated 6 hours daily, reducing energy consumption by ~1.1 kWh/day evaluated against the Indian CEA grid emission factor (0.716 kg CO2e/kWh).",
      source: "Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India (Guidelines on Room AC Temperature Setting)",
    },
    {
      category: "HOME_ENERGY",
      title: "Eliminate Phantom Standby Power with Master Strips",
      description: "Entertainment systems, laptop docks, and chargers draw continuous idle power even when screens are dark.",
      effort: "LOW",
      potentialSavingKgCO2e: 12.8,
      actionSteps: JSON.stringify([
        "Group home office equipment onto an accessible surge protector with an on/off switch.",
        "Switch off power strips at night or when stepping away for more than 4 hours.",
        "Unplug transformer brick chargers when not connected to devices."
      ]),
      assumptions: "Assumes continuous phantom draw reduction of 25W across home electronics over a 30-day month (18 kWh/month saved on typical grid power).",
      source: "Lawrence Berkeley National Laboratory (LBNL) Standby Power Summary",
    },
    {
      category: "TRANSPORT",
      title: "Replace 2 Solo Car Commutes Weekly with Metro or Bus",
      description: "Shifting two regular 12 km round-trips to mass transit cuts urban congestion and personal transit emissions by over 70%.",
      effort: "MEDIUM",
      potentialSavingKgCO2e: 31.2,
      actionSteps: JSON.stringify([
        "Plan your transit route using local bus or metro timetables for Tuesday and Thursday.",
        "Keep a prepaid smart card or mobile transit pass loaded to avoid ticket lines.",
        "Combine first/last-mile segments with brisk walking or shared micro-mobility."
      ]),
      assumptions: "Assumes 24 km weekly displaced from an average petrol passenger car (0.171 kg/km) to electric metro/bus transit (0.035 kg/km) across 4 weeks.",
      source: "UK DEFRA 2024 Passenger Transport Benchmarks & Delhi Metro Rail Corporation CDM Monitoring Data",
    },
    {
      category: "FOOD",
      title: "Adopt 2 Plant-Forward Dining Days per Week",
      description: "Choosing seasonal vegetarian and pulse-based meals two days each week substantially lowers agricultural footprint without compromising nutrition.",
      effort: "LOW",
      potentialSavingKgCO2e: 28.6,
      actionSteps: JSON.stringify([
        "Select two days per week (e.g., Monday and Wednesday) for whole-food plant-centered meals.",
        "Base meals on hearty lentils, chickpeas, seasonal roasted vegetables, and whole grains.",
        "Explore regional plant-rich cuisine traditions."
      ]),
      assumptions: "Assumes replacing 6 higher-impact meals per month with whole legume/vegetable meals (saving ~4.7 kg CO2e per substituted meal based on Poore & Nemecek meta-analysis).",
      source: "Poore & Nemecek (Science 2018), 'Reducing food's environmental impacts through producers and consumers'",
    },
    {
      category: "WASTE",
      title: "Separate Kitchen Wet Waste for Aerobic Composting",
      description: "Keeping biodegradable food scraps out of municipal landfills prevents anaerobic decomposition and methane emissions.",
      effort: "MEDIUM",
      potentialSavingKgCO2e: 14.2,
      actionSteps: JSON.stringify([
        "Place a dedicated countertop bin or aerated container for vegetable peels, coffee grounds, and tea leaves.",
        "Avoid adding oils, dairy, or cooked meat into basic aerobic home compost piles.",
        "Mix with dry browns (dry leaves, shredded non-glossy cardboard) to maintain balanced moisture."
      ]),
      assumptions: "Assumes 25 kg monthly food waste diverted from anaerobic landfill (0.587 kg CO2e/kg) to well-aerated home/community compost (0.010 kg CO2e/kg).",
      source: "IPCC Guidelines for National Greenhouse Gas Inventories: Waste Generation, Composition and Management Data",
    },
    {
      category: "WATER",
      title: "Install Aerators on Kitchen and Bathroom Taps",
      description: "Low-flow aerators mix air into the water stream, cutting tap flow rates by 40% while preserving comfortable pressure.",
      effort: "LOW",
      potentialSavingKgCO2e: 4.8,
      actionSteps: JSON.stringify([
        "Screw standard 3 to 6 litre-per-minute aerator nozzles onto bathroom and kitchen sink spouts.",
        "Check washers for drips and repair any leaking valves promptly.",
        "Turn off the tap while lathering soap or brushing teeth."
      ]),
      assumptions: "Assumes saving approximately 2,800 litres of treated water monthly per household, including reduction in electric pressure-pump energy usage.",
      source: "CGIAR Water & Energy Nexus Analysis & UK DEFRA Municipal Water Supply Intensity Factors",
    },
  ];

  for (const rec of recommendations) {
    const existing = await prisma.recommendation.findFirst({
      where: { title: rec.title },
    });
    if (!existing) {
      await prisma.recommendation.create({ data: rec });
    }
  }

  // 3. Starter Challenges (Clear rules, self-reported disclaimers, product content)
  const challenges = [
    {
      title: "The 7-Day AC Efficiency Routine",
      category: "HOME_ENERGY",
      description: "Keep your cooling thermostat set between 24°C and 26°C for one full week. Track comfort and verify lower consumption.",
      durationDays: 7,
      targetMetric: "Days with 24°C+ setpoint",
      targetValue: 7,
      unit: "days",
      rules: "Log your daily cooling setpoint. Use ceiling fans to sustain comfort. Self-reported habit tracking.",
      isCommunity: true,
    },
    {
      title: "Green Commute Week",
      category: "TRANSPORT",
      description: "Choose mass transit, cycling, walking, or shared rides for at least 4 commutes this week.",
      durationDays: 7,
      targetMetric: "Low-carbon transit trips",
      targetValue: 4,
      unit: "trips",
      rules: "Any trip by metro, public bus, bicycle, walking, or shared EV counts toward your goal.",
      isCommunity: true,
    },
    {
      title: "Zero Food Waste Kitchen",
      category: "FOOD",
      description: "Plan meals in advance, store produce correctly, and repurpose leftovers for 14 consecutive days.",
      durationDays: 14,
      targetMetric: "Zero-waste days logged",
      targetValue: 14,
      unit: "days",
      rules: "Audit food scraps before discarding. Compost unavoidable organic peels and grounds. Self-reported progress.",
      isCommunity: true,
    },
    {
      title: "Unplug & Power Down Challenge",
      category: "HOME_ENERGY",
      description: "Turn off all standby electronics and unplug idle chargers each night before sleeping for 10 days.",
      durationDays: 10,
      targetMetric: "Nights with idle power off",
      targetValue: 10,
      unit: "nights",
      rules: "Check workstations, television consoles, and adapters before bedtime.",
      isCommunity: false,
    },
  ];

  for (const ch of challenges) {
    const existing = await prisma.challenge.findFirst({
      where: { title: ch.title },
    });
    if (!existing) {
      await prisma.challenge.create({ data: ch });
    }
  }

  console.log("Database seeded successfully with official factors, rules-based recommendations, and community challenges.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
