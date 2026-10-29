"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to reset password.");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update password.");
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
            Set New Password
          </h1>
          <p className="mt-1 text-xs text-brand-sage">
            Choose a strong password to secure your account.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-800 flex items-start border border-red-200">
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success ? (
          <div className="rounded-2xl bg-emerald-50 p-6 border border-brand-emerald/20 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-brand-emerald mx-auto" />
            <h3 className="text-sm font-bold text-brand-forest">
              Password Updated Successfully
            </h3>
            <p className="text-xs text-brand-sage">
              You can now sign in with your new password.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center rounded-xl bg-brand-emerald px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-emerald-dark"
              >
                Sign In Now
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-forest mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 number, 1 special char"
                  className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3.5 py-2.5 pr-10 text-xs text-brand-forest focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-sage hover:text-brand-forest"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-forest mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3.5 py-2.5 text-xs text-brand-forest focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-emerald py-3 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
