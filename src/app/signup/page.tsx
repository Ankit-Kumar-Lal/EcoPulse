"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          acceptTerms,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error?.details) {
          setFieldErrors(data.error.details);
        }
        throw new Error(data.error?.message || "Failed to create account.");
      }

      // Automatically redirect to onboarding flow
      router.push("/onboarding");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Brand Nature Side Panel (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 bg-brand-forest text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-emerald/20 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <Logo size="lg" />
          <div className="mt-12 space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight leading-snug">
              Begin your sustainable journey today.
            </h1>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              Create your account to start tracking everyday carbon footprint metrics, discover rules-based efficiency steps, and export your personal ledger anytime.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10 text-xs text-white/70 space-y-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-brand-lime" />
            <span>Privacy by design • Zero commercial advertising</span>
          </div>
          <p>© 2026 EcoPulse • Team Codyssey</p>
        </div>
      </div>

      {/* Main Form Panel */}
      <div className="flex-1 lg:col-span-7 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-16 bg-brand-natural/30">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center">
            <Logo size="md" />
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-brand-border bg-white p-8 shadow-sm">
            {/* Header Tabs */}
            <div className="flex border-b border-brand-border pb-4 mb-6">
              <Link
                href="/login"
                className="text-sm font-semibold text-brand-sage hover:text-brand-forest pb-2 mr-6"
              >
                Sign In
              </Link>
              <span className="text-lg font-bold text-brand-forest border-b-2 border-brand-emerald pb-2 -mb-4 font-sans">
                Create Account
              </span>
            </div>

            <p className="text-xs text-brand-sage mb-6">
              Get started with EcoPulse. No payment card required.
            </p>

            {errorMessage && (
              <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-800 flex items-start border border-red-200">
                <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ankit Kumar"
                  className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3.5 py-2.5 text-xs text-brand-forest placeholder:text-brand-sage focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3.5 py-2.5 text-xs text-brand-forest placeholder:text-brand-sage focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 number, 1 special symbol"
                    className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3.5 py-2.5 pr-10 text-xs text-brand-forest placeholder:text-brand-sage focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-sage hover:text-brand-forest"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password[0]}</p>
                ) : (
                  <p className="text-[11px] text-brand-sage mt-1">
                    Must be at least 8 characters with numbers and special symbols.
                  </p>
                )}
              </div>

              {/* Terms Acceptance */}
              <div className="pt-2">
                <label className="flex items-start space-x-2 text-xs text-brand-sage cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-brand-border text-brand-emerald focus:ring-brand-emerald mt-0.5"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="font-semibold text-brand-forest underline underline-offset-2"
                    >
                      Terms of Service
                    </Link>{" "}
                    and have read the{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="font-semibold text-brand-forest underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>.
                  </span>
                </label>
                {fieldErrors.acceptTerms && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.acceptTerms[0]}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-brand-emerald py-3 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald disabled:opacity-50 transition"
                >
                  {isSubmitting ? "Creating account..." : "Start tracking with EcoPulse"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-brand-border/60 pt-4 text-center text-xs text-brand-sage">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-emerald hover:underline"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
