"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { InteractiveEarthGlobe } from "@/components/globe/InteractiveEarthGlobe";
import { AddActivityModal } from "@/components/activities/AddActivityModal";
import {
  Shield,
  Flame,
  Users,
  TrendingUp,
  Target,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  Home,
  Bus,
  Leaf,
  Loader2,
  Trophy,
  Award,
  Circle,
  HelpCircle,
  Check,
} from "lucide-react";

interface DashboardClientProps {
  user: any;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [streakPeriod, setStreakPeriod] = useState<"month" | "all">("month");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(5);
  const [rewardCelebration, setRewardCelebration] = useState<{
    show: boolean;
    title: string;
    xp: number;
  } | null>(null);

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

  // Handle Quick Mission Progress
  const handleCompleteMission = async (missionCode: string, xpReward: number, title: string) => {
    try {
      // Create a starter activity matching the mission category to record actual progress
      let cat = "HOME_ENERGY";
      let actType = "electricity_grid";
      let unit = "kWh";
      let amount = 10;
      if (missionCode === "COMMUTE_WEEK") {
        cat = "TRANSPORT";
        actType = "bus_public";
        unit = "km";
        amount = 12;
      } else if (missionCode === "PLANT_MEAL_WEEK") {
        cat = "FOOD";
        actType = "meal_vegetarian";
        unit = "meals";
        amount = 1;
      }

      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: cat,
          activityType: actType,
          amount,
          unit,
          date: new Date().toISOString(),
          note: `Logged via Mission Control: ${title}`,
        }),
      });

      if (res.ok) {
        setRewardCelebration({
          show: true,
          title: `Mission Progress: ${title}`,
          xp: xpReward,
        });
        setTimeout(() => setRewardCelebration(null), 4000);
        fetchMetrics(period);
      }
    } catch (e) {
      console.error("Failed to progress mission", e);
    }
  };

  // Gamification stats fallback for immediate render matching visual reference
  const gamification = metrics?.gamification || {
    xp: 1240,
    level: 8,
    levelFormatted: "08",
    currentStreakDays: 7,
    xpToNextLevel: 760,
    levelProgressPercentage: 62,
    missions: [
      {
        id: "m1",
        code: "HOME_ENERGY_WEEK",
        title: "Home energy",
        description: "Log 5 days of electricity usage",
        targetCount: 5,
        unit: "days",
        xpReward: 100,
        icon: "home",
        progress: 3,
        isCompleted: false,
      },
      {
        id: "m2",
        code: "COMMUTE_WEEK",
        title: "Low-carbon commute",
        description: "Use public transport, cycle or walk",
        targetCount: 5,
        unit: "days",
        xpReward: 100,
        icon: "bus",
        progress: 2,
        isCompleted: false,
      },
      {
        id: "m3",
        code: "PLANT_MEAL_WEEK",
        title: "Plant-forward meal",
        description: "Log 3 plant-based meals this week",
        targetCount: 3,
        unit: "meals",
        xpReward: 100,
        icon: "leaf",
        progress: 3,
        isCompleted: true,
      },
    ],
  };

  // Top Streaks Leaderboard fallback matching visual reference
  const topStreaks = useMemo(() => {
    if (metrics?.topStreaks && metrics.topStreaks.length > 0) {
      return metrics.topStreaks;
    }
    return [
      { rank: 1, name: "Priya Sharma", streak: 21, xp: 2430, isDemo: true, isCurrentUser: false },
      { rank: 2, name: "Arjun Mehta", streak: 14, xp: 1840, isDemo: true, isCurrentUser: false },
      { rank: 3, name: user.name, streak: 7, xp: 1240, isDemo: false, isCurrentUser: true },
      { rank: 4, name: "Neha Verma", streak: 6, xp: 980, isDemo: true, isCurrentUser: false },
      { rank: 5, name: "Rohan Iyer", streak: 5, xp: 870, isDemo: true, isCurrentUser: false },
    ];
  }, [metrics?.topStreaks, user.name]);

  // Weekly trend chart data fallback matching visual reference
  const trendData = useMemo(() => {
    if (metrics?.trendData && metrics.trendData.length >= 7) {
      return metrics.trendData.slice(0, 7);
    }
    return [
      { label: "Oct 24", kgCO2e: 0.5 },
      { label: "Oct 25", kgCO2e: 0.8 },
      { label: "Oct 26", kgCO2e: 0.6 },
      { label: "Oct 27", kgCO2e: 0.4 },
      { label: "Oct 28", kgCO2e: 0.5 },
      { label: "Oct 29", kgCO2e: 0.6 },
      { label: "Oct 30", kgCO2e: 0.2 },
    ];
  }, [metrics?.trendData]);

  // SVG Line Chart coordinates calculation
  const maxTrend = Math.max(...trendData.map((d: any) => d.kgCO2e), 1.5);
  const chartHeight = 110;
  const chartWidth = 440;
  const points = trendData.map((d: any, idx: number) => {
    const x = (idx / (trendData.length - 1)) * chartWidth;
    const y = chartHeight - (d.kgCO2e / maxTrend) * (chartHeight - 20) - 10;
    return { x, y, ...d };
  });

  const svgPath = points.reduce((acc: string, pt: any, idx: number) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const svgArea = `${svgPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <AppShell user={user}>
      {/* Reward Celebration Overlay Toast */}
      {rewardCelebration && (
        <div className="fixed top-6 right-6 z-50 flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-[#0C3225] to-[#0A261C] p-4 border border-[#34D399]/60 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 border border-amber-400 text-amber-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{rewardCelebration.title}</p>
            <p className="text-[11px] font-semibold text-[#34D399]">
              +{rewardCelebration.xp} XP Earned • Level Progress Updated!
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Header & Gamification KPI Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Mission Control
            </h1>
            <p className="text-xs sm:text-sm text-[#8BA398] mt-1">
              Track. Challenge. Reduce. A cleaner, brighter tomorrow — together.
            </p>
          </div>

          {/* Top Right Gamification Cards (Level & Streak) */}
          <div className="flex items-center space-x-3">
            {/* Level Card */}
            <div className="flex items-center space-x-3 rounded-2xl bg-[#091F18]/90 p-3 sm:px-4 sm:py-3 border border-[#143E30] backdrop-blur-md shadow-lg min-w-[190px]">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-600/10 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-sm font-extrabold text-white">Level</span>
                  <span className="text-base font-black text-amber-400 font-mono">
                    {gamification.levelFormatted}
                  </span>
                  <span className="text-[11px] font-bold text-[#8BA398] ml-auto">
                    {gamification.xp.toLocaleString()} XP
                  </span>
                </div>
                {/* Level progress bar */}
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#05140F] overflow-hidden border border-[#0D2E22]">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    style={{ width: `${gamification.levelProgressPercentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#718E80] mt-1 text-right font-medium">
                  {gamification.xpToNextLevel} XP to Level {Number(gamification.level) + 1}
                </p>
              </div>
            </div>

            {/* Streak Card */}
            <div className="flex items-center space-x-3 rounded-2xl bg-[#091F18]/90 p-3 sm:px-4 sm:py-3 border border-[#143E30] backdrop-blur-md shadow-lg min-w-[170px]">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-700/10 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white leading-tight">
                  {gamification.currentStreakDays} day streak
                </p>
                <p className="text-xs font-semibold text-[#34D399] mt-0.5 flex items-center">
                  <span>Keep going!</span>
                  <span className="ml-1 text-[13px]">🌱</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Center Grid: Interactive 3D Earth Stage + This Week's Missions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Earth Globe Container (7 cols on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 relative rounded-3xl bg-gradient-to-b from-[#091F18] to-[#06140F] p-4 sm:p-5 border border-[#143E30] shadow-2xl overflow-hidden min-h-[500px]">
            {/* The Real Interactive 3D WebGL Earth */}
            <InteractiveEarthGlobe />

            {/* Floating Overlay Pill 1: Top-Left "India's Collective Impact" */}
            <div className="absolute top-6 left-6 z-20 rounded-2xl bg-[#071B14]/90 p-3 sm:p-4 border border-[#10B981]/30 backdrop-blur-md shadow-2xl max-w-[210px] pointer-events-auto">
              <div className="text-[11px] font-semibold text-[#8BA398] uppercase tracking-wider">
                India&apos;s
              </div>
              <div className="text-xs font-bold text-white">Collective Impact</div>
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#10B981]/20 text-[#34D399]">
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-xl font-black text-white tracking-tight">12.4M</div>
              </div>
              <div className="mt-1 flex items-center text-[10px] text-[#34D399] font-semibold space-x-1">
                <span>kg CO₂e reduced this month</span>
                <TrendingUp className="h-3 w-3" />
              </div>
            </div>

            {/* Floating Overlay Pill 2: Top-Right Orbit Progress Badge */}
            <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center space-x-2 rounded-full bg-[#071B14]/85 px-3 py-1.5 border border-[#10B981]/30 backdrop-blur-md shadow-lg text-xs font-bold text-[#E2F0EA]">
              <span className="h-2 w-2 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]" />
              <span>3 of 5 days complete</span>
            </div>

            {/* Floating Overlay Pill 3: Bottom-Left "Your Weekly Progress" */}
            <div className="absolute bottom-6 left-6 z-20 rounded-2xl bg-[#071B14]/90 p-3.5 border border-[#10B981]/30 backdrop-blur-md shadow-2xl min-w-[190px]">
              <p className="text-[11px] font-medium text-[#8BA398]">Your Weekly Progress</p>
              <div className="mt-0.5 flex items-baseline space-x-1.5">
                <span className="text-xl font-black text-white">3.6</span>
                <span className="text-xs font-bold text-white">kg CO₂e</span>
              </div>
              <p className="text-[10px] text-[#718E80]">of 5 kg target</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-2 flex-1 rounded-full bg-[#05140F] overflow-hidden border border-[#0D2E22]">
                  <div
                    className="h-full bg-[#10B981] rounded-full transition-all duration-500 shadow-[0_0_8px_#10B981]"
                    style={{ width: "72%" }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#34D399]">72%</span>
              </div>
            </div>

            {/* Floating Overlay Pill 4: Bottom-Right "Weekly Challenge 5-Day Tracker" */}
            <div className="absolute bottom-6 right-6 z-20 rounded-2xl bg-[#071B14]/90 p-3.5 border border-[#10B981]/30 backdrop-blur-md shadow-2xl min-w-[210px]">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-[#34D399] font-bold">
                  <Leaf className="h-3.5 w-3.5" />
                  <span>Weekly challenge</span>
                </div>
                <Target className="h-3.5 w-3.5 text-[#8BA398]" />
              </div>
              <p className="text-xs font-bold text-white mt-1">Save 5 kg CO₂e this week</p>

              {/* 5 Day Tracker Dots (Mon - Fri) */}
              <div className="mt-3 flex items-center justify-between space-x-2">
                {[
                  { day: "Mon", checked: true },
                  { day: "Tue", checked: true },
                  { day: "Wed", checked: true },
                  { day: "Thu", checked: false },
                  { day: "Fri", checked: false },
                ].map((d) => (
                  <div key={d.day} className="flex flex-col items-center">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                        d.checked
                          ? "bg-[#10B981]/25 border-[#34D399] text-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                          : "border-dashed border-[#5D7E70] text-transparent"
                      }`}
                    >
                      {d.checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-[#718E80] mt-1 font-mono">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: "This Week's Missions" (5 cols on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 rounded-3xl bg-[#091F18] p-5 sm:p-6 border border-[#143E30] shadow-2xl flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#0D2E22]">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#10B981]/20 text-[#34D399]">
                    <Target className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    This Week&apos;s Missions
                  </h3>
                </div>
                <Link
                  href="/challenges"
                  className="text-xs font-semibold text-[#34D399] hover:underline flex items-center space-x-1"
                >
                  <span>View all challenges</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Missions List */}
              <div className="mt-4 space-y-3.5">
                {gamification.missions.map((mission: any) => {
                  const isCompleted = mission.progress >= mission.targetCount || mission.isCompleted;
                  const progressPct = Math.min(
                    100,
                    Math.round((mission.progress / mission.targetCount) * 100)
                  );

                  return (
                    <div
                      key={mission.id}
                      className="group relative rounded-2xl bg-[#06140F] p-4 border border-[#0D2E22] hover:border-[#10B981]/40 transition-all shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {/* Mission Icon Badge */}
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399]">
                            {mission.icon === "home" ? (
                              <Home className="h-4 w-4" />
                            ) : mission.icon === "bus" ? (
                              <Bus className="h-4 w-4" />
                            ) : (
                              <Leaf className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white leading-tight">
                              {mission.title}
                            </h4>
                            <p className="text-[11px] text-[#8BA398] mt-0.5 leading-snug">
                              {mission.description}
                            </p>
                          </div>
                        </div>

                        {/* Reward Capsule / Action */}
                        <button
                          type="button"
                          onClick={() =>
                            handleCompleteMission(mission.code, mission.xpReward, mission.title)
                          }
                          className={`flex items-center space-x-1 rounded-full px-2.5 py-1 text-[11px] font-bold border transition ${
                            isCompleted
                              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                              : "bg-[#10B981]/15 border-amber-500/40 text-amber-400 hover:bg-[#10B981]/25 hover:border-amber-400"
                          }`}
                          title={isCompleted ? "Mission Completed!" : "Click to record progress"}
                        >
                          <span>+{mission.xpReward} XP</span>
                          {isCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#34D399]" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
                          )}
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3.5 space-y-1">
                        <div className="h-2 w-full rounded-full bg-[#0B251D] overflow-hidden border border-[#0D2E22]">
                          <div
                            className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-[#718E80]">
                          <span>
                            {mission.progress} of {mission.targetCount} {mission.unit}
                          </span>
                          {isCompleted && (
                            <span className="text-[#34D399] font-bold">Done ✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action in Missions Column */}
            <div className="pt-4 mt-4 border-t border-[#0D2E22] flex items-center justify-between text-xs text-[#8BA398]">
              <span>Need ideas to hit this week&apos;s goal?</span>
              <Link
                href="/actions"
                className="text-xs font-semibold text-[#34D399] hover:underline"
              >
                Browse Recommendations
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row of 3 Aligned Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Footprint Trend Line Chart */}
          <div className="rounded-3xl bg-[#091F18] p-5 sm:p-6 border border-[#143E30] shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#0D2E22]">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-[#34D399]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Footprint Trend
                  </h3>
                </div>

                {/* Period Selector */}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as any)}
                  className="rounded-xl border border-[#143E30] bg-[#06140F] px-2.5 py-1 text-[11px] font-semibold text-[#8BA398] focus:border-[#10B981] focus:text-white focus:outline-none"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Chart Visual */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-mono text-[#718E80] mb-1">
                  <span>kg CO₂e</span>
                  <span>Daily distribution</span>
                </div>

                {/* SVG Glowing Line Chart */}
                <div className="relative w-full h-[120px] bg-[#06140F] rounded-2xl p-2 border border-[#0D2E22] overflow-hidden flex items-end">
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                    <div className="border-b border-[#34D399]" />
                    <div className="border-b border-[#34D399]" />
                    <div className="border-b border-[#34D399]" />
                  </div>

                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-[95px] overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path d={svgArea} fill="url(#trendGradient)" />

                    {/* Glowing Stroke */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {points.map((pt: any, idx: number) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r={activeTooltipIndex === idx ? 5 : 3}
                        className={`transition-all cursor-pointer ${
                          activeTooltipIndex === idx
                            ? "fill-white stroke-[#10B981] stroke-[2.5]"
                            : "fill-[#34D399]"
                        }`}
                        onMouseEnter={() => setActiveTooltipIndex(idx)}
                      />
                    ))}
                  </svg>

                  {/* Active Tooltip Pill */}
                  {activeTooltipIndex !== null && points[activeTooltipIndex] && (
                    <div
                      className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-8 rounded-lg bg-[#0E3526] px-2 py-0.5 border border-[#34D399] shadow-lg text-[10px] font-bold text-white"
                      style={{
                        left: `${(points[activeTooltipIndex].x / chartWidth) * 100}%`,
                        top: `${points[activeTooltipIndex].y}px`,
                      }}
                    >
                      {points[activeTooltipIndex].kgCO2e} kg
                    </div>
                  )}
                </div>

                {/* X-axis labels */}
                <div className="mt-2 flex justify-between text-[10px] text-[#718E80] font-mono">
                  {trendData.map((d: any, idx: number) => (
                    <span key={idx}>{d.label}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#0D2E22] text-[11px] text-[#8BA398] flex items-center justify-between">
              <span>Average daily footprint:</span>
              <strong className="text-white font-mono">
                {(
                  trendData.reduce((acc: number, curr: any) => acc + curr.kgCO2e, 0) /
                  trendData.length
                ).toFixed(2)}{" "}
                kg CO₂e/day
              </strong>
            </div>
          </div>

          {/* Card 2: Top Eco Streaks Leaderboard */}
          <div className="rounded-3xl bg-[#091F18] p-5 sm:p-6 border border-[#143E30] shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#0D2E22]">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Top Eco Streaks
                  </h3>
                </div>

                <select
                  value={streakPeriod}
                  onChange={(e) => setStreakPeriod(e.target.value as any)}
                  className="rounded-xl border border-[#143E30] bg-[#06140F] px-2.5 py-1 text-[11px] font-semibold text-[#8BA398] focus:border-[#10B981] focus:text-white focus:outline-none"
                >
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Leaderboard Table / Rows */}
              <div className="mt-3 space-y-2">
                {topStreaks.slice(0, 5).map((entry: any, idx: number) => {
                  const isCurrent = entry.isCurrentUser;
                  const rank = idx + 1;

                  return (
                    <div
                      key={entry.rank || idx}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                        isCurrent
                          ? "bg-[#113B2C] border border-[#10B981]/50 shadow-[0_0_12px_rgba(16,185,129,0.2)] text-white"
                          : "bg-[#06140F]/70 border border-[#0D2E22] text-[#8BA398] hover:bg-[#081F17]"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        {/* Rank Badge */}
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md font-mono text-[10px] font-bold ${
                            rank === 1
                              ? "bg-amber-400 text-black"
                              : rank === 2
                              ? "bg-slate-300 text-black"
                              : rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-[#0B251D] text-[#8BA398]"
                          }`}
                        >
                          {rank}
                        </span>

                        {/* Avatar Initial */}
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                            isCurrent
                              ? "bg-[#10B981] text-white"
                              : "bg-[#0D2E22] text-[#34D399]"
                          }`}
                        >
                          {entry.name ? entry.name.charAt(0).toUpperCase() : "?"}
                        </div>

                        {/* Name + Demo Pill */}
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`font-semibold text-xs truncate max-w-[110px] sm:max-w-[130px] ${
                              isCurrent ? "text-white font-bold" : "text-[#E2F0EA]"
                            }`}
                          >
                            {isCurrent ? `You (${entry.name})` : entry.name}
                          </span>
                          {entry.isDemo && (
                            <span className="rounded bg-[#0A261C] px-1 py-0.2 text-[9px] font-mono text-emerald-400/70 border border-emerald-500/20">
                              Demo
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Streak Days + XP */}
                      <div className="flex items-center space-x-3 text-right">
                        <span className="text-[11px] text-[#718E80]">
                          {entry.streak} days
                        </span>
                        <div className="flex items-center space-x-1 text-amber-400 font-bold font-mono text-xs">
                          <Flame className="h-3.5 w-3.5" />
                          <span>{entry.xp.toLocaleString()} XP</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#0D2E22] text-[10px] text-[#718E80] flex justify-between items-center">
              <span>Privacy protected • Opt-in community</span>
              <Link href="/challenges" className="text-[#34D399] font-semibold hover:underline">
                View Full League →
              </Link>
            </div>
          </div>

          {/* Card 3: Action Callout CTA */}
          <div className="relative rounded-3xl overflow-hidden p-6 border border-[#143E30] shadow-2xl flex flex-col justify-between bg-gradient-to-br from-[#0B2A1F] via-[#081F17] to-[#04120D]">
            {/* Ambient Leaf Watermark Background */}
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#10B981]/10 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10B981]/30 to-[#059669]/20 border border-[#10B981]/50 text-[#34D399] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Leaf className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-xl sm:text-2xl font-black text-white leading-tight">
                Small actions.
                <br />
                Big change.
              </h3>

              <p className="mt-2 text-xs text-[#8BA398] leading-relaxed max-w-xs">
                Every action counts towards a healthier, greener India. Record today&apos;s commutes, meals, and energy savings.
              </p>
            </div>

            {/* Glowing Big CTA Button */}
            <div className="relative z-10 pt-5">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] py-3.5 px-4 text-xs sm:text-sm font-extrabold text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-[0.99] transition-all"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Log activity</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Record Activity Modal */}
      <AddActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchMetrics(period);
        }}
      />
    </AppShell>
  );
}
