"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  TrendingUp,
  Target,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Scale,
  Sparkles,
  Info,
  Loader2,
} from "lucide-react";

interface InsightsClientProps {
  user: any;
}

export function InsightsClient({ user }: InsightsClientProps) {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreatingGoal, setIsCreatingGoal] = useState<boolean>(false);

  // New goal form state
  const [goalTitle, setGoalTitle] = useState("Q4 Electricity Reduction Target");
  const [goalCategory, setGoalCategory] = useState<string>("HOME_ENERGY");
  const [targetKg, setTargetKg] = useState("200");
  const [timeHorizon, setTimeHorizon] = useState("monthly");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split("T")[0]
  );
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [goalError, setGoalError] = useState<string | null>(null);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      if (res.ok && data.data) {
        setGoals(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingGoal(true);
    setGoalError(null);

    try {
      const payload = {
        title: goalTitle,
        category: goalCategory === "ALL" ? null : goalCategory,
        targetKgCO2e: parseFloat(targetKg),
        timeHorizon,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };

      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to set reduction goal.");
      }

      setIsCreatingGoal(false);
      fetchGoals();
    } catch (err: any) {
      setGoalError(err.message || "Failed to create target.");
    } finally {
      setSubmittingGoal(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to remove this goal?")) return;
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" });
      fetchGoals();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
              Insights & Reduction Goals
            </h1>
            <p className="text-xs sm:text-sm text-brand-sage mt-1">
              Set verifiable carbon reduction budgets, track active horizons, and monitor progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatingGoal(true)}
            className="inline-flex items-center rounded-xl bg-brand-emerald px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Set New Target
          </button>
        </div>

        {/* Create Goal Modal / Form Drawer */}
        {isCreatingGoal && (
          <div className="rounded-3xl border border-brand-emerald/40 bg-emerald-50/40 p-6 sm:p-8 space-y-4 shadow-sm animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-forest">
                Define Reduction Target
              </h2>
              <button
                type="button"
                onClick={() => setIsCreatingGoal(false)}
                className="text-xs font-semibold text-brand-sage hover:text-brand-forest"
              >
                Cancel
              </button>
            </div>

            {goalError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-800 border border-red-200">
                {goalError}
              </div>
            )}

            <form onSubmit={handleCreateGoal} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Target Title
                </label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Keep Monthly Transit Below 50 kg CO₂e"
                  className="w-full rounded-xl border border-brand-border bg-white px-3.5 py-2 text-xs text-brand-forest focus:border-brand-emerald focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Category Focus
                </label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  className="w-full rounded-xl border border-brand-border bg-white px-3.5 py-2 text-xs text-brand-forest focus:border-brand-emerald focus:outline-none"
                >
                  <option value="ALL">Overall Footprint (All Categories)</option>
                  <option value="HOME_ENERGY">Home Energy</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="FOOD">Food & Diet</option>
                  <option value="WATER">Water</option>
                  <option value="WASTE">Waste</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Target Maximum Budget (kg CO₂e)
                </label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={targetKg}
                  onChange={(e) => setTargetKg(e.target.value)}
                  className="w-full rounded-xl border border-brand-border bg-white px-3.5 py-2 text-xs text-brand-forest focus:border-brand-emerald focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-brand-border bg-white px-3.5 py-2 text-xs text-brand-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-brand-border bg-white px-3.5 py-2 text-xs text-brand-forest"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingGoal(false)}
                  className="rounded-xl border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-sage hover:text-brand-forest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGoal}
                  className="rounded-xl bg-brand-emerald px-5 py-2 text-xs font-semibold text-white hover:bg-brand-emerald-dark disabled:opacity-50"
                >
                  {submittingGoal ? "Saving..." : "Save Reduction Target"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Goals Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-forest">
            Active Targets & Carbon Budgets
          </h2>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand-emerald" />
            </div>
          ) : goals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-border bg-white p-8 text-center space-y-3">
              <Target className="h-10 w-10 text-brand-sage/40 mx-auto" />
              <h3 className="text-base font-bold text-brand-forest">
                No active reduction goals set
              </h3>
              <p className="text-xs text-brand-sage max-w-sm mx-auto">
                Setting a specific emissions ceiling for the month or quarter helps make progress achievable.
              </p>
              <button
                type="button"
                onClick={() => setIsCreatingGoal(true)}
                className="inline-flex items-center rounded-xl bg-brand-forest px-4 py-2 text-xs font-semibold text-white hover:bg-brand-forest/90"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Define Target
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((g) => {
                const daysLeft = Math.max(
                  0,
                  Math.ceil(
                    (new Date(g.endDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                );
                return (
                  <div
                    key={g.id}
                    className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="rounded bg-brand-natural px-2.5 py-0.5 text-[10px] font-bold text-brand-forest border border-brand-border">
                          {g.category ? g.category.replace("_", " ") : "Overall Footprint"}
                        </span>
                        <h3 className="mt-2 text-base font-bold text-brand-forest">
                          {g.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteGoal(g.id)}
                        className="text-brand-sage hover:text-red-600 p-1"
                        aria-label="Delete goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-xl bg-brand-natural p-4 border border-brand-border flex items-center justify-between font-mono">
                      <div>
                        <span className="text-[11px] text-brand-sage block font-sans">
                          Emissions Ceiling
                        </span>
                        <span className="text-lg font-black text-brand-forest">
                          {g.targetKgCO2e} kg
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-brand-sage block font-sans">
                          Time Horizon
                        </span>
                        <span className="text-xs font-semibold text-brand-emerald-dark font-sans">
                          {daysLeft} days remaining
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-brand-sage flex items-center justify-between border-t border-brand-border/60 pt-3">
                      <span>
                        Window: {new Date(g.startDate).toLocaleDateString()} – {new Date(g.endDate).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-brand-forest">
                        Status: Active
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coverage & Transparency Explainer */}
        <div className="rounded-3xl border border-brand-border bg-white p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-brand-forest font-bold text-base">
            <Info className="h-5 w-5 text-brand-emerald" />
            <h2>Data Coverage & Comparison Methodology</h2>
          </div>
          <div className="text-xs sm:text-sm text-brand-sage space-y-2 leading-relaxed">
            <p>
              EcoPulse strictly adheres to <strong>transparent coverage rules</strong>. When comparing the current reporting period against the prior period:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Comparisons are calculated only when both periods have recorded activity data.</li>
              <li>Missing days are never silently treated as zero emissions.</li>
              <li>When prior data is unavailable, EcoPulse indicates that the current period serves as your baseline.</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
