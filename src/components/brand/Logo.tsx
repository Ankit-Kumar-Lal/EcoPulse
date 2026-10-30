import Link from "next/link";
import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
  priority?: boolean;
  variant?: "brand" | "header" | "compact";
}

export function Logo({
  size = "md",
  href = "/",
  className = "",
  variant = "brand",
}: LogoProps) {
  const content = (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Emerald Swirl Icon / Leaf Badge */}
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.35)] p-0.5">
        <div className="h-full w-full rounded-[14px] bg-[#071F17] flex items-center justify-center overflow-hidden">
          <img
            src="/brand/ecopulse-logo.png"
            alt="EcoPulse Leaf Logo"
            className="h-7 w-7 object-contain drop-shadow"
          />
        </div>
      </div>

      {variant !== "compact" && (
        <div className="flex flex-col text-left">
          <span className="text-lg font-extrabold tracking-tight text-white font-sans leading-tight">
            EcoPulse
          </span>
          <span className="text-[9px] font-bold tracking-[0.18em] text-emerald-400 uppercase leading-none mt-0.5">
            Small Actions. Measurable Impact.
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl"
        aria-label="EcoPulse Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
