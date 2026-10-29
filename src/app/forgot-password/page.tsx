"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to process request.");
      }

      setSubmitted(true);
      if (data.data?.resetToken) {
        setResetToken(data.data.resetToken);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-natural p-4">
      <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-8 shadow-sm space-y-6">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-brand-forest">
            Password Recovery
          </h1>
          <p className="mt-1 text-xs text-brand-sage">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-800 flex items-start border border-red-200">
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="rounded-2xl bg-emerald-50 p-5 border border-brand-emerald/20 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-brand-emerald mx-auto" />
            <h3 className="text-sm font-bold text-brand-forest">
              Recovery Link Issued
            </h3>
            <p className="text-xs text-brand-sage">
              If an account with that email exists, password reset instructions have been generated.
            </p>
            {resetToken && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-brand-border text-left">
                <span className="text-[10px] text-brand-sage font-semibold uppercase block">
                  Password Reset Token:
                </span>
                <Link
                  href={`/reset-password?token=${resetToken}`}
                  className="mt-1 inline-flex items-center text-xs font-semibold text-brand-emerald hover:underline break-all"
                >
                  Proceed to Reset Password
                  <ArrowRight className="ml-1 h-3.5 w-3.5 flex-shrink-0" />
                </Link>
              </div>
            )}
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-xs font-semibold text-brand-forest hover:text-brand-emerald"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-forest mb-1">
                Account Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3.5 py-2.5 text-xs text-brand-forest focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-emerald py-3 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark disabled:opacity-50"
            >
              {isSubmitting ? "Generating Link..." : "Send Reset Instructions"}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-xs font-semibold text-brand-sage hover:text-brand-forest"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
