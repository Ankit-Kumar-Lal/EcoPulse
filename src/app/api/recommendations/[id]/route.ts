import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { RecommendationRepository } from "@/lib/data-access/recommendation.repository";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const { id } = await params;
    const body = await req.json();
    const status = body?.status;

    if (!["SHOWN", "DISMISSED", "COMPLETED"].includes(status)) {
      return apiError("Invalid status value.", "VALIDATION_ERROR", 400);
    }

    const updated = await RecommendationRepository.updateStatus(
      user.id,
      id,
      status as any
    );

    return apiSuccess(updated);
  } catch (error: any) {
    return apiError(
      error.message || "Failed to update recommendation status.",
      "INTERNAL_ERROR",
      500
    );
  }
}
