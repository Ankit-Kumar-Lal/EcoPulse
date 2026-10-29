import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { notificationPreferenceSchema } from "@/lib/validations/profile";
import { UserRepository } from "@/lib/data-access/user.repository";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const body = await req.json();
    const parsed = notificationPreferenceSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400
      );
    }

    const updated = await UserRepository.updateNotifications(user.id, parsed.data);
    return apiSuccess(updated);
  } catch (error: any) {
    return apiError(
      error.message || "Failed to update notification settings.",
      "INTERNAL_ERROR",
      500
    );
  }
}
