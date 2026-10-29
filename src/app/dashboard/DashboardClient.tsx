"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { CategoryDonutChart } from "@/components/charts/CategoryDonutChart";
import { ProgressTrendBarChart } from "@/components/charts/ProgressTrendBarChart";
import { AddActivityModal } from "@/components/activities/AddActivityModal";
import {
  Plus,
  Footprints,
  TrendingDown,
  TrendingUp,
  Target,
  Trophy,
  Lightbulb,
  ArrowRight,
  SunMedium,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldAlert,
  Loader2,
  Edit2,
  Trash2,
} from "lucide-react";

interface DashboardClientProps {
  user: any;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);

  const fetchMetrics = async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?period=${selectedPeriod}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setMetrics(data.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(period);
  }, [period]);

  // Greeting time
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const formattedToday = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCompleteRecommendation = async (recId: string) => {
    try {
      await fetch(`/api/recommendations/${recId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      fetchMetrics(period);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recorded activity?")) return;
    try {
      await fetch(`/api/activities/${id}`, { method: "DELETE" });
      fetchMetrics(period);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        {/* Top Greeting & Period Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
              {timeGreeting}, {user.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-brand-sage mt-1">
              {formattedToday} • Let&apos;s make today a greener day.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Period Selector */}
            <div className="inline-flex rounded-xl bg-white p-1 border border-brand-border shadow-sm">
              {[
                { id: "week", label: "This Week" },
                { id: "month", label: "This Month" },
                { id: "year", label: "This Year" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    period === p.id
                      ? "bg-brand-forest text-white shadow-xs"
                      : "text-brand-sage hover:text-brand-forest"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Record Activity CTA */}
            <button
              type="button"
              onClick={() => {
                setEditingActivity(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center rounded-xl bg-brand-emerald px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald transition"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Activity
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && !metrics ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-emerald" />
          </div>
        ) : metrics?.isNewUser ? (
          /* Welcoming Empty State for New Users (No fabricated numbers) */
          <div className="rounded-3xl border-2 border-dashed border-brand-emerald/40 bg-white p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lime/40 text-brand-forest mx-auto">
              <Sparkles className="h-8 w-8 text-brand-emerald-dark" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-forest">
              Welcome to EcoPulse! Your Ledger is Ready
            </h2>
            <p className="text-xs sm:text-sm text-brand-sage max-w-lg mx-auto leading-relaxed">
              We never fabricate impact numbers. To see your live carbon analytics, category breakdown, and personalized recommendations, record your first everyday activity.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingActivity(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center rounded-xl bg-brand-emerald px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Your First Activity
              </button>
              <Link
                href="/challenges"
                className="inline-flex items-center rounded-xl border border-brand-border bg-brand-natural px-6 py-3 text-xs font-semibold text-brand-forest hover:bg-white"
              >
                Browse Challenges
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Estimated Footprint */}
              <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-brand-sage">
                  <span>Estimated Footprint</span>
                  <span className="rounded bg-brand-natural px-2 py-0.5 text-[10px] text-brand-forest border border-brand-border">
                    Estimated
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-brand-forest font-mono">
                  {metrics.totalKgCO2e.toFixed(1)}{" "}
                  <span className="text-xs font-semibold font-sans">kg CO₂e</span>
                </div>
                <p className="text-[11px] text-brand-sage">
                  {metrics.changeDescription}
                </p>
              </div>

              {/* Card 2: Recorded Activities */}
              <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-brand-sage">
                  <span>Logged Entries</span>
                  <Footprints className="h-4 w-4 text-brand-emerald" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-brand-forest font-mono">
                  {metrics.totalActivitiesCount}
                </div>
                <p className="text-[11px] text-brand-sage">
                  in selected {metrics.period}
                </p>
              </div>

              {/* Card 3: Goal Status */}
              <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-brand-sage">
                  <span>Monthly Goal Target</span>
                  <Target className="h-4 w-4 text-brand-forest" />
                </div>
                {metrics.activeGoal ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-black text-brand-forest font-mono">
                      {metrics.activeGoal.progressPercentage}%
                    </div>
                    <p className="text-[11px] text-brand-sage">
                      {metrics.activeGoal.daysRemaining} days remaining in horizon
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold text-brand-sage py-1.5">
                      No target set yet
                    </div>
                    <Link
                      href="/insights"
                      className="text-[11px] font-semibold text-brand-emerald hover:underline block"
                    >
                      Set a reduction target →
                    </Link>
                  </>
                )}
              </div>

              {/* Card 4: Active Challenge */}
              <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-brand-sage">
                  <span>Community Challenge</span>
                  <Trophy className="h-4 w-4 text-amber-500" />
                </div>
                {metrics.activeChallenge ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-black text-brand-emerald-dark font-mono">
                      {metrics.activeChallenge.progressPercentage}%
                    </div>
                    <p className="text-[11px] text-brand-sage truncate">
                      {metrics.activeChallenge.title}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold text-brand-sage py-1.5">
                      0 active challenges
                    </div>
                    <Link
                      href="/challenges"
                      className="text-[11px] font-semibold text-brand-emerald hover:underline block"
                    >
                      Join a challenge →
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Charts Row: Donut breakdown & Trend line/bars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Category Breakdown Donut */}
              <div className="lg:col-span-5 rounded-3xl border border-brand-border bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <h3 className="text-base font-bold text-brand-forest">
                    Category Breakdown
                  </h3>
                  <Link
                    href="/methodology"
                    className="text-[11px] font-semibold text-brand-emerald hover:underline"
                  >
                    Methodology
                  </Link>
                </div>
                <CategoryDonutChart
                  data={metrics.categoryBreakdown}
                  totalKgCO2e={metrics.totalKgCO2e}
                />
              </div>

              {/* Right: Trend Visualization */}
              <div className="lg:col-span-7 rounded-3xl border border-brand-border bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <h3 className="text-base font-bold text-brand-forest">
                    Emissions Over Time
                  </h3>
                  <span className="text-xs font-medium text-brand-sage">
                    {metrics.period === "week"
                      ? "Daily (Past 7 days)"
                      : metrics.period === "year"
                      ? "Monthly trend"
                      : "Weekly intervals"}
                  </span>
                </div>
                <ProgressTrendBarChart
                  data={metrics.trendData}
                  summaryText={metrics.trendSummary}
                />
              </div>
            </div>

            {/* Bottom Row: 3 Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Action Card 1: Today's Challenge */}
              <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700">
                    <Trophy className="h-4 w-4" />
                    <span>Habit Challenge</span>
                  </div>
                  {metrics.activeChallenge ? (
                    <>
                      <h4 className="text-sm font-bold text-brand-forest">
                        {metrics.activeChallenge.title}
                      </h4>
                      <p className="text-xs text-brand-sage">
                        {metrics.activeChallenge.rules}
                      </p>
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-brand-sage mb-1 font-mono">
                          <span>Progress</span>
                          <span>
                            {metrics.activeChallenge.progressValue} /{" "}
                            {metrics.activeChallenge.targetValue}{" "}
                            {metrics.activeChallenge.unit}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-brand-natural overflow-hidden border border-brand-border">
                          <div
                            className="h-full bg-brand-emerald rounded-full"
                            style={{
                              width: `${metrics.activeChallenge.progressPercentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="text-sm font-bold text-brand-forest">
                        The 7-Day 24°C AC Routine
                      </h4>
                      <p className="text-xs text-brand-sage">
                        Adjust your cooling thermostat to 24°C–25°C to save ~6% compressor electricity daily.
                      </p>
                    </>
                  )}
                </div>

                <div className="pt-2 border-t border-brand-border">
                  <Link
                    href="/challenges"
                    className="inline-flex items-center text-xs font-semibold text-brand-emerald hover:text-brand-emerald-dark"
                  >
                    View Community Challenges
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Action Card 2: Action Coach Recommendation */}
              <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-brand-emerald-dark">
                    <Lightbulb className="h-4 w-4" />
                    <span>Action Coach</span>
                  </div>
                  {metrics.recommendedAction ? (
                    <>
                      <h4 className="text-sm font-bold text-brand-forest">
                        {metrics.recommendedAction.title}
                      </h4>
                      <p className="text-xs text-brand-sage leading-relaxed">
                        {metrics.recommendedAction.description}
                      </p>
                      <div className="rounded-xl bg-brand-natural p-2.5 text-[11px] text-brand-sage border border-brand-border/60">
                        {metrics.recommendedAction.whyRecommended}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-brand-sage">
                      No active recommendations at this moment.
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-brand-border flex items-center justify-between">
                  <Link
                    href="/actions"
                    className="inline-flex items-center text-xs font-semibold text-brand-emerald hover:text-brand-emerald-dark"
                  >
                    Explore all actions
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                  {metrics.recommendedAction && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCompleteRecommendation(metrics.recommendedAction.id)
                      }
                      className="rounded-lg bg-brand-natural px-2.5 py-1 text-[11px] font-semibold text-brand-forest hover:bg-brand-border"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>

              {/* Action Card 3: Rooftop Solar Potential */}
              <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700">
                    <SunMedium className="h-4 w-4" />
                    <span>Rooftop Solar Potential</span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-forest">
                    Rooftop PV Feasibility Estimator
                  </h4>
                  <p className="text-xs text-brand-sage leading-relaxed">
                    A typical 300 sq ft unshaded rooftop can host a 3 kWp solar system, avoiding ~3,200 kg CO₂e grid emissions annually.
                  </p>
                  <div className="rounded-xl bg-brand-natural p-2.5 text-[11px] text-brand-sage border border-brand-border/60 font-mono">
                    Baseline factor: CEA 0.716 kg/kWh
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border">
                  <Link
                    href="/solar"
                    className="inline-flex items-center text-xs font-semibold text-brand-emerald hover:text-brand-emerald-dark"
                  >
                    Open Solar Calculator
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-forest">
                    Recent Activity Entries
                  </h3>
                  <p className="text-xs text-brand-sage">
                    Last 5 activities logged into your personal ledger.
                  </p>
                </div>
                <Link
                  href="/footprint"
                  className="inline-flex items-center text-xs font-semibold text-brand-emerald hover:underline"
                >
                  View full activity log
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>

              {metrics.recentActivities.length === 0 ? (
                <p className="text-xs text-brand-sage py-4 text-center">
                  No activity entries logged yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-brand-border bg-brand-natural/60 text-brand-forest font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3 text-right">Quantity</th>
                        <th className="py-2.5 px-3 text-right">Est. Footprint</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {metrics.recentActivities.map((act: any) => (
                        <tr key={act.id} className="hover:bg-brand-natural/30">
                          <td className="py-2.5 px-3 text-brand-forest font-medium whitespace-nowrap">
                            {new Date(act.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="rounded-md bg-brand-natural px-2 py-0.5 text-[11px] font-semibold text-brand-forest border border-brand-border">
                              {act.category.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-brand-sage">
                            {act.activityType}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-brand-forest">
                            {act.amount} {act.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-emerald-dark">
                            {act.calculatedKgCO2e.toFixed(2)} kg
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingActivity(act);
                                setIsModalOpen(true);
                              }}
                              className="text-brand-sage hover:text-brand-forest p-1"
                              aria-label="Edit entry"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(act.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Activity Modal */}
      <AddActivityModal
        isOpen={isModalOpen}
        initialData={editingActivity}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSuccess={() => {
          fetchMetrics(period);
        }}
      />
    </AppShell>
  );
}
