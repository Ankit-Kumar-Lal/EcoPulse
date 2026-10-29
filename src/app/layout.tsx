import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoPulse — Small Actions. Measurable Impact.",
  description:
    "Understand your everyday environmental footprint, discover practical ways to reduce it, and keep track of verifiable progress with EcoPulse.",
  icons: {
    icon: "/brand/ecopulse-logo.png",
    shortcut: "/brand/ecopulse-logo.png",
    apple: "/brand/ecopulse-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased selection:bg-brand-lime selection:text-brand-forest">
        {children}
      </body>
    </html>
  );
}
