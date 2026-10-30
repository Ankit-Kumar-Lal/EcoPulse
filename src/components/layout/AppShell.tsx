"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../brand/Logo";
import {
  LayoutDashboard,
  Footprints,
  TrendingUp,
  Trophy,
  SunMedium,
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
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface AppShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerifiedAt?: Date | string | null;
    profile?: any;
    gamification?: any;
  };
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Footprint", href: "/footprint", icon: Footprints },
    { name: "Insights", href: "/insights", icon: TrendingUp },
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/footprint?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#05120E] text-[#E2F0EA] flex flex-col md:flex-row antialiased">
      {/* Desktop Left Navigation Rail */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#071611] border-r border-[#0D2E22] z-30 shadow-2xl">
        {/* Brand header */}
        <div className="px-6 py-6 border-b border-[#0D2E22]/80 flex items-center">
          <Logo size="md" href="/dashboard" />
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
                className={`group flex items-center rounded-xl px-3.5 py-3 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#113B2C] text-[#34D399] border border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "text-[#8BA398] hover:bg-[#0B251D] hover:text-[#E2F0EA]"
                }`}
              >
                <Icon
                  className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${
                    isActive ? "text-[#34D399]" : "text-[#5D7E70] group-hover:text-[#34D399]"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Tagline Card */}
        <div className="p-4 border-t border-[#0D2E22]/80">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B281E] to-[#071912] p-4 border border-[#10B981]/20 shadow-lg group">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <Leaf className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-white">
                  A Greener Tomorrow
                </p>
                <p className="text-[11px] font-medium text-[#34D399]">
                  Starts Today.
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-[10px] text-[#718E80] leading-snug">
              Verified CEA v19.0 & DEFRA 2024 emission models active.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#0D2E22] bg-[#071611]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          {/* Mobile hamburger & brand */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-[#8BA398] hover:bg-[#0B251D] hover:text-white"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-2">
              <Logo size="sm" variant="compact" href="/dashboard" />
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-md items-center"
          >
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5D7E70]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities, guides, insights..."
                className="w-full rounded-xl border border-[#143E30] bg-[#06140F]/80 py-1.5 pl-9 pr-4 text-xs text-[#E2F0EA] placeholder:text-[#5D7E70] focus:border-[#10B981] focus:bg-[#081C15] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition"
              />
            </div>
          </form>

          {/* Right Topbar actions: Notifications & User Menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                }}
                className="relative rounded-xl p-2 text-[#8BA398] hover:bg-[#0B251D] hover:text-[#34D399] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#143E30] bg-[#081E16] p-4 shadow-2xl z-50 text-[#E2F0EA]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#0D2E22]">
                    <h4 className="text-xs font-bold text-white flex items-center">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#34D399]" />
                      Climate Telemetry Alerts
                    </h4>
                    <span className="text-[10px] text-[#34D399] font-mono">Live Sync</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div className="rounded-xl bg-[#06140F] p-3 text-xs border border-[#10B981]/20">
                      <p className="font-semibold text-[#34D399]">
                        Mission Control Online
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#8BA398] leading-relaxed">
                        Interactive 3D Earth telemetry linked. India collective emission reductions actively monitored.
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#06140F] p-3 text-xs border border-[#10B981]/20">
                      <p className="font-semibold text-[#34D399]">
                        Verified Baseline Models
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#8BA398] leading-relaxed">
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
                className="flex items-center space-x-2.5 rounded-xl p-1.5 hover:bg-[#0B251D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] transition"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#047857] text-xs font-bold text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-white leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#718E80] truncate max-w-[130px] leading-tight mt-0.5">
                    {user.email}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#5D7E70]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#143E30] bg-[#081E16] py-1.5 shadow-2xl z-50 text-[#E2F0EA]">
                  <div className="px-4 py-2.5 border-b border-[#0D2E22] text-xs">
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-[#718E80] text-[11px] truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-medium text-[#8BA398] hover:bg-[#0B251D] hover:text-[#34D399] transition"
                  >
                    <User className="mr-2 h-3.5 w-3.5 text-[#34D399]" />
                    Profile & Settings
                  </Link>

                  <Link
                    href="/methodology"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-medium text-[#8BA398] hover:bg-[#0B251D] hover:text-[#34D399] transition"
                  >
                    <ShieldCheck className="mr-2 h-3.5 w-3.5 text-[#34D399]" />
                    Methodology & Sources
                  </Link>

                  <a
                    href="/api/activities/export"
                    download
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-medium text-[#8BA398] hover:bg-[#0B251D] hover:text-[#34D399] transition"
                  >
                    <Download className="mr-2 h-3.5 w-3.5 text-[#34D399]" />
                    Download CSV Export
                  </a>

                  <div className="border-t border-[#0D2E22] my-1" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="flex w-full items-center px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 transition"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    {isLoggingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Slide-Over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[#071611] p-4 text-white border-r border-[#0D2E22]">
              <div className="flex items-center justify-between pb-4 border-b border-[#0D2E22]">
                <Logo size="sm" href="/dashboard" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-[#8BA398] hover:bg-[#0B251D] hover:text-white"
                >
                  <X className="h-5 w-5" />
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
                      className={`flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold ${
                        isActive
                          ? "bg-[#113B2C] text-[#34D399] border border-[#10B981]/40"
                          : "text-[#8BA398] hover:bg-[#0B251D] hover:text-white"
                      }`}
                    >
                      <Icon className="mr-3 h-4 w-4 text-[#34D399]" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-4 border-t border-[#0D2E22]">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center rounded-xl px-3 py-2 text-xs text-red-400 hover:bg-[#0B251D]"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1520px] w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Thumb Navigation */}
        <nav className="md:hidden sticky bottom-0 z-30 flex items-center justify-around border-t border-[#0D2E22] bg-[#071611]/95 backdrop-blur-md py-2 px-3 text-[10px]">
          {[
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Footprint", href: "/footprint", icon: Footprints },
            { name: "Challenges", href: "/challenges", icon: Trophy },
            { name: "Settings", href: "/settings", icon: Settings },
          ].map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition ${
                  isActive ? "text-[#34D399] font-bold" : "text-[#718E80] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
