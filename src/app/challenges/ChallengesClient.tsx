"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Trophy,
  Users,
  Shield,
  CheckCircle2,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Info,
  Loader2,
  X,
  Award,
} from "lucide-react";

interface ChallengesClientProps {
  user: any;
}

export function ChallengesClient({ user }: ChallengesClientProps) {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"challenges" | "leaderboard">("challenges");
  const [loading, setLoading] = useState<boolean>(true);

  // Join challenge modal state
  const [joiningChallenge, setJoiningChallenge] = useState<any>(null);
  const [displayName, setDisplayName] = useState(user.name || "Community Member");
  const [isOptedInLeaderboard, setIsOptedInLeaderboard] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const [chRes, lbRes] = await Promise.all([
        fetch("/api/challenges"),
        fetch("/api/challenges/leaderboard"),
      ]);
      const chData = await chRes.json();
      const lbData = await lbRes.json();

      if (chData.data) setChallenges(chData.data);
      if (lbData.data?.entries) setLeaderboard(lbData.data.entries);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningChallenge) return;
    setIsJoining(true);

    try {
      const res = await fetch(`/api/challenges/${joiningChallenge.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          isOptedInLeaderboard,
        }),
      });

      if (res.ok) {
        setJoiningChallenge(null);
        fetchChallenges();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async (challengeId: string) => {
    if (!confirm("Are you sure you want to leave this challenge? Your current progress will be reset.")) return;
    try {
      await fetch(`/api/challenges/${challengeId}/leave`, { method: "POST" });
      fetchChallenges();
    } catch (e) {
      console.error(e);
    }
  };

  const handleIncrementProgress = async (challenge: any) => {
    const current = challenge.userParticipation?.progressValue || 0;
    const nextVal = current + 1;
    try {
      await fetch(`/api/challenges/${challenge.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressValue: nextVal }),
      });
      fetchChallenges();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
              Challenges & Community
            </h1>
            <p className="text-xs sm:text-sm text-brand-sage mt-1">
              Join achievable sustainability challenges. Progress is self-reported, and individual household logs remain strictly confidential.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-white p-1 border border-brand-border shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("challenges")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === "challenges"
                  ? "bg-brand-forest text-white"
                  : "text-brand-sage hover:text-brand-forest"
              }`}
            >
              Active Challenges
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("leaderboard")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === "leaderboard"
                  ? "bg-brand-forest text-white"
                  : "text-brand-sage hover:text-brand-forest"
              }`}
            >
              Community Leaderboard
            </button>
          </div>
        </div>

        {/* Tab 1: Challenges List */}
        {activeTab === "challenges" && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-emerald" />
              </div>
            ) : challenges.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-brand-border bg-white p-12 text-center">
                <p className="text-sm font-semibold text-brand-forest">
                  No challenges available at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((ch) => {
                  const isJoined = ch.isJoined;
                  const participation = ch.userParticipation;
                  const progress = participation?.progressValue || 0;
                  const target = ch.targetValue;
                  const percentage = Math.min(100, Math.round((progress / target) * 100));
                  const isCompleted = participation?.status === "COMPLETED";

                  return (
                    <div
                      key={ch.id}
                      className={`rounded-3xl border p-6 shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                        isCompleted
                          ? "border-emerald-300 bg-emerald-50/40"
                          : isJoined
                          ? "border-brand-emerald bg-white shadow-md"
                          : "border-brand-border bg-white hover:shadow-md"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="rounded-md bg-brand-natural px-2.5 py-1 font-semibold text-brand-forest border border-brand-border">
                            {ch.category.replace("_", " ")}
                          </span>
                          <span className="flex items-center text-brand-sage font-medium">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            {ch.durationDays} Days Duration
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-brand-forest">
                          {ch.title}
                        </h2>

                        <p className="text-xs text-brand-sage leading-relaxed">
                          {ch.description}
                        </p>

                        <div className="rounded-xl bg-brand-natural p-3 border border-brand-border text-xs text-brand-forest">
                          <p>
                            <strong>Rule:</strong> {ch.rules}
                          </p>
                          <p className="text-[11px] text-brand-sage mt-1">
                            Target: {ch.targetValue} {ch.unit} ({ch.targetMetric})
                          </p>
                        </div>

                        {/* Progress Bar if Joined */}
                        {isJoined && (
                          <div className="space-y-1 pt-2">
                            <div className="flex justify-between text-xs text-brand-forest font-semibold">
                              <span>Your Progress:</span>
                              <span className="font-mono">
                                {progress} / {target} {ch.unit} ({percentage}%)
                              </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-brand-natural overflow-hidden border border-brand-border">
                              <div
                                className="h-full bg-brand-emerald rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                        {isCompleted ? (
                          <span className="inline-flex items-center text-xs font-bold text-brand-emerald-dark">
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            Challenge Completed!
                          </span>
                        ) : isJoined ? (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleIncrementProgress(ch)}
                              className="rounded-xl bg-brand-emerald px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-emerald-dark"
                            >
                              + Log 1 {ch.unit}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleLeave(ch.id)}
                              className="rounded-xl border border-brand-border px-3 py-1.5 text-xs font-semibold text-brand-sage hover:text-red-600"
                            >
                              Leave
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setJoiningChallenge(ch);
                              setDisplayName(user.name);
                            }}
                            className="inline-flex items-center rounded-xl bg-brand-forest px-4 py-2 text-xs font-semibold text-white hover:bg-brand-forest/90"
                          >
                            Join Challenge
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </button>
                        )}

                        <span className="text-[11px] text-brand-sage">
                          {ch._count?.participants || 0} enrolled
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="rounded-3xl border border-brand-border bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-brand-border">
              <div>
                <h2 className="text-lg font-bold text-brand-forest flex items-center">
                  <Award className="mr-2 h-5 w-5 text-amber-500" />
                  Community Green League
                </h2>
                <p className="text-xs text-brand-sage">
                  Rankings reflect self-reported verified progress for community members who explicitly opted in.
                </p>
              </div>

              <div className="rounded-full bg-brand-natural px-3 py-1 text-xs font-medium text-brand-forest border border-brand-border">
                Privacy-protected • Opt-in only
              </div>
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-emerald" />
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-border bg-brand-natural/40 p-12 text-center space-y-3">
                <Users className="h-10 w-10 text-brand-sage/40 mx-auto" />
                <h3 className="text-base font-bold text-brand-forest">
                  No Leaderboard Entries Yet
                </h3>
                <p className="text-xs text-brand-sage max-w-sm mx-auto">
                  Be the first to join a challenge and opt in to appear on the community leaderboard with your chosen display name!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("challenges")}
                  className="rounded-xl bg-brand-emerald px-4 py-2 text-xs font-semibold text-white hover:bg-brand-emerald-dark"
                >
                  Explore Challenges
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-brand-border bg-brand-natural/70 text-brand-forest font-bold">
                    <tr>
                      <th className="py-3 px-4 w-16">Rank</th>
                      <th className="py-3 px-4">Participant</th>
                      <th className="py-3 px-4">Challenge</th>
                      <th className="py-3 px-4 text-right">Self-Reported Progress</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {leaderboard.map((entry, idx) => (
                      <tr key={entry.id} className="hover:bg-brand-natural/30">
                        <td className="py-3 px-4 font-mono font-bold text-brand-forest">
                          #{idx + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold text-brand-forest">
                          {entry.displayName}
                        </td>
                        <td className="py-3 px-4 text-brand-sage">
                          {entry.challenge?.title}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-brand-emerald-dark">
                          {entry.progressValue} / {entry.challenge?.targetValue} {entry.challenge?.unit}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                              entry.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-brand-natural text-brand-forest border border-brand-border"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Join Challenge Modal */}
      {joiningChallenge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-brand-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-base font-bold text-brand-forest">
                Join {joiningChallenge.title}
              </h3>
              <button
                type="button"
                onClick={() => setJoiningChallenge(null)}
                className="text-brand-sage hover:text-brand-forest"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Privacy Explanation Notice */}
            <div className="rounded-xl bg-brand-natural p-3.5 border border-brand-border text-xs text-brand-sage space-y-1">
              <div className="flex items-center text-brand-forest font-bold">
                <Shield className="mr-1.5 h-3.5 w-3.5 text-brand-emerald" />
                <span>Privacy Before You Join</span>
              </div>
              <p>
                Only your chosen display name and progress value are shared publicly on the community leaderboard. Your private activity ledger, exact energy usage, notes, and dates are never exposed.
              </p>
            </div>

            <form onSubmit={handleJoin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  Public Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. EcoExplorer or Ankit K."
                  className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3.5 py-2 text-xs text-brand-forest focus:border-brand-emerald focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-xs text-brand-forest cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOptedInLeaderboard}
                    onChange={(e) => setIsOptedInLeaderboard(e.target.checked)}
                    className="h-4 w-4 rounded border-brand-border text-brand-emerald focus:ring-brand-emerald"
                  />
                  <span>Show my display name on the community leaderboard</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setJoiningChallenge(null)}
                  className="rounded-xl border border-brand-border px-4 py-2 text-xs font-semibold text-brand-sage hover:text-brand-forest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isJoining}
                  className="rounded-xl bg-brand-emerald px-5 py-2 text-xs font-semibold text-white hover:bg-brand-emerald-dark disabled:opacity-50"
                >
                  {isJoining ? "Enrolling..." : "Confirm & Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
