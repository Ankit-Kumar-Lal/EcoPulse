import Link from "next/link";
import { Logo } from "../brand/Logo";
import { Mail, Shield, BookOpen, HelpCircle, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-white text-brand-forest">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <Logo size="md" />
            <p className="text-sm font-medium text-brand-forest">
              Small Actions. Measurable Impact.
            </p>
            <p className="max-w-md text-sm text-brand-sage">
              EcoPulse helps individuals, households, and communities understand everyday environmental footprints and take clear, verified steps toward sustainability.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center rounded-md bg-brand-natural px-2.5 py-1 text-xs font-semibold text-brand-forest border border-brand-border">
                Team credit: Team Codyssey
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-forest">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/footprint"
                  className="text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  My Footprint
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  className="text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  Insights & Trends
                </Link>
              </li>
              <li>
                <Link
                  href="/actions"
                  className="text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  Action Recommendations
                </Link>
              </li>
              <li>
                <Link
                  href="/challenges"
                  className="text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  Community Challenges
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge & Transparency */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-forest">
              Transparency
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/methodology"
                  className="inline-flex items-center text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  <BookOpen className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
                  Impact Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  Learning Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="inline-flex items-center text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
                  Help & FAQs
                </Link>
              </li>
              <li>
                <a
                  href="mailto:ankitkumarlal2006@gmail.com"
                  className="inline-flex items-center text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  <Mail className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
                  Contact for support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-forest">
              Legal & Trust
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  <Shield className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="inline-flex items-center text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  <FileText className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-brand-sage transition-colors hover:text-brand-emerald"
                >
                  Data Export & Privacy Controls
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-brand-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-sage">
          <p>© 2026 EcoPulse. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-6">
            <span>Built by Team Codyssey</span>
            <span>•</span>
            <a
              href="mailto:ankitkumarlal2006@gmail.com"
              className="hover:text-brand-forest underline underline-offset-2"
            >
              ankitkumarlal2006@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
