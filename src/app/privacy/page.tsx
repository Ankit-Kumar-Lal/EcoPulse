import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/auth/session";
import { Shield, Lock, EyeOff, UserCheck, Mail, Database } from "lucide-react";

export default async function PrivacyPolicyPage() {
  const user = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-brand-natural text-brand-forest">
      <PublicHeader user={user} />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-semibold text-brand-emerald-dark border border-brand-emerald/20">
              <Shield className="h-3.5 w-3.5" />
              <span>Privacy by Design</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-brand-forest">
              EcoPulse Privacy Policy
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
                1. Introduction and Core Philosophy
              </h2>
              <p>
                EcoPulse was built on a foundational principle: personal sustainability tracking should never come at the expense of your privacy. We collect only what is strictly necessary to calculate your carbon estimates, manage your account, and support your participation in voluntary challenges. We do not sell your personal data, and we do not profile you for behavioral advertising.
              </p>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                2. Information We Collect and Why
              </h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Account Details:</strong> Your name and email address to create your account, manage authentication, deliver password recovery links, and send optional periodic summaries. Passwords are never stored in plaintext; they are securely salted and hashed using bcrypt.
                </li>
                <li>
                  <strong>Activity Logs:</strong> Quantities, dates, activity types (e.g., electricity kWh, vehicle transit km, diet types, water usage, waste recycling) and optional personal notes that you enter. These records are used strictly to calculate your estimated environmental footprint.
                </li>
                <li>
                  <strong>Goals and Preferences:</strong> Reduction targets, time horizons, preferred units (metric or imperial), household size, and region (e.g., India or Global), which is used solely to select appropriate electrical grid emission factors.
                </li>
                <li>
                  <strong>Challenge Participation:</strong> Voluntary challenge status and progress. If you opt into the public community leaderboard, only your chosen display name and progress percentage are visible; your underlying activity logs remain strictly private.
                </li>
              </ul>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                3. What We Do NOT Collect
              </h2>
              <p>
                We do not collect sensitive demographic details, financial data, payment card numbers, continuous GPS background tracking, or biometric records. We do not track you across third-party websites or sell user profiles to data brokers.
              </p>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                4. Systems and Architecture That Process Data
              </h2>
              <p>
                EcoPulse operates using a modern web architecture:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Application and Database:</strong> Next.js full-stack application backed by an authenticated, schema-enforced relational database (SQLite via Prisma) with strict server-side authorization isolating each user's records.
                </li>
                <li>
                  <strong>Authentication and Sessions:</strong> Managed with cryptographically generated session tokens stored in secure, <code className="text-xs bg-brand-natural px-1 py-0.5 rounded font-mono">httpOnly</code> cookies with <code className="text-xs bg-brand-natural px-1 py-0.5 rounded font-mono">SameSite=Lax</code> to prevent client-side script access and CSRF exploitation.
                </li>
              </ul>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                5. Data Retention and User Controls
              </h2>
              <p>
                You maintain complete ownership of your personal environmental data:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Edit and Delete:</strong> You can edit or delete individual activity entries, goals, or challenge enrollments directly from the application interface at any time.
                </li>
                <li>
                  <strong>Complete Data Export:</strong> You can download a complete export of your account, including all recorded activities, factors, and goals, in standard CSV and JSON formats from the Settings page.
                </li>
                <li>
                  <strong>Permanent Account Deletion:</strong> You can permanently delete your account at any time in Settings. Deletion cascades immediately through the database, completely removing your profile, credentials, sessions, activities, goals, and challenge records.
                </li>
              </ul>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                6. Security Measures
              </h2>
              <p>
                We employ industry-standard security safeguards: encrypted HTTPS transport, salted bcrypt password hashing, parameterized database queries to prevent SQL injection, strict input sanitization with Zod schemas, rate limiting on authentication and mutation endpoints, and security headers (CSP, frame restrictions, and nosniff).
              </p>
            </section>

            <section className="space-y-3 border-t border-brand-border/70 pt-6">
              <h2 className="text-base font-bold text-brand-forest">
                7. Policy Updates and Contact Information
              </h2>
              <p>
                We may periodically update this Privacy Policy to reflect enhancements in our calculation models or platform features. Material updates will be announced directly within the application dashboard.
              </p>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact Team Codyssey directly at:{" "}
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
