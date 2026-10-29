import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = "md",
  href = "/",
  className = "",
  priority = false,
}: LogoProps) {
  const dimensions = {
    sm: { width: 130, height: 130, containerClass: "w-[120px]" },
    md: { width: 180, height: 180, containerClass: "w-[160px]" },
    lg: { width: 220, height: 220, containerClass: "w-[200px]" },
    xl: { width: 320, height: 320, containerClass: "w-[280px]" },
  }[size];

  const content = (
    <div
      className={`inline-flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm border border-brand-border/60 ${dimensions.containerClass} ${className}`}
    >
      <img
        src="/brand/ecopulse-logo.png"
        alt="EcoPulse - Small Actions. Measurable Impact."
        className="h-auto w-full object-contain"
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex transition-transform hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald rounded-xl"
        aria-label="EcoPulse Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
