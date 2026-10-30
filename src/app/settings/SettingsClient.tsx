"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  User,
  Sliders,
  Bell,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  AlertTriangle,
} from "lucide-react";

interface SettingsClientProps {
  user: any;
  fullUser: any;
}

export function SettingsClient({ user, fullUser }: SettingsClientProps) {
  const router = useRouter();

  // Profile Form state
  const [name, setName] = useState(fullUser?.name || user.name || "");
  const [region, setRegion] = useState(fullUser?.profile?.region || "IN");
  const [units, setUnits] = useState(fullUser?.profile?.units || "metric");
  const [householdSize, setHouseholdSize] = useState(
    fullUser?.profile?.householdSize || 1
  );
  const [bio, setBio] = useState(fullUser?.profile?.bio || "");
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(
    Boolean(fullUser?.profile?.leaderboardOptIn)
  );

  // Notification state
  const [emailWeeklyDigest, setEmailWeeklyDigest] = useState(
    fullUser?.notifications?.emailWeeklyDigest ?? true
  );
  const [emailMonthlyReport, setEmailMonthlyReport] = useState(
    fullUser?.notifications?.emailMonthlyReport ?? true
  );
  const [challengeReminders, setChallengeReminders] = useState(
    fullUser?.notifications?.challengeReminders ?? true
  );

  // Feedback states
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setProfileSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          region,
          units,
          householdSize,
          bio,
          leaderboardOptIn,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to update profile.");
      }

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save profile.");
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      await fetch("/api/profile/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailWeeklyDigest,
          emailMonthlyReport,
          challengeReminders,
          productUpdates: false,
          inAppAlerts: true,
        }),
      });
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationInput !== "DELETE_MY_ACCOUNT") return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: confirmationInput }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to delete account.");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete account.");
      setIsDeleting(false);
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="pb-4 border-b border-[#0D2E22]">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#8BA398] mt-1">
            Manage your personal profile, regional factor context, privacy settings, and complete data exports.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-2xl bg-red-950/40 p-4 text-xs text-red-300 flex items-start border border-red-800">
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Profile & Preferences */}
        <div className="rounded-3xl border border-[#143E30] bg-[#091F18] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#0D2E22]">
            <User className="h-5 w-5 text-[#34D399]" />
            <h2 className="text-base font-bold text-white">
              Personal Information & Units
            </h2>
          </div>

          {profileSuccess && (
            <div className="rounded-xl bg-emerald-950/60 p-3 text-xs text-[#34D399] flex items-center border border-[#10B981]/40">
              <CheckCircle2 className="mr-2 h-4 w-4 text-[#10B981]" />
              <span>Profile preferences updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full rounded-xl border border-[#0D2E22] bg-[#06140F]/60 px-3.5 py-2 text-xs text-[#5D7E70] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                  Electricity Grid Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none"
                >
                  <option value="IN">India (CEA v19 - 0.716 kg/kWh)</option>
                  <option value="GLOBAL">Global / Europe (DEFRA 2024 - 0.207 kg/kWh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                  Measurement System
                </label>
                <select
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none"
                >
                  <option value="metric">Metric (kg, km, litres)</option>
                  <option value="imperial">Imperial (lbs, miles, gallons)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                  Household Occupants
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                  Bio / Household Description (Optional)
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. 2-bedroom apartment in Bengaluru"
                  className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none"
                />
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="pt-3 border-t border-[#0D2E22]">
              <label className="flex items-center space-x-2.5 text-xs text-[#E2F0EA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={leaderboardOptIn}
                  onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                  className="h-4 w-4 rounded border-[#143E30] text-[#10B981] focus:ring-[#10B981]"
                />
                <span>Include my display name on public community challenge leaderboards (household logs remain private)</span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-110 transition"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Notifications */}
        <div className="rounded-3xl border border-[#143E30] bg-[#091F18] p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#0D2E22]">
            <Bell className="h-5 w-5 text-[#34D399]" />
            <h2 className="text-base font-bold text-white">
              Notification Preferences
            </h2>
          </div>

          {notifSuccess && (
            <div className="rounded-xl bg-emerald-950/60 p-3 text-xs text-[#34D399] flex items-center border border-[#10B981]/40">
              <CheckCircle2 className="mr-2 h-4 w-4 text-[#10B981]" />
              <span>Notification preferences saved.</span>
            </div>
          )}

          <div className="space-y-3">
            {[
              {
                id: "weekly",
                title: "Weekly Carbon Summary Digest",
                desc: "Receive an email summary of your 7-day activity totals and active goal progress.",
                checked: emailWeeklyDigest,
                setter: setEmailWeeklyDigest,
              },
              {
                id: "monthly",
                title: "Monthly Progress Report",
                desc: "Receive monthly category breakdown charts and comparable trend reports.",
                checked: emailMonthlyReport,
                setter: setEmailMonthlyReport,
              },
              {
                id: "challenges",
                title: "Habit & Challenge Reminders",
                desc: "Gentle, non-intrusive reminders to log habit progress for active challenges.",
                checked: challengeReminders,
                setter: setChallengeReminders,
              },
            ].map((n) => (
              <label
                key={n.id}
                className="flex items-start space-x-3 p-3.5 rounded-2xl border border-[#0D2E22] bg-[#06140F]/60 hover:bg-[#06140F] cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={n.checked}
                  onChange={(e) => {
                    n.setter(e.target.checked);
                    setTimeout(handleUpdateNotifications, 50);
                  }}
                  className="h-4 w-4 rounded border-[#143E30] text-[#10B981] focus:ring-[#10B981] mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {n.title}
                  </span>
                  <span className="text-[11px] text-[#8BA398]">
                    {n.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: Data Export */}
        <div className="rounded-3xl border border-[#143E30] bg-[#091F18] p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#0D2E22]">
            <Download className="h-5 w-5 text-[#34D399]" />
            <h2 className="text-base font-bold text-white">
              Data Portability & Export
            </h2>
          </div>

          <p className="text-xs text-[#8BA398] leading-relaxed">
            You have full ownership of your data. Download your complete activity log, emission factors, and active goals in standard structured formats.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <a
              href="/api/activities/export"
              download
              className="flex items-center justify-between rounded-2xl border border-[#143E30] bg-[#06140F] p-4 hover:border-[#10B981] transition"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B251D] text-[#34D399]">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Download CSV Ledger
                  </span>
                  <span className="text-[11px] text-[#718E80]">
                    Activities & cited factors
                  </span>
                </div>
              </div>
              <Download className="h-4 w-4 text-[#8BA398]" />
            </a>

            <a
              href="/api/profile/export"
              download
              className="flex items-center justify-between rounded-2xl border border-[#143E30] bg-[#06140F] p-4 hover:border-[#10B981] transition"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B251D] text-amber-400">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Complete JSON Archive
                  </span>
                  <span className="text-[11px] text-[#718E80]">
                    Account, profile & goals
                  </span>
                </div>
              </div>
              <Download className="h-4 w-4 text-[#8BA398]" />
            </a>
          </div>
        </div>

        {/* Section 4: Danger Zone - Account Deletion */}
        <div className="rounded-3xl border border-red-900/60 bg-red-950/20 p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="h-5 w-5" />
            <h2>Danger Zone: Account Deletion</h2>
          </div>

          <p className="text-xs text-red-300/80 leading-relaxed">
            Permanently delete your EcoPulse account. This immediately cascades through the database, completely removing your profile, all recorded activities, goals, challenge progress, and sessions. This action cannot be undone.
          </p>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition"
          >
            Delete Account Permanently
          </button>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-[#091F18] p-6 sm:p-8 shadow-2xl border border-red-800 space-y-4 text-white">
            <div className="flex items-center space-x-2 text-red-400 font-bold text-base">
              <Trash2 className="h-5 w-5" />
              <h3>Confirm Permanent Account Deletion</h3>
            </div>

            <p className="text-xs text-[#8BA398] leading-relaxed">
              To prevent accidental deletion, please type <strong className="font-mono text-red-400">DELETE_MY_ACCOUNT</strong> below to confirm. All your recorded footprint history will be wiped immediately.
            </p>

            <div>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="DELETE_MY_ACCOUNT"
                className="w-full rounded-xl border border-red-800 bg-[#06140F] px-3.5 py-2 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#0D2E22]">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmationInput("");
                }}
                className="rounded-xl border border-[#143E30] px-4 py-2 text-xs font-semibold text-[#8BA398] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmationInput !== "DELETE_MY_ACCOUNT" || isDeleting}
                onClick={handleDeleteAccount}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-40"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
