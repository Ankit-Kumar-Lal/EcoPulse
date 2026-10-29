import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/auth/session";
import { OFFICIAL_FACTORS } from "@/lib/calculations/factors";
import { BookOpen, ShieldCheck, Scale, AlertTriangle, Layers, CheckCircle2 } from "lucide-react";

export default async function MethodologyPage() {
  const user = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-brand-natural text-brand-forest">
      <PublicHeader user={user} />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-semibold text-brand-emerald-dark border border-brand-emerald/20">
              <Scale className="h-3.5 w-3.5" />
              <span>Scientific Rigour & Evidence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-forest">
              Impact Methodology & Factor Catalog
            </h1>
            <p className="text-base sm:text-lg text-brand-sage max-w-3xl leading-relaxed">
              At EcoPulse, we prioritize evidence over invented precision. Environmental metrics are calculated using traceable, published emission factors from official government and peer-reviewed scientific sources.
            </p>
          </div>

          {/* Core Concept: What is CO2e? */}
          <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-lime text-brand-forest">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-brand-forest">
                Understanding CO₂e (Carbon Dioxide Equivalent)
              </h2>
            </div>
            <div className="text-sm text-brand-sage space-y-3 leading-relaxed">
              <p>
                Human activities release several different greenhouse gases into the atmosphere, including carbon dioxide (CO₂), methane (CH₄), and nitrous oxide (N₂O). Each gas has a distinct atmospheric lifespan and heat-trapping capacity—known as its <strong>Global Warming Potential (GWP)</strong>.
              </p>
              <p>
                To make meaningful comparisons across activities, scientists normalize all greenhouse gas impacts to <strong>CO₂ equivalent (CO₂e)</strong>. For example, over a 100-year horizon, 1 kilogram of methane traps roughly 28 times more heat than 1 kilogram of carbon dioxide (IPCC 6th Assessment Report GWP100). When EcoPulse reports 10 kg CO₂e for a meal, it represents the combined warming effect of all associated greenhouse gases expressed in equivalent units of carbon dioxide.
              </p>
            </div>
          </div>

          {/* GHG Protocol Scope & Calculation Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-brand-emerald-dark font-bold text-base">
                <Layers className="h-5 w-5" />
                <h3>Calculation Formula & Unit Normalization</h3>
              </div>
              <p className="text-xs sm:text-sm text-brand-sage leading-relaxed">
                For every activity, entered quantities are normalized into standard SI units (e.g. miles converted to kilometres, bags converted to kg) before multiplication:
              </p>
              <div className="rounded-xl bg-brand-natural p-3 font-mono text-xs text-brand-forest border border-brand-border">
                Footprint (kg CO₂e) = Normalized Activity Amount × Official Emission Factor
              </div>
              <p className="text-xs text-brand-sage">
                Incompatible units are explicitly rejected rather than silently coerced. Calculations never output false decimal precision.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-brand-forest font-bold text-base">
                <ShieldCheck className="h-5 w-5 text-brand-emerald" />
                <h3>Boundary & Scope Alignment</h3>
              </div>
              <p className="text-xs sm:text-sm text-brand-sage leading-relaxed">
                Our calculation models align with Tier 1 and Tier 2 methodologies established by the <strong>Greenhouse Gas Protocol (GHG Protocol)</strong> and IPCC Guidelines:
              </p>
              <ul className="text-xs sm:text-sm text-brand-sage space-y-1.5 list-disc list-inside">
                <li><strong>Scope 1 (Direct):</strong> Vehicle fuel combustion, home LPG, natural gas.</li>
                <li><strong>Scope 2 (Indirect):</strong> Purchased grid electricity generation.</li>
                <li><strong>Scope 3 (Lifecycle):</strong> Well-to-tank fuel upstream, food agriculture, and waste disposal.</li>
              </ul>
            </div>
          </div>

          {/* Official Emission Factor Catalog Table */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-brand-forest">
                Active Emission Factors & Sources
              </h2>
              <p className="text-xs sm:text-sm text-brand-sage">
                Below are the active conversion factors used by the EcoPulse calculation service.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-brand-border bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-brand-border bg-brand-natural/80 text-brand-forest font-bold">
                  <tr>
                    <th className="py-3 px-4">Activity Category</th>
                    <th className="py-3 px-4">Activity Description</th>
                    <th className="py-3 px-4 text-right">Factor Value</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">Traceable Source & Version</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {OFFICIAL_FACTORS.map((f, i) => (
                    <tr key={i} className="hover:bg-brand-natural/30 transition">
                      <td className="py-3 px-4 font-semibold text-brand-forest">
                        {f.category.replace("_", " ")}
                      </td>
                      <td className="py-3 px-4 text-brand-forest">
                        {f.label}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-brand-emerald-dark">
                        {f.factorKgCO2e} kg/{f.baseUnit}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-brand-natural px-2 py-0.5 font-mono text-[10px] text-brand-forest border border-brand-border">
                          {f.region}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-brand-sage">
                        <div className="max-w-md">
                          <p className="font-medium text-brand-forest">{f.source}</p>
                          <p className="text-[10px] text-brand-sage mt-0.5">Version: {f.version}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assumptions & Limitations */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 space-y-3">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-base">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <h2>Honest Assumptions & System Limitations</h2>
            </div>
            <div className="text-xs sm:text-sm text-amber-950/80 space-y-2 leading-relaxed">
              <p>
                <strong>Estimates, not laboratory measurements:</strong> Unless connected to a certified utility meter or calibrated IoT sub-meter, everyday activity logging relies on user-reported estimates and published regional averages.
              </p>
              <p>
                <strong>Grid time-of-use variations:</strong> Grid factors reflect published annual weighted averages (e.g., CEA User Guide Version 19.0). Actual instantaneous grid intensity fluctuates hour-by-hour based on solar and wind generation.
              </p>
              <p>
                <strong>Dietary variances:</strong> Meal estimates use peer-reviewed averages (Poore & Nemecek 2018; Nature Food 2023). Individual meal footprints vary with regional farming techniques and season.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
