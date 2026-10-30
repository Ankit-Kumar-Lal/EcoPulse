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
  Flame,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0D2E22]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              Challenges & Community
            </h1>
            <p className="text-xs sm:text-sm text-[#8BA398] mt-1">
              Join achievable sustainability challenges. Progress is self-reported, and individual household logs remain strictly confidential.
            </p>
          </div>

          <div className="inline-flex rounded-2xl bg-[#091F18] p-1.5 border border-[#143E30] shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("challenges")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "challenges"
                  ? "bg-[#113B2C] text-[#34D399] border border-[#10B981]/40 shadow-sm"
                  : "text-[#8BA398] hover:text-white"
              }`}
            >
              Active Challenges
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("leaderboard")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "leaderboard"
                  ? "bg-[#113B2C] text-[#34D399] border border-[#10B981]/40 shadow-sm"
                  : "text-[#8BA398] hover:text-white"
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
                <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
              </div>
            ) : challenges.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#143E30] bg-[#091F18] p-12 text-center">
                <p className="text-sm font-semibold text-white">
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
                      className={`rounded-3xl border p-6 shadow-xl transition-all flex flex-col justify-between space-y-4 ${
                        isCompleted
                          ? "border-[#10B981]/60 bg-[#0A291E]"
                          : isJoined
                          ? "border-[#10B981]/40 bg-[#091F18] shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                          : "border-[#143E30] bg-[#091F18] hover:border-[#10B981]/30"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="rounded-xl bg-[#06140F] px-3 py-1 font-semibold text-[#34D399] border border-[#0D2E22]">
                            {ch.category.replace("_", " ")}
                          </span>
                          <span className="flex items-center text-[#718E80] font-medium">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            {ch.durationDays} days
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white leading-snug">
                          {ch.title}
                        </h3>

                        <p className="text-xs text-[#8BA398] leading-relaxed">
                          {ch.description}
                        </p>

                        <div className="rounded-2xl bg-[#06140F] p-3.5 border border-[#0D2E22] text-xs text-[#E2F0EA]">
                          <p>
                            <strong className="text-white">Rule:</strong> {ch.rules}
                          </p>
                          <p className="text-[11px] text-[#718E80] mt-1">
                            Target: {ch.targetValue} {ch.unit} ({ch.targetMetric})
                          </p>
                        </div>

                        {/* Progress Bar if Joined */}
                        {isJoined && (
                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-xs text-white font-semibold">
                              <span>Your Progress:</span>
                              <span className="font-mono text-[#34D399]">
                                {progress} / {target} {ch.unit} ({percentage}%)
                              </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-[#05140F] overflow-hidden border border-[#0D2E22]">
                              <div
                                className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all duration-300 shadow-[0_0_10px_#10B981]"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-[#0D2E22] flex items-center justify-between">
                        {isCompleted ? (
                          <span className="inline-flex items-center text-xs font-bold text-[#34D399]">
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            Challenge Completed! (+150 XP)
                          </span>
                        ) : isJoined ? (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleIncrementProgress(ch)}
                              className="rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-110 transition"
                            >
                              + Log 1 {ch.unit}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleLeave(ch.id)}
                              className="rounded-xl border border-[#143E30] px-3.5 py-2 text-xs font-semibold text-[#8BA398] hover:text-red-400 hover:border-red-800 transition"
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
                            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-110 transition"
                          >
                            Join Challenge
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </button>
                        )}

                        <span className="text-[11px] text-[#718E80]">
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
          <div className="rounded-3xl border border-[#143E30] bg-[#091F18] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#0D2E22]">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center">
                  <Award className="mr-2 h-5 w-5 text-amber-400" />
                  Community Green League
                </h2>
                <p className="text-xs text-[#8BA398]">
                  Rankings reflect self-reported verified progress for community members who explicitly opted in.
                </p>
              </div>

              <div className="rounded-full bg-[#06140F] px-3.5 py-1 text-xs font-semibold text-[#34D399] border border-[#10B981]/30">
                Privacy-protected • Opt-in only
              </div>
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#143E30] bg-[#06140F] p-12 text-center space-y-3">
                <Users className="h-10 w-10 text-[#5D7E70] mx-auto" />
                <h3 className="text-base font-bold text-white">
                  No Leaderboard Entries Yet
                </h3>
                <p className="text-xs text-[#8BA398] max-w-sm mx-auto">
                  Be the first to join a challenge and opt in to appear on the community leaderboard with your chosen display name!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("challenges")}
                  className="rounded-xl bg-[#10B981] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600"
                >
                  Explore Challenges
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#0D2E22] bg-[#06140F] text-[#8BA398] font-bold">
                    <tr>
                      <th className="py-3 px-4 w-16">Rank</th>
                      <th className="py-3 px-4">Participant</th>
                      <th className="py-3 px-4">Challenge</th>
                      <th className="py-3 px-4 text-right">Self-Reported Progress</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0D2E22]">
                    {leaderboard.map((entry, idx) => {
                      const isDemo = entry.user?.isDemoUser ?? false;
                      const isCurrentUser = entry.userId === user.id || entry.displayName === user.name;

                      return (
                        <tr
                          key={entry.id}
                          className={`hover:bg-[#0B251D] transition ${
                            isCurrentUser ? "bg-[#113B2C]/50 font-bold" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            #{idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-white">
                                {isCurrentUser ? `You (${entry.displayName})` : entry.displayName}
                              </span>
                              {isDemo && (
                                <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-500/30">
                                  Demo Profile
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#8BA398]">
                            {entry.challenge?.title}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#34D399]">
                            {entry.progressValue} / {entry.challenge?.targetValue} {entry.challenge?.unit}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                entry.status === "COMPLETED"
                                  ? "bg-emerald-950/80 text-[#34D399] border border-[#10B981]/40"
                                  : "bg-[#06140F] text-[#8BA398] border border-[#0D2E22]"
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-[#091F18] p-6 sm:p-8 shadow-2xl border border-[#143E30] space-y-4 text-[#E2F0EA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#0D2E22]">
              <h3 className="text-base font-bold text-white">
                Join {joiningChallenge.title}
              </h3>
              <button
                type="button"
                onClick={() => setJoiningChallenge(null)}
                className="rounded-lg p-1 text-[#8BA398] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                  Public Display Name on Leaderboard
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none"
                />
              </div>

              <div className="flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  id="optin"
                  checked={isOptedInLeaderboard}
                  onChange={(e) => setIsOptedInLeaderboard(e.target.checked)}
                  className="mt-0.5 rounded border-[#143E30] text-[#10B981] focus:ring-[#10B981]"
                />
                <label htmlFor="optin" className="text-xs text-[#8BA398] leading-snug">
                  Show my chosen display name and challenge progress on the Community Leaderboard. (Household log details remain 100% private).
                </label>
              </div>

              <div className="pt-3 border-t border-[#0D2E22] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setJoiningChallenge(null)}
                  className="rounded-xl border border-[#143E30] px-4 py-2 text-xs font-semibold text-[#8BA398] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isJoining}
                  className="rounded-xl bg-[#10B981] px-5 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
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
