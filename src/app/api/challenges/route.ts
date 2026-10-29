import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { ChallengeRepository } from "@/lib/data-access/challenge.repository";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const challenges = await ChallengeRepository.listForUser(user.id);
    return apiSuccess(challenges);
  } catch (error: any) {
    return apiError(error.message || "Failed to load challenges.", "INTERNAL_ERROR", 500);
  }
}
