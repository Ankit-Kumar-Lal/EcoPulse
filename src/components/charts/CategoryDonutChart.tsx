"use client";

import { useState } from "react";
import Link from "next/link";
import { Table, PieChart } from "lucide-react";

interface CategoryData {
  category: string;
  kgCO2e: number;
  percentage: number;
  count: number;
}

interface CategoryDonutChartProps {
  data: CategoryData[];
  totalKgCO2e: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  HOME_ENERGY: "#12372A", // Forest Green
  TRANSPORT: "#16A36A",   // Emerald Green
  FOOD: "#0E7A4E",        // Dark Emerald
  WATER: "#0284C7",       // Ocean Blue
  WASTE: "#D97706",       // Amber
};

const CATEGORY_LABELS: Record<string, string> = {
  HOME_ENERGY: "Home Energy",
  TRANSPORT: "Transport",
  FOOD: "Food & Diet",
  WATER: "Water Usage",
  WASTE: "Waste & Disposal",
};

export function CategoryDonutChart({
  data,
  totalKgCO2e,
}: CategoryDonutChartProps) {
  const [showTable, setShowTable] = useState(false);

  if (!data || data.length === 0 || totalKgCO2e === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-brand-border bg-brand-natural/40 p-6 text-center">
        <PieChart className="h-10 w-10 text-brand-sage/50 mb-2" />
        <p className="text-sm font-semibold text-brand-forest">
          No emissions recorded yet
        </p>
        <p className="text-xs text-brand-sage max-w-xs mt-1">
          Add your first activity (electricity bill, commute, or meals) to visualize your category breakdown.
        </p>
      </div>
    );
  }

  // Calculate SVG donut segments
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const segments = data.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += item.percentage;

    return {
      category: item.category,
      label: CATEGORY_LABELS[item.category] || item.category,
      color: CATEGORY_COLORS[item.category] || "#64756B",
      kgCO2e: item.kgCO2e,
      percentage: item.percentage,
      count: item.count,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-sage">
          Category share of total estimated footprint
        </span>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="inline-flex items-center text-xs font-medium text-brand-sage hover:text-brand-forest"
          aria-label={showTable ? "Show visual chart" : "Show accessible data table"}
        >
          <Table className="mr-1 h-3.5 w-3.5" />
          {showTable ? "Chart View" : "Table View"}
        </button>
      </div>

      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-brand-border bg-brand-natural/60 text-brand-forest font-semibold">
              <tr>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3 text-right">Est. kg CO₂e</th>
                <th className="py-2 px-3 text-right">Share (%)</th>
                <th className="py-2 px-3 text-right">Records</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {segments.map((s) => (
                <tr key={s.category} className="hover:bg-brand-natural/30">
                  <td className="py-2 px-3 flex items-center space-x-2 font-medium text-brand-forest">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                      aria-hidden="true"
                    />
                    <span>{s.label}</span>
                  </td>
                  <td className="py-2 px-3 text-right text-brand-forest font-mono">
                    {s.kgCO2e.toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-right text-brand-forest">
                    {s.percentage}%
                  </td>
                  <td className="py-2 px-3 text-right text-brand-sage">
                    {s.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Donut graphic */}
          <div className="relative flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="-rotate-90 transform"
              role="img"
              aria-label="Category emissions donut chart"
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#E2E8DE"
                strokeWidth={strokeWidth}
              />
              {segments.map((s) => (
                <circle
                  key={s.category}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={s.strokeDasharray}
                  strokeDashoffset={s.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-brand-forest">
                {totalKgCO2e.toFixed(0)}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-sage">
                kg CO₂e
              </span>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="space-y-2 flex-1 max-w-xs">
            {segments.map((s) => (
              <Link
                key={s.category}
                href={`/footprint?category=${s.category}`}
                className="group flex items-center justify-between rounded-lg p-1.5 transition hover:bg-brand-natural"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs font-medium text-brand-forest group-hover:text-brand-emerald">
                    {s.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-brand-forest font-mono">
                    {s.percentage}%
                  </span>
                  <span className="text-[11px] text-brand-sage block font-mono">
                    {s.kgCO2e.toFixed(1)} kg
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
