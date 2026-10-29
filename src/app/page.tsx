import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/auth/session";
import { SolarCalculator } from "@/components/solar/SolarCalculator";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Trophy,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Footprints,
  FileSpreadsheet,
} from "lucide-react";

export default async function HomePage() {
  const user = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-brand-natural text-brand-forest">
      {/* Sticky Header */}
      <PublicHeader user={user} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 space-y-6">
                {/* Eyebrow Chip */}
                <div className="inline-flex items-center space-x-2 rounded-full bg-brand-lime/50 px-3.5 py-1.5 text-xs font-semibold text-brand-forest border border-brand-lime">
                  <span className="flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
                  <span>A Greener Tomorrow Starts Today</span>
                </div>

                {/* Two-Line Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-forest leading-[1.15]">
                  Small actions. <br />
                  <span className="text-brand-emerald">Measurable impact.</span>
                </h1>

                {/* Subcopy */}
                <p className="max-w-xl text-base sm:text-lg text-brand-sage font-normal leading-relaxed">
                  Understand your everyday footprint, discover practical ways to reduce it, and keep track of the progress you make. Every calculation is grounded in traceable, published emission benchmarks.
                </p>

                {/* Primary & Secondary Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                  <Link
                    href={user ? "/dashboard" : "/signup"}
                    className="inline-flex items-center justify-center rounded-xl bg-brand-emerald px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-emerald-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
                  >
                    Start tracking
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>

                  <Link
                    href="/methodology"
                    className="inline-flex items-center justify-center rounded-xl border border-brand-border bg-white px-6 py-3.5 text-base font-semibold text-brand-forest shadow-sm transition hover:bg-brand-natural focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest"
                  >
                    See how it works
                  </Link>
                </div>

                {/* Factual Product Facts Row (No fabricated numbers) */}
                <div className="pt-8 border-t border-brand-border/70 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="block text-xl font-extrabold text-brand-forest">
                      5
                    </span>
                    <span className="text-xs text-brand-sage">
                      Tracked Categories
                    </span>
                  </div>
                  <div>
                    <span className="block text-xl font-extrabold text-brand-forest">
                      CEA v19
                    </span>
                    <span className="text-xs text-brand-sage">
                      Indian Grid Factor
                    </span>
                  </div>
                  <div>
                    <span className="block text-xl font-extrabold text-brand-forest">
                      100%
                    </span>
                    <span className="text-xs text-brand-sage">
                      Transparent Sources
                    </span>
                  </div>
                  <div>
                    <span className="block text-xl font-extrabold text-brand-forest">
                      CSV / JSON
                    </span>
                    <span className="text-xs text-brand-sage">
                      Full Data Export
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Graphic */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-brand-border overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-brand-lime/30 blur-2xl pointer-events-none" />
                  
                  {/* Visual card header */}
                  <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-natural text-brand-emerald">
                        <Footprints className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-brand-forest">
                          Personal Impact Ledger
                        </h2>
                        <span className="text-[11px] text-brand-sage">
                          Verified Calculation Pipeline
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-brand-emerald-dark border border-brand-emerald/20">
                      Tier 1 & 2 GHG
                    </span>
                  </div>

                  {/* Flow graphic */}
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl bg-brand-natural/80 p-3 text-xs border border-brand-border/60">
                      <div className="flex items-center justify-between text-brand-sage">
                        <span>1. Log activity</span>
                        <span className="font-mono text-brand-forest">150 kWh electricity</span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-brand-natural/80 p-3 text-xs border border-brand-border/60">
                      <div className="flex items-center justify-between text-brand-sage">
                        <span>2. Apply official factor</span>
                        <span className="font-mono text-brand-emerald font-semibold">× 0.716 kg/kWh</span>
                      </div>
                      <span className="text-[10px] text-brand-sage mt-1 block">
                        Source: CEA Baseline v19.0 (India)
                      </span>
                    </div>

                    <div className="rounded-xl bg-emerald-50/80 p-3 text-xs border border-brand-emerald/30">
                      <div className="flex items-center justify-between text-brand-forest font-semibold">
                        <span>3. Result (Estimated)</span>
                        <span className="font-mono text-sm text-brand-emerald-dark">
                          107.40 kg CO₂e
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trust footer note */}
                  <div className="mt-4 flex items-center justify-between text-[11px] text-brand-sage border-t border-brand-border/50 pt-3">
                    <span className="flex items-center">
                      <ShieldCheck className="mr-1 h-3.5 w-3.5 text-brand-emerald" />
                      Strict Privacy by Design
                    </span>
                    <Link
                      href="/methodology"
                      className="text-brand-emerald font-medium hover:underline inline-flex items-center"
                    >
                      Methodology
                      <ChevronRight className="ml-0.5 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEY FEATURES ROW */}
        <section className="py-16 bg-white border-y border-brand-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
                Our Key Features
              </h2>
              <p className="mt-2 text-sm sm:text-base text-brand-sage">
                Everything you need to turn sustainability intentions into consistent, measurable habits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-brand-border bg-brand-natural/30 p-6 transition-all hover:bg-white hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald mb-4">
                  <Footprints className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-brand-forest">
                  Carbon Footprint Tracker
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-sage leading-relaxed">
                  Record electricity, transit, diet, water, and waste. Each entry is matched to verified emission factors with full unit normalization.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-brand-border bg-brand-natural/30 p-6 transition-all hover:bg-white hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-brand-forest">
                  Action Recommendations
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-sage leading-relaxed">
                  Rules-based guidance tailored to your recorded highest-emission categories, complete with estimated kg CO₂e savings and explicit assumptions.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-brand-border bg-brand-natural/30 p-6 transition-all hover:bg-white hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-forest mb-4">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-brand-forest">
                  Challenges & Rewards
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-sage leading-relaxed">
                  Join achievable sustainability missions. Build lasting habits with opt-in community leaderboards that respect individual household privacy.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-brand-border bg-brand-natural/30 p-6 transition-all hover:bg-white hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-lime text-brand-forest mb-4">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-brand-forest">
                  Transparent Data Export
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-sage leading-relaxed">
                  Export your complete activity history and calculation factors to RFC-compliant CSV or JSON anytime. No lock-in, complete data ownership.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 bg-brand-natural">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Step-by-Step Methodology
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-brand-forest">
                How EcoPulse Works
              </h2>
              <p className="mt-2 text-sm text-brand-sage">
                From everyday actions to verified insight, in three transparent steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative rounded-2xl bg-white p-6 shadow-sm border border-brand-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-forest text-sm font-bold text-white mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-brand-forest">
                  Record Everyday Choices
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-sage leading-relaxed">
                  Log routine consumption: electricity bills (kWh), vehicle commutes (km/miles), diet choices, tap water, or waste recycling.
                </p>
              </div>

              <div className="relative rounded-2xl bg-white p-6 shadow-sm border border-brand-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-emerald text-sm font-bold text-white mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-brand-forest">
                  Multiplied by Traceable Factors
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-sage leading-relaxed">
                  EcoPulse normalizes your units and applies reputable regional factors (India CEA v19.0, UK DEFRA 2024, IPCC benchmarks) to estimate carbon equivalents.
                </p>
              </div>

              <div className="relative rounded-2xl bg-white p-6 shadow-sm border border-brand-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-lime text-sm font-bold text-brand-forest mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-brand-forest">
                  Take Practical Action
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-sage leading-relaxed">
                  Discover high-leverage steps, participate in opt-in community challenges, and watch your monthly trend line decline with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ILLUSTRATIVE PREVIEW SECTION */}
        <section className="py-20 bg-white border-t border-brand-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                  Illustrative preview
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-brand-forest">
                  Inside the EcoPulse Dashboard
                </h2>
                <p className="mt-1 text-sm text-brand-sage">
                  Notice: Real accounts start clean with zero fabricated data. Below is a sample interface view.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href="/signup"
                  className="inline-flex items-center text-sm font-semibold text-brand-emerald hover:text-brand-emerald-dark"
                >
                  Create your free account
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Illustrative Dashboard Card Mockup */}
            <div className="rounded-3xl border border-brand-border bg-brand-natural/50 p-6 sm:p-8 shadow-inner">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-brand-border">
                  <span className="text-xs text-brand-sage font-medium">Estimated Footprint</span>
                  <div className="mt-1 text-2xl font-black text-brand-forest font-mono">
                    320.0 <span className="text-xs font-semibold">kg CO₂e</span>
                  </div>
                  <span className="text-[10px] text-brand-emerald-dark font-medium mt-1 block">
                    ↓ 12% lower than prior month (sample)
                  </span>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm border border-brand-border">
                  <span className="text-xs text-brand-sage font-medium">Primary Contributor</span>
                  <div className="mt-1 text-2xl font-black text-brand-forest">
                    Home Energy
                  </div>
                  <span className="text-[10px] text-brand-sage mt-1 block">
                    45% of total monthly estimated emissions
                  </span>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm border border-brand-border">
                  <span className="text-xs text-brand-sage font-medium">Monthly Target</span>
                  <div className="mt-1 text-2xl font-black text-brand-forest font-mono">
                    78% <span className="text-xs font-semibold">Progress</span>
                  </div>
                  <span className="text-[10px] text-brand-sage mt-1 block">
                    80 kg CO₂e budget remaining
                  </span>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm border border-brand-border">
                  <span className="text-xs text-brand-sage font-medium">Active Challenges</span>
                  <div className="mt-1 text-2xl font-black text-brand-emerald-dark font-mono">
                    2 <span className="text-xs font-semibold">Active</span>
                  </div>
                  <span className="text-[10px] text-brand-sage mt-1 block">
                    AC setpoint & green transit week
                  </span>
                </div>
              </div>

              {/* Sample Action Recommendation */}
              <div className="rounded-2xl bg-white p-5 border border-brand-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-brand-lime px-2 py-0.5 text-[10px] font-bold text-brand-forest">
                      Action Recommendation
                    </span>
                    <span className="text-xs text-brand-sage">Home Energy</span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-forest">
                    Optimize AC Setpoint to 24°C–25°C
                  </h4>
                  <p className="text-xs text-brand-sage max-w-xl">
                    Why recommended: Energy accounts for your largest footprint share. Adjusting setpoints yields ~24.5 kg CO₂e reduction monthly based on Bureau of Energy Efficiency guidelines.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/signup"
                    className="inline-flex items-center rounded-lg bg-brand-forest px-4 py-2 text-xs font-medium text-white hover:bg-brand-forest/90"
                  >
                    Try on EcoPulse
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOLAR CALCULATOR FEATURE SECTION */}
        <section className="py-20 bg-brand-natural border-t border-brand-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Interactive Clean Tech Tool
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-brand-forest">
                Estimate Your Rooftop Solar Potential
              </h2>
              <p className="mt-2 text-sm text-brand-sage">
                Test our honest, rules-based rooftop solar estimator with transparent formulas and stated assumptions.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <SolarCalculator />
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 bg-brand-forest text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to measure and reduce your footprint?
            </h2>
            <p className="max-w-xl mx-auto text-base text-white/80 font-normal">
              Join EcoPulse today. No guesswork, no exaggerated claims—just practical everyday actions grounded in verifiable environmental science.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-xl bg-brand-emerald px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-brand-emerald-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime"
              >
                Create your free account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
