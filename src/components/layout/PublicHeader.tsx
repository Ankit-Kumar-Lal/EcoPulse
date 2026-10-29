"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "../brand/Logo";
import { Menu, X, ArrowRight } from "lucide-react";

export function PublicHeader({ user }: { user?: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <div className="flex items-center">
          <Logo size="sm" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-brand-forest transition hover:text-brand-emerald"
          >
            Home
          </Link>
          <Link
            href="/methodology"
            className="text-sm font-medium text-brand-sage transition hover:text-brand-forest"
          >
            Methodology
          </Link>
          <Link
            href="/resources"
            className="text-sm font-medium text-brand-sage transition hover:text-brand-forest"
          >
            Resources
          </Link>
          <Link
            href="/help"
            className="text-sm font-medium text-brand-sage transition hover:text-brand-forest"
          >
            Help
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center space-x-4 md:flex">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-brand-forest px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-forest/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-brand-forest hover:text-brand-emerald px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-lg bg-brand-emerald px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-emerald-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
              >
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-brand-forest hover:bg-brand-natural focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-brand-border bg-white px-4 pb-6 pt-2 md:hidden">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-brand-forest hover:bg-brand-natural"
            >
              Home
            </Link>
            <Link
              href="/methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-brand-forest hover:bg-brand-natural"
            >
              Methodology
            </Link>
            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-brand-forest hover:bg-brand-natural"
            >
              Resources
            </Link>
            <Link
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-brand-forest hover:bg-brand-natural"
            >
              Help
            </Link>
          </div>
          <div className="mt-4 border-t border-brand-border pt-4 space-y-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-brand-forest py-2.5 text-center text-sm font-medium text-white shadow-sm hover:bg-brand-forest/90"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-lg border border-brand-border py-2 text-center text-sm font-semibold text-brand-forest hover:bg-brand-natural"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg bg-brand-emerald py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-brand-emerald-dark"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
