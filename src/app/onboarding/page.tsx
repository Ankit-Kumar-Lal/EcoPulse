"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import {
  Check,
  ArrowRight,
  Globe,
  Zap,
  Footprints,
  Utensils,
  Droplets,
  Trash2,
  Sliders,
  Flag,
  Sparkles,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form states
  const [region, setRegion] = useState("IN");
  const [units, setUnits] = useState("metric");
  const [householdSize, setHouseholdSize] = useState(1);
  const [focusAreas, setFocusAreas] = useState<string[]>([
    "HOME_ENERGY",
    "TRANSPORT",
  ]);
  const [initialGoal, setInitialGoal] = useState("Reduce household energy by 10%");
  const [isSaving, setIsSaving] = useState(false);

  const toggleFocus = (area: string) => {
    if (focusAreas.includes(area)) {
      if (focusAreas.length > 1) {
        setFocusAreas(focusAreas.filter((a) => a !== area));
      }
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const handleFinish = async (nextAction: "dashboard" | "activity" | "challenge") => {
    setIsSaving(true);
    try {
      await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          units,
          householdSize,
          focusAreas,
          initialGoal,
        }),
      });

      if (nextAction === "activity") {
        router.push("/footprint?new=1");
      } else if (nextAction === "challenge") {
        router.push("/challenges");
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-natural flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header with progress */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between pb-6 border-b border-brand-border">
        <Logo size="sm" />
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-brand-sage">
            Step {step} of {totalSteps}
          </span>
          <button
            type="button"
            onClick={() => handleFinish("dashboard")}
            className="text-xs font-semibold text-brand-forest hover:text-brand-emerald underline"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Wizard Card */}
      <div className="max-w-2xl w-full mx-auto my-8 rounded-3xl border border-brand-border bg-white p-6 sm:p-10 shadow-sm space-y-6">
        {/* Step 1: Regional Context & Measurement Units */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Step 1: Regional Baseline
              </span>
              <h1 className="mt-1 text-2xl font-bold text-brand-forest">
                Select Your Region & Units
              </h1>
              <p className="mt-1 text-xs text-brand-sage">
                We only ask for your region because electricity grid emissions vary significantly by geographical territory.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-2">
                  Primary Electricity Grid Region
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "IN",
                      title: "India (National Grid)",
                      desc: "Central Electricity Authority v19 (0.716 kg/kWh)",
                    },
                    {
                      id: "GLOBAL",
                      title: "Global / European Average",
                      desc: "DEFRA 2024 grid baseline (0.207 kg/kWh)",
                    },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegion(r.id)}
                      className={`text-left rounded-2xl p-4 border transition-all ${
                        region === r.id
                          ? "border-brand-emerald bg-emerald-50/50 shadow-sm"
                          : "border-brand-border bg-white hover:bg-brand-natural/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-forest">
                          {r.title}
                        </span>
                        {region === r.id && (
                          <Check className="h-4 w-4 text-brand-emerald" />
                        )}
                      </div>
                      <span className="text-xs text-brand-sage mt-1 block">
                        {r.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-2">
                  Measurement System
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUnits("metric")}
                    className={`rounded-xl p-3 text-xs font-semibold border ${
                      units === "metric"
                        ? "bg-brand-forest text-white border-brand-forest"
                        : "bg-white text-brand-forest border-brand-border hover:bg-brand-natural"
                    }`}
                  >
                    Metric (kg, km, kWh)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnits("imperial")}
                    className={`rounded-xl p-3 text-xs font-semibold border ${
                      units === "imperial"
                        ? "bg-brand-forest text-white border-brand-forest"
                        : "bg-white text-brand-forest border-brand-border hover:bg-brand-natural"
                    }`}
                  >
                    Imperial (lbs, miles, kWh)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Household Occupants (for per-capita scaling)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-32 rounded-xl border border-brand-border bg-brand-natural/40 px-3 py-2 text-xs text-brand-forest"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center rounded-xl bg-brand-emerald px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-emerald-dark"
              >
                Continue
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Focus Areas */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Step 2: Personalization
              </span>
              <h1 className="mt-1 text-2xl font-bold text-brand-forest">
                What are your main focus areas?
              </h1>
              <p className="mt-1 text-xs text-brand-sage">
                Select the sustainability categories you care most about improving right now.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "HOME_ENERGY",
                  label: "Home Energy",
                  icon: Zap,
                  desc: "Electricity consumption, cooling setpoint, appliance standby power",
                },
                {
                  id: "TRANSPORT",
                  label: "Travel & Transit",
                  icon: Footprints,
                  desc: "Daily commuting, public transit shifts, flight tracking",
                },
                {
                  id: "FOOD",
                  label: "Food & Diet",
                  icon: Utensils,
                  desc: "Plant-forward meals, seasonal produce, food waste reduction",
                },
                {
                  id: "WATER",
                  label: "Water Conservation",
                  icon: Droplets,
                  desc: "Domestic tap water, low-flow aerators, rainwater use",
                },
                {
                  id: "WASTE",
                  label: "Waste & Circularity",
                  icon: Trash2,
                  desc: "Aerobic kitchen composting, dry recycling, single-use reduction",
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = focusAreas.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleFocus(item.id)}
                    className={`text-left rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? "border-brand-emerald bg-emerald-50/50 shadow-sm"
                        : "border-brand-border bg-white hover:bg-brand-natural/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isSelected
                              ? "bg-brand-emerald text-white"
                              : "bg-brand-natural text-brand-sage"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-brand-forest">
                          {item.label}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-brand-emerald" />
                      )}
                    </div>
                    <p className="text-[11px] text-brand-sage mt-2">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-brand-border px-4 py-2 text-xs font-semibold text-brand-sage hover:text-brand-forest"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center rounded-xl bg-brand-emerald px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-emerald-dark"
              >
                Continue
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Meaningful Final Action */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Step 3: First Step
              </span>
              <h1 className="mt-1 text-2xl font-bold text-brand-forest">
                You&apos;re All Set! Choose Your Next Action
              </h1>
              <p className="mt-1 text-xs text-brand-sage">
                EcoPulse starts with real actions. Choose how you would like to begin your journey:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleFinish("activity")}
                className="rounded-2xl border-2 border-brand-emerald bg-emerald-50/50 p-6 text-left transition hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald text-white mb-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-brand-forest">
                  Record Your First Activity
                </h3>
                <p className="mt-1 text-xs text-brand-sage leading-relaxed">
                  Log your latest electricity bill, vehicle commute, or vegetarian meal to establish your baseline.
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-bold text-brand-emerald">
                  Open activity recorder
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleFinish("challenge")}
                className="rounded-2xl border border-brand-border bg-white p-6 text-left transition hover:border-brand-forest hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-forest text-white mb-3">
                  <Flag className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-brand-forest">
                  Join a Starter Challenge
                </h3>
                <p className="mt-1 text-xs text-brand-sage leading-relaxed">
                  Join the 7-day 24°C AC efficiency routine or green commute week with community peers.
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-bold text-brand-forest">
                  Explore challenges
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleFinish("dashboard")}
                className="text-xs font-semibold text-brand-sage hover:text-brand-forest underline"
              >
                Skip and go directly to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-brand-sage">
        All settings can be updated anytime in Profile & Settings.
      </div>
    </div>
  );
}
