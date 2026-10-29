import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-natural p-4 text-center">
      <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-brand-forest">404</span>
          <h1 className="text-xl font-bold text-brand-forest">
            Page Not Found
          </h1>
          <p className="text-xs text-brand-sage max-w-xs mx-auto">
            The page you are looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-brand-emerald px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-emerald-dark transition"
          >
            <Home className="mr-1.5 h-3.5 w-3.5" />
            Return Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl border border-brand-border bg-white px-5 py-2.5 text-xs font-semibold text-brand-forest hover:bg-brand-natural transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
