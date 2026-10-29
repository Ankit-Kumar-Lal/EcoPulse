import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession, destroySession } from "@/lib/auth/session";
import { profileUpdateSchema } from "@/lib/validations/profile";
import { UserRepository } from "@/lib/data-access/user.repository";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const fullProfile = await UserRepository.findById(user.id);
    return apiSuccess(fullProfile);
  } catch (error: any) {
    return apiError(error.message || "Failed to load profile.", "INTERNAL_ERROR", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const body = await req.json();
    const parsed = profileUpdateSchema.partial().safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400
      );
    }

    const updated = await UserRepository.updateProfile(user.id, parsed.data);
    return apiSuccess(updated);
  } catch (error: any) {
    return apiError(error.message || "Failed to update profile.", "INTERNAL_ERROR", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const body = await req.json().catch(() => ({}));
    if (body.confirmation !== "DELETE_MY_ACCOUNT") {
      return apiError(
        "Please provide explicit confirmation string 'DELETE_MY_ACCOUNT' to proceed.",
        "CONFIRMATION_REQUIRED",
        400
      );
    }

    await UserRepository.deleteUserPermanently(user.id);
    await destroySession();

    return apiSuccess({
      message: "Your account and all associated personal data have been permanently deleted.",
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete account.", "INTERNAL_ERROR", 500);
  }
}
