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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
              Action Coach Recommendations
            </h1>
            <p className="text-xs sm:text-sm text-brand-sage mt-1">
              Rules-based, explainable sustainability guidance tied to your consumption patterns with stated assumptions.
            </p>
          </div>

          <div className="inline-flex items-center rounded-xl bg-brand-natural px-3 py-1.5 text-xs text-brand-forest border border-brand-border">
            <Scale className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
            <span>Deterministic Rules-Based Engine</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-forest">
            <span>Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-brand-border bg-white px-3 py-1.5 text-xs text-brand-forest"
            >
              <option value="ALL">All Categories</option>
              <option value="HOME_ENERGY">Home Energy</option>
              <option value="TRANSPORT">Transport</option>
              <option value="FOOD">Food & Diet</option>
              <option value="WATER">Water</option>
              <option value="WASTE">Waste</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-forest">
            <span>Effort Level:</span>
            <select
              value={filterEffort}
              onChange={(e) => setFilterEffort(e.target.value)}
              className="rounded-xl border border-brand-border bg-white px-3 py-1.5 text-xs text-brand-forest"
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
            <Loader2 className="h-8 w-8 animate-spin text-brand-emerald" />
          </div>
        ) : filteredRecs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-border bg-white p-12 text-center">
            <p className="text-sm font-semibold text-brand-forest">
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
                  className={`rounded-3xl border p-6 shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                    isCompleted
                      ? "border-emerald-300 bg-emerald-50/40"
                      : isDismissed
                      ? "border-brand-border bg-brand-natural/40 opacity-70"
                      : "border-brand-border bg-white hover:shadow-md"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="rounded-md bg-brand-natural px-2.5 py-1 font-semibold text-brand-forest border border-brand-border">
                          {rec.category.replace("_", " ")}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 font-semibold text-[10px] ${
                            rec.effort === "LOW"
                              ? "bg-emerald-100 text-emerald-800"
                              : rec.effort === "MEDIUM"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {rec.effort} EFFORT
                        </span>
                      </div>

                      <span className="font-mono font-bold text-brand-emerald-dark text-xs">
                        ~{rec.potentialSavingKgCO2e} kg CO₂e / mo
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-brand-forest">
                      {rec.title}
                    </h2>

                    <p className="text-xs text-brand-sage leading-relaxed">
                      {rec.description}
                    </p>

                    {/* Action Steps */}
                    <div className="rounded-2xl bg-brand-natural/70 p-3.5 border border-brand-border space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-forest block">
                        Action Steps:
                      </span>
                      <ul className="text-xs text-brand-forest/90 space-y-1">
                        {steps.map((st, i) => (
                          <li key={i} className="flex items-start">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald mt-1.5 mr-2 flex-shrink-0" />
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Assumptions & Sources */}
                    <div className="text-[11px] text-brand-sage space-y-1 pt-1">
                      <p>
                        <strong>Assumptions:</strong> {rec.assumptions}
                      </p>
                      <p>
                        <strong>Source:</strong> {rec.source}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-brand-border/70">
                    {isCompleted ? (
                      <span className="inline-flex items-center text-xs font-bold text-brand-emerald-dark">
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Completed
                      </span>
                    ) : isDismissed ? (
                      <span className="text-xs text-brand-sage">
                        Dismissed from dashboard
                      </span>
                    ) : (
                      <span className="text-xs text-brand-sage font-medium">
                        Ready to apply
                      </span>
                    )}

                    <div className="flex items-center space-x-2">
                      {isCompleted || isDismissed ? (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(rec.id, "SHOWN")}
                          className="inline-flex items-center rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-forest hover:bg-brand-natural"
                        >
                          <RotateCcw className="mr-1 h-3 w-3" />
                          Restore
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(rec.id, "DISMISSED")}
                            className="rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-sage hover:text-brand-forest"
                          >
                            Dismiss
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(rec.id, "COMPLETED")}
                            className="inline-flex items-center rounded-lg bg-brand-emerald px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-emerald-dark"
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
