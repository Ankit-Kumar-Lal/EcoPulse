"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  Loader2,
  Scale,
} from "lucide-react";

interface ActionsClientProps {
  user: any;
}

export function ActionsClient({ user }: ActionsClientProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterEffort, setFilterEffort] = useState<string>("ALL");

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations");
      const data = await res.json();
      if (res.ok && data.data) {
        setRecommendations(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/recommendations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchRecommendations();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRecs = recommendations.filter((r) => {
    const matchesCat =
      filterCategory === "ALL" || r.category === filterCategory;
    const matchesEffort =
      filterEffort === "ALL" || r.effort === filterEffort;
    return matchesCat && matchesEffort;
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0D2E22]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              Action Coach Recommendations
            </h1>
            <p className="text-xs sm:text-sm text-[#8BA398] mt-1">
              Rules-based, explainable sustainability guidance tied to your consumption patterns with stated assumptions.
            </p>
          </div>

          <div className="inline-flex items-center rounded-2xl bg-[#091F18] px-3.5 py-1.5 text-xs text-[#34D399] border border-[#143E30]">
            <Scale className="mr-1.5 h-3.5 w-3.5 text-[#10B981]" />
            <span>Deterministic Rules-Based Engine</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8BA398]">
            <span>Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-[#143E30] bg-[#091F18] px-3 py-1.5 text-xs text-white focus:border-[#10B981] focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="HOME_ENERGY">Home Energy</option>
              <option value="TRANSPORT">Transport</option>
              <option value="FOOD">Food & Diet</option>
              <option value="WATER">Water</option>
              <option value="WASTE">Waste</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8BA398]">
            <span>Effort Level:</span>
            <select
              value={filterEffort}
              onChange={(e) => setFilterEffort(e.target.value)}
              className="rounded-xl border border-[#143E30] bg-[#091F18] px-3 py-1.5 text-xs text-white focus:border-[#10B981] focus:outline-none"
            >
              <option value="ALL">All Efforts</option>
              <option value="LOW">Low Effort</option>
              <option value="MEDIUM">Medium Effort</option>
              <option value="HIGH">High Effort</option>
            </select>
          </div>
        </div>

        {/* Recommendations Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
          </div>
        ) : filteredRecs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#143E30] bg-[#091F18] p-12 text-center">
            <p className="text-sm font-semibold text-white">
              No recommendations match the selected filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecs.map((rec) => {
              let steps: string[] = [];
              try {
                steps = JSON.parse(rec.actionSteps);
              } catch {
                steps = [rec.actionSteps];
              }

              const isCompleted = rec.userStatus === "COMPLETED";
              const isDismissed = rec.userStatus === "DISMISSED";

              return (
                <div
                  key={rec.id}
                  className={`rounded-3xl border p-6 shadow-xl transition-all flex flex-col justify-between space-y-4 ${
                    isCompleted
                      ? "border-[#10B981]/50 bg-[#0A291E]"
                      : isDismissed
                      ? "border-[#0D2E22] bg-[#06140F]/80 opacity-60"
                      : "border-[#143E30] bg-[#091F18] hover:border-[#10B981]/30"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="rounded-xl bg-[#06140F] px-3 py-1 font-semibold text-[#34D399] border border-[#0D2E22]">
                          {rec.category.replace("_", " ")}
                        </span>
                        <span
                          className={`rounded-xl px-2.5 py-1 font-bold text-[10px] ${
                            rec.effort === "LOW"
                              ? "bg-emerald-950/60 text-[#34D399] border border-[#10B981]/30"
                              : rec.effort === "MEDIUM"
                              ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                              : "bg-purple-950/60 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {rec.effort} EFFORT
                        </span>
                      </div>

                      <span className="font-mono font-bold text-[#34D399] text-xs">
                        ~{rec.potentialSavingKgCO2e} kg CO₂e / mo
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white">
                      {rec.title}
                    </h2>

                    <p className="text-xs text-[#8BA398] leading-relaxed">
                      {rec.description}
                    </p>

                    {/* Action Steps */}
                    <div className="rounded-2xl bg-[#06140F] p-4 border border-[#0D2E22] space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                        Action Steps:
                      </span>
                      <ul className="text-xs text-[#E2F0EA] space-y-1.5">
                        {steps.map((st, i) => (
                          <li key={i} className="flex items-start">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mt-1.5 mr-2 flex-shrink-0" />
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Assumptions & Sources */}
                    <div className="text-[11px] text-[#718E80] space-y-1 pt-1 leading-relaxed">
                      <p>
                        <strong className="text-[#8BA398]">Assumptions:</strong> {rec.assumptions}
                      </p>
                      <p>
                        <strong className="text-[#8BA398]">Source:</strong> {rec.source}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#0D2E22]">
                    {isCompleted ? (
                      <span className="inline-flex items-center text-xs font-bold text-[#34D399]">
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Completed
                      </span>
                    ) : isDismissed ? (
                      <span className="text-xs text-[#718E80]">
                        Dismissed from dashboard
                      </span>
                    ) : (
                      <span className="text-xs text-[#718E80] font-medium">
                        Ready to apply
                      </span>
                    )}

                    <div className="flex items-center space-x-2">
                      {isCompleted || isDismissed ? (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(rec.id, "SHOWN")}
                          className="inline-flex items-center rounded-xl border border-[#143E30] bg-[#06140F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B251D] transition"
                        >
                          <RotateCcw className="mr-1 h-3 w-3" />
                          Restore
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(rec.id, "DISMISSED")}
                            className="rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-1.5 text-xs font-semibold text-[#8BA398] hover:text-white transition"
                          >
                            Dismiss
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(rec.id, "COMPLETED")}
                            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:brightness-110 transition"
                          >
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            Mark Done
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
