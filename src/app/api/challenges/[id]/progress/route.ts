import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { ChallengeRepository } from "@/lib/data-access/challenge.repository";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const { id } = await params;
    const body = await req.json();
    const progressValue = Number(body?.progressValue);

    if (isNaN(progressValue) || progressValue < 0) {
      return apiError("Valid positive progress value required.", "VALIDATION_ERROR", 400);
    }

    const updated = await ChallengeRepository.updateProgress(
      id,
      user.id,
      progressValue
    );

    if (!updated) {
      return apiError("Active participation not found.", "NOT_FOUND", 404);
    }

    return apiSuccess(updated);
  } catch (error: any) {
    return apiError(error.message || "Failed to update challenge progress.", "INTERNAL_ERROR", 500);
  }
}
