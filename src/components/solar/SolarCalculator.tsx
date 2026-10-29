"use client";

import { useState } from "react";
import { Sun, Zap, IndianRupee, TreePine, Info } from "lucide-react";

export function SolarCalculator() {
  const [area, setArea] = useState<number>(300); // sq ft
  const [tariff, setTariff] = useState<number>(7.5); // INR / kWh
  const [sunHours, setSunHours] = useState<number>(4.8); // Peak sun hours/day

  // Technical Calculation Rules
  // 1 kWp needs ~100 sq ft
  const potentialCapacityKw = Math.max(0.5, Math.floor((area / 100) * 10) / 10);
  // Daily generation = capacity * sun hours * 0.8 (Performance Ratio / system losses)
  const dailyGenerationKwh = potentialCapacityKw * sunHours * 0.8;
  const annualGenerationKwh = Math.round(dailyGenerationKwh * 365);
  // Annual savings in INR
  const annualSavingsInr = Math.round(annualGenerationKwh * tariff);
  // Annual CO2 avoided using CEA grid baseline (0.716 kg/kWh)
  const annualCo2SavedKg = Math.round(annualGenerationKwh * 0.716);
  // Trees equivalent (21.77 kg CO2 / tree / year - US EPA benchmark)
  const treesEquivalent = Math.round((annualCo2SavedKg / 21.77) * 10) / 10;

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <div className="flex items-center space-x-3 pb-4 border-b border-brand-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime/40 text-brand-forest">
          <Sun className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-brand-forest">
            Rooftop Solar Feasibility Estimator
          </h3>
          <p className="text-xs text-brand-sage">
            Informational solar PV yield & bill offset based on Ministry of New and Renewable Energy (MNRE) benchmarks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Input 1: Rooftop Area */}
        <div>
          <label className="block text-xs font-semibold text-brand-forest mb-1">
            Unshaded Rooftop Area (sq. ft)
          </label>
          <input
            type="number"
            min="50"
            max="10000"
            value={area}
            onChange={(e) => setArea(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-brand-border bg-brand-natural/40 px-3 py-2 text-sm text-brand-forest focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald font-mono"
          />
          <span className="text-[11px] text-brand-sage mt-1 block">
            ~100 sq ft required per 1 kWp system
          </span>
        </div>

        {/* Input 2: Electricity Tariff */}
        <div>
          <label className="block text-xs font-semibold text-brand-forest mb-1">
            Current Utility Tariff (₹ / kWh)
          </label>
          <input
            type="number"
            step="0.5"
            min="2"
            max="25"
            value={tariff}
            onChange={(e) => setTariff(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-brand-border bg-brand-natural/40 px-3 py-2 text-sm text-brand-forest focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald font-mono"
          />
          <span className="text-[11px] text-brand-sage mt-1 block">
            Average Indian residential slab: ₹6.00 to ₹8.50
          </span>
        </div>

        {/* Input 3: Sunlight Hours */}
        <div>
          <label className="block text-xs font-semibold text-brand-forest mb-1">
            Average Sun Insolation (hrs/day)
          </label>
          <input
            type="number"
            step="0.1"
            min="2"
            max="8"
            value={sunHours}
            onChange={(e) => setSunHours(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-brand-border bg-brand-natural/40 px-3 py-2 text-sm text-brand-forest focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald font-mono"
          />
          <span className="text-[11px] text-brand-sage mt-1 block">
            Typical Indian subcontinent average: 4.5 – 5.2 hrs
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="rounded-xl bg-brand-natural p-4 border border-brand-border">
          <div className="flex items-center text-xs font-medium text-brand-sage">
            <Zap className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
            Recommended System
          </div>
          <div className="mt-2 text-xl font-extrabold text-brand-forest font-mono">
            {potentialCapacityKw.toFixed(1)} kWp
          </div>
          <span className="text-[10px] text-brand-sage mt-0.5 block">
            ~{annualGenerationKwh.toLocaleString()} kWh/yr generation
          </span>
        </div>

        <div className="rounded-xl bg-brand-natural p-4 border border-brand-border">
          <div className="flex items-center text-xs font-medium text-brand-sage">
            <IndianRupee className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
            Estimated Bill Savings
          </div>
          <div className="mt-2 text-xl font-extrabold text-brand-emerald-dark font-mono">
            ₹{annualSavingsInr.toLocaleString()}
          </div>
          <span className="text-[10px] text-brand-sage mt-0.5 block">
            per year (estimated)
          </span>
        </div>

        <div className="rounded-xl bg-brand-natural p-4 border border-brand-border">
          <div className="flex items-center text-xs font-medium text-brand-sage">
            <Sun className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
            Annual Carbon Avoided
          </div>
          <div className="mt-2 text-xl font-extrabold text-brand-forest font-mono">
            {annualCo2SavedKg.toLocaleString()} kg
          </div>
          <span className="text-[10px] text-brand-sage mt-0.5 block">
            CO₂e displaced from grid/yr
          </span>
        </div>

        <div className="rounded-xl bg-brand-natural p-4 border border-brand-border">
          <div className="flex items-center text-xs font-medium text-brand-sage">
            <TreePine className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
            Trees Equivalent
          </div>
          <div className="mt-2 text-xl font-extrabold text-brand-forest font-mono">
            ~{treesEquivalent} trees
          </div>
          <span className="text-[10px] text-brand-sage mt-0.5 block">
            EPA factor (21.77 kg CO₂/tree/yr)
          </span>
        </div>
      </div>

      {/* Assumptions Footer */}
      <div className="mt-4 rounded-xl bg-white p-3 border border-brand-border/70 text-[11px] text-brand-sage flex items-start space-x-2">
        <Info className="h-4 w-4 flex-shrink-0 text-brand-emerald mt-0.5" />
        <p>
          <strong>Methodology & Assumptions:</strong> Conversion factor uses India Central Electricity Authority (CEA) Baseline Database v19 (0.716 kg CO₂e/kWh). Trees equivalence benchmark based on US EPA Greenhouse Gas Equivalencies (21.77 kg sequestered annually per urban tree grown for 10 years). Actual solar yield varies with shading, panel azimuth, tilt angle, inverter efficiency (assumed 80% Performance Ratio), and local utility net-metering regulations.
        </p>
      </div>
    </div>
  );
}
