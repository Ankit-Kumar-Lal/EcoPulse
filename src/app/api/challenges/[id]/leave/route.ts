import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { ChallengeRepository } from "@/lib/data-access/challenge.repository";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const { id } = await params;
    const left = await ChallengeRepository.leave(id, user.id);
    if (!left) {
      return apiError("Participation not found.", "NOT_FOUND", 404);
    }

    return apiSuccess({ message: "Left challenge successfully." });
  } catch (error: any) {
    return apiError(error.message || "Failed to leave challenge.", "INTERNAL_ERROR", 500);
  }
}
