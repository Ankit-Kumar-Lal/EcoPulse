import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/auth/session";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";

export default async function TermsOfServicePage() {
  const user = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-brand-natural text-brand-forest">
      <PublicHeader user={user} />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-semibold text-brand-emerald-dark border border-brand-emerald/20">
              <FileText className="h-3.5 w-3.5" />
              <span>Service Agreement</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-brand-forest">
              EcoPulse Terms of Service
            </h1>
            <p className="mt-2 text-sm text-brand-sage">
              Last updated: October 2026 • Contact:{" "}
              <a
                href="mailto:ankitkumarlal2006@gmail.com"
                className="text-brand-emerald underline underline-offset-2"
              >
                ankitkumarlal2006@gmail.com
              </a>
            </p>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8 shadow-sm space-y-6 text-sm text-brand-sage leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base font-bold text-brand-forest">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account or accessing EcoPulse, you agree to these Terms of Service. If you do not agree to these terms, you should not access or use the platform.
              </p>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                2. Nature of the Service: Informational Estimates Only
              </h2>
              <div className="rounded-xl bg-amber-50/70 p-4 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold">
                  <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0" />
                  <span>Important Disclaimer on Environmental Figures</span>
                </div>
                <p>
                  All emissions data, carbon footprint numbers, solar feasibility projections, and cost savings presented on EcoPulse are <strong>estimates calculated for educational and personal informational purposes</strong>. They do not constitute formal legal carbon accounting, certified ESG audits, investment advice, or guaranteed monetary returns.
                </p>
              </div>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                3. User Account Responsibilities
              </h2>
              <p>
                When creating an account, you agree to provide accurate information and maintain the security of your login credentials. You are responsible for all activities that occur under your account. Notify us immediately if you suspect unauthorized access.
              </p>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                4. Acceptable Use and Community Conduct
              </h2>
              <p>
                EcoPulse is designed to foster positive, actionable environmental habits. You agree not to:
              </p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Interfere with or disrupt the platform's infrastructure, security mechanisms, or servers.</li>
                <li>Submit intentionally malicious, fabricated, or automated abuse scripts.</li>
                <li>Use abusive, defamatory, or offensive names when participating in community challenges or public leaderboards.</li>
                <li>Attempt to reverse-engineer unauthorized backend access or harvest data belonging to other users.</li>
              </ul>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                5. Content Ownership and User Rights
              </h2>
              <p>
                You retain all rights and ownership of the activity data, goals, and personal preferences you enter into EcoPulse. We claim no ownership over your personal logs. You may export your records in standard CSV or JSON format at any time. EcoPulse owns the platform branding, interface designs, original guides, calculation software code, and logo assets.
              </p>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                6. Service Availability and Modifications
              </h2>
              <p>
                We strive to keep EcoPulse reliable, accessible, and up to date with the latest credible scientific emission factors. However, the service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of uninterrupted availability. We reserve the right to modify or enhance platform features as our methodologies advance.
              </p>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                7. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, EcoPulse, Team Codyssey, and its developers shall not be liable for any indirect, incidental, special, or consequential damages arising from your reliance on carbon calculations, third-party emission factor revisions, or inability to access the platform.
              </p>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                8. Termination and Questions
              </h2>
              <p>
                You may terminate these terms at any time by permanently deleting your account in the Settings dashboard. For any questions or legal inquiries regarding these terms, please contact:{" "}
                <a
                  href="mailto:ankitkumarlal2006@gmail.com"
                  className="font-semibold text-brand-forest underline underline-offset-2"
                >
                  ankitkumarlal2006@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
