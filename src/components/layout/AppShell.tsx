"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../brand/Logo";
import {
  LayoutDashboard,
  Footprints,
  TrendingUp,
  Lightbulb,
  Trophy,
  BookOpen,
  Settings,
  Bell,
  Search,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
  Download,
  Leaf,
  SunMedium,
} from "lucide-react";

interface AppShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerifiedAt?: Date | string | null;
    profile?: any;
  };
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Footprint", href: "/footprint", icon: Footprints },
    { name: "Insights", href: "/insights", icon: TrendingUp },
    { name: "Recommendations", href: "/actions", icon: Lightbulb },
    { name: "Challenges", href: "/challenges", icon: Trophy },
    { name: "Solar Estimator", href: "/solar", icon: SunMedium },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-natural flex flex-col md:flex-row">
      {/* Desktop Sidebar (Dark Forest Green #12372A) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-brand-forest text-white z-30 shadow-lg">
        {/* Brand header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-center bg-brand-forest">
          <Logo size="md" />
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-emerald text-white shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-white" : "text-brand-lime"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Tagline Card */}
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-2 text-brand-lime text-xs font-semibold uppercase tracking-wider">
              <Leaf className="h-3.5 w-3.5" />
              <span>Small Actions.</span>
            </div>
            <p className="mt-1 text-xs text-white/90 font-medium">
              Measurable Impact.
            </p>
            <p className="mt-1 text-[11px] text-white/70">
              CEA v19.0 & DEFRA 2024 emission models active.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand-border bg-white px-4 sm:px-6 lg:px-8 shadow-sm">
          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-brand-forest hover:bg-brand-natural"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-3">
              <Logo size="sm" />
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden sm:flex flex-1 max-w-md items-center">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-sage" />
              <input
                type="text"
                placeholder="Search activities, factors, guides..."
                className="w-full rounded-lg border border-brand-border bg-brand-natural/60 py-1.5 pl-9 pr-4 text-sm text-brand-forest placeholder:text-brand-sage focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = (e.target as HTMLInputElement).value;
                    if (q) router.push(`/footprint?search=${encodeURIComponent(q)}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Right Topbar actions: Notifications & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                }}
                className="relative rounded-lg p-2 text-brand-sage hover:bg-brand-natural hover:text-brand-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-emerald" />
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-brand-border bg-white p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                    <h4 className="text-sm font-semibold text-brand-forest">
                      Notifications
                    </h4>
                    <span className="text-xs text-brand-sage">Real-time local</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-lg bg-brand-natural p-2.5 text-xs text-brand-forest border border-brand-border/60">
                      <p className="font-semibold text-brand-emerald-dark">
                        Account Ready
                      </p>
                      <p className="mt-0.5 text-brand-sage">
                        Your EcoPulse carbon tracking account is active with standard regional emission models.
                      </p>
                    </div>
                    <div className="rounded-lg bg-brand-natural p-2.5 text-xs text-brand-forest border border-brand-border/60">
                      <p className="font-semibold text-brand-emerald-dark">
                        Verified Baseline Factors
                      </p>
                      <p className="mt-0.5 text-brand-sage">
                        CEA India v19 grid factor (0.716 kg/kWh) and DEFRA 2024 transport metrics loaded.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-3 rounded-lg p-1.5 hover:bg-brand-natural focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-forest text-xs font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden text-left lg:block">
                  <p className="text-xs font-semibold text-brand-forest">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-brand-sage truncate max-w-[140px]">
                    {user.email}
                  </p>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-brand-border bg-white py-1.5 shadow-xl z-50">
                  <div className="px-4 py-2 border-b border-brand-border text-xs">
                    <p className="font-semibold text-brand-forest">{user.name}</p>
                    <p className="text-brand-sage truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-medium text-brand-forest hover:bg-brand-natural"
                  >
                    <User className="mr-2 h-4 w-4 text-brand-sage" />
                    Profile & Settings
                  </Link>

                  <Link
                    href="/methodology"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-medium text-brand-forest hover:bg-brand-natural"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4 text-brand-sage" />
                    Methodology & Sources
                  </Link>

                  <a
                    href="/api/activities/export"
                    download
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-medium text-brand-forest hover:bg-brand-natural"
                  >
                    <Download className="mr-2 h-4 w-4 text-brand-sage" />
                    Download CSV Export
                  </a>

                  <div className="border-t border-brand-border my-1" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="flex w-full items-center px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-brand-forest p-4 text-white">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <Logo size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-white/80 hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-4 space-y-1.5 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive
                          ? "bg-brand-emerald text-white"
                          : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5 text-brand-lime" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-4 border-t border-white/10">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-white/10"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
