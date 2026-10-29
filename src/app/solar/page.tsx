import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { SolarCalculator } from "@/components/solar/SolarCalculator";
import { SunMedium, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function SolarPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell user={user}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="pb-4 border-b border-brand-border">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700 mb-1">
            <SunMedium className="h-4 w-4" />
            <span>Clean Energy Tools</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
            Rooftop Solar Feasibility Estimator
          </h1>
          <p className="text-xs sm:text-sm text-brand-sage mt-1">
            Simulate your rooftop photovoltaic power generation, annual grid displacement, and estimated utility bill savings.
          </p>
        </div>

        <SolarCalculator />

        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-brand-forest">
            About This Sizing Engine
          </h3>
          <p className="text-xs text-brand-sage leading-relaxed">
            This feasibility calculator applies benchmarks developed by the Ministry of New and Renewable Energy (MNRE), National Institute of Solar Energy (NISE), and the Central Electricity Authority (CEA User Guide v19.0). Performance ratios assume standard modern mono-PERC crystalline solar panels operating with 15% system temperature and inverter loss margins.
          </p>
          <div className="pt-2">
            <Link
              href="/resources"
              className="inline-flex items-center text-xs font-semibold text-brand-emerald hover:underline"
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Read our complete guide to residential solar in India
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
