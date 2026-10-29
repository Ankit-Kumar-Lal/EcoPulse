import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { onboardingSchema } from "@/lib/validations/profile";
import { UserRepository } from "@/lib/data-access/user.repository";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400
      );
    }

    const updated = await UserRepository.updateProfile(user.id, {
      region: parsed.data.region,
      units: parsed.data.units,
      householdSize: parsed.data.householdSize,
      focusAreas: parsed.data.focusAreas,
    });

    return apiSuccess({
      profile: updated,
      message: "Onboarding preferences saved successfully.",
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to save onboarding.", "INTERNAL_ERROR", 500);
  }
}
