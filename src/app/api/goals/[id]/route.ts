import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { GoalRepository } from "@/lib/data-access/goal.repository";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const { id } = await params;
    const deleted = await GoalRepository.delete(id, user.id);
    if (!deleted) {
      return apiError("Goal not found or unauthorized.", "NOT_FOUND", 404);
    }

    return apiSuccess({ message: "Goal deleted successfully." });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete goal.", "INTERNAL_ERROR", 500);
  }
}
