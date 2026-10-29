import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { RecommendationRepository } from "@/lib/data-access/recommendation.repository";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const recs = await RecommendationRepository.listForUser(user.id);
    return apiSuccess(recs);
  } catch (error: any) {
    return apiError(error.message || "Failed to load recommendations.", "INTERNAL_ERROR", 500);
  }
}
