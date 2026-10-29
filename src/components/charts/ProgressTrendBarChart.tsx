"use client";

import { useState } from "react";
import { Table, BarChart2 } from "lucide-react";

interface TrendPoint {
  label: string;
  date: string;
  kgCO2e: number;
}

interface ProgressTrendBarChartProps {
  data: TrendPoint[];
  summaryText: string;
}

export function ProgressTrendBarChart({
  data,
  summaryText,
}: ProgressTrendBarChartProps) {
  const [showTable, setShowTable] = useState(false);
  const [activePoint, setActivePoint] = useState<TrendPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-brand-border bg-brand-natural/40 p-6 text-center">
        <BarChart2 className="h-10 w-10 text-brand-sage/50 mb-2" />
        <p className="text-sm font-semibold text-brand-forest">
          No trend data recorded yet
        </p>
        <p className="text-xs text-brand-sage max-w-xs mt-1">
          Trend lines will automatically generate as you log your daily activities.
        </p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.kgCO2e), 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-sage">
          {summaryText}
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
                <th className="py-2 px-3">Interval / Date</th>
                <th className="py-2 px-3 text-right">Estimated kg CO₂e</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {data.map((d, idx) => (
                <tr key={idx} className="hover:bg-brand-natural/30">
                  <td className="py-2 px-3 font-medium text-brand-forest">
                    {d.label} ({d.date})
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-brand-forest">
                    {d.kgCO2e.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Active tooltip banner */}
          <div className="h-6 text-xs text-brand-emerald-dark font-medium flex items-center">
            {activePoint ? (
              <span>
                <strong>{activePoint.label}</strong>: {activePoint.kgCO2e.toFixed(2)} kg CO₂e estimated
              </span>
            ) : (
              <span className="text-brand-sage">Hover over bars to inspect interval impact</span>
            )}
          </div>

          {/* Bars */}
          <div className="flex h-44 items-end gap-2 sm:gap-3 border-b border-brand-border pt-4 pb-1">
            {data.map((item, idx) => {
              const heightPercent = Math.max(
                4,
                Math.round((item.kgCO2e / maxVal) * 100)
              );
              return (
                <div
                  key={idx}
                  className="group relative flex-1 flex flex-col items-center h-full justify-end"
                  onMouseEnter={() => setActivePoint(item)}
                  onMouseLeave={() => setActivePoint(null)}
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-200 ${
                      item.kgCO2e > 0
                        ? "bg-brand-emerald group-hover:bg-brand-forest"
                        : "bg-brand-border/60"
                    }`}
                  />
                  <span className="mt-2 text-[10px] text-brand-sage truncate w-full text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
