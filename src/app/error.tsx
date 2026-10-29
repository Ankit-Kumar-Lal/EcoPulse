"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-natural p-4 text-center">
      <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        <div className="space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-brand-forest">
            An Unexpected Error Occurred
          </h1>
          <p className="text-xs text-brand-sage max-w-xs mx-auto">
            Our systems encountered an unexpected condition. Your personal records and account data remain safe.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center rounded-xl bg-brand-emerald px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-emerald-dark transition"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-brand-border bg-white px-5 py-2.5 text-xs font-semibold text-brand-forest hover:bg-brand-natural transition"
          >
            <Home className="mr-1.5 h-3.5 w-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
