"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    tokenFromUrl ? "verifying" : "idle"
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (tokenFromUrl) {
      verifyToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const verifyToken = async (tokenToVerify: string) => {
    setStatus("verifying");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Verification link is invalid or expired.");
      }

      setStatus("success");
      setMessage("Your email has been successfully verified! You can now access all features.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to verify email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-natural p-4">
      <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-8 shadow-sm text-center space-y-6">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        {status === "verifying" && (
          <div className="space-y-4 py-6">
            <Loader2 className="h-10 w-10 animate-spin text-brand-emerald mx-auto" />
            <h2 className="text-lg font-bold text-brand-forest">
              Verifying your email...
            </h2>
            <p className="text-xs text-brand-sage">
              Please wait while we confirm your verification link.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 py-4">
            <CheckCircle2 className="h-12 w-12 text-brand-emerald mx-auto" />
            <h2 className="text-xl font-bold text-brand-forest">
              Email Verified
            </h2>
            <p className="text-xs text-brand-sage max-w-sm mx-auto">
              {message}
            </p>
            <div className="pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl bg-brand-emerald px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-emerald-dark"
              >
                Go to Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 py-4">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
            <h2 className="text-xl font-bold text-brand-forest">
              Verification Notice
            </h2>
            <p className="text-xs text-brand-sage max-w-sm mx-auto">
              {message}
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl bg-brand-forest px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-forest/90"
              >
                Continue to Dashboard
              </Link>
            </div>
          </div>
        )}

        {status === "idle" && (
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-2 text-brand-forest">
              <Mail className="h-5 w-5 text-brand-emerald" />
              <h2 className="text-base font-bold">Email Verification</h2>
            </div>
            <p className="text-xs text-brand-sage">
              If you received a verification token, enter it below to confirm your account:
            </p>
            <div>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter verification token"
                className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3.5 py-2.5 text-xs text-brand-forest focus:border-brand-emerald focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => verifyToken(token)}
              disabled={!token}
              className="w-full rounded-xl bg-brand-emerald py-2.5 text-xs font-semibold text-white hover:bg-brand-emerald-dark disabled:opacity-50"
            >
              Verify Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
