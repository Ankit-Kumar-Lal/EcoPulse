import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { AuthService } from "@/lib/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400
      );
    }

    await AuthService.resetPassword(parsed.data);
    return apiSuccess({ message: "Password updated successfully. You can now sign in." });
  } catch (error: any) {
    return apiError(error.message || "Failed to reset password.", "BAD_REQUEST", 400);
  }
}
