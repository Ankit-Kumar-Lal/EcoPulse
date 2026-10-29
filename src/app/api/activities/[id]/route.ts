import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { activitySchema } from "@/lib/validations/activity";
import { ActivityService } from "@/lib/services/activity.service";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return apiError("Authentication required.", "UNAUTHORIZED", 401);
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = activitySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400
      );
    }

    const updated = await ActivityService.updateActivity(id, user.id, parsed.data);
    return apiSuccess(updated);
  } catch (error: any) {
    return apiError(error.message || "Failed to update activity.", "BAD_REQUEST", 400);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return apiError("Authentication required.", "UNAUTHORIZED", 401);
    }

    const { id } = await params;
    await ActivityService.deleteActivity(id, user.id);
    return apiSuccess({ message: "Activity deleted successfully." });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete activity.", "BAD_REQUEST", 400);
  }
}
