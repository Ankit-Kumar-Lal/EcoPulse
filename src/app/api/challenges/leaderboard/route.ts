import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { ChallengeRepository } from "@/lib/data-access/challenge.repository";

export async function GET(req: NextRequest) {
  try {
    const challengeId = req.nextUrl.searchParams.get("challengeId") || undefined;
    const leaderboard = await ChallengeRepository.getLeaderboard(challengeId);
    return apiSuccess({
      entries: leaderboard,
      totalEntries: leaderboard.length,
      methodologyNote: "Rankings reflect self-reported verified progress for community members who explicitly opted in. Household activity details remain strictly private.",
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to load leaderboard.", "INTERNAL_ERROR", 500);
  }
}
