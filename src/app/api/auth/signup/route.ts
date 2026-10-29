import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { signUpSchema } from "@/lib/validations/auth";
import { AuthService } from "@/lib/services/auth.service";
import { checkRateLimit } from "@/lib/auth/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`signup_${ip}`, 5, 60 * 60 * 1000); // 5 per hour
    if (!rateCheck.success) {
      return apiError(
        `Too many sign-up attempts. Please wait ${rateCheck.resetSeconds} seconds before trying again.`,
        "RATE_LIMITED",
        429
      );
    }

    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const result = await AuthService.signUp(parsed.data);
    return apiSuccess(
      {
        user: result.user,
        verificationToken: result.verificationToken,
        message: "Account created successfully.",
      },
      201
    );
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      return apiError(error.message, "CONFLICT", 409);
    }
    return apiError(
      error.message || "An unexpected error occurred during account creation.",
      "INTERNAL_ERROR",
      500
    );
  }
}
