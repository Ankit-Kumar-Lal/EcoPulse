import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { ChallengeRepository } from "@/lib/data-access/challenge.repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const displayName =
      body?.displayName?.trim() || user.name || "Community Member";
    const isOptedInLeaderboard = Boolean(body?.isOptedInLeaderboard);

    const participation = await ChallengeRepository.join(
      id,
      user.id,
      displayName,
      isOptedInLeaderboard
    );

    return apiSuccess(participation);
  } catch (error: any) {
    return apiError(error.message || "Failed to join challenge.", "INTERNAL_ERROR", 500);
  }
}
