import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { AuthService } from "@/lib/services/auth.service";
import { checkRateLimit } from "@/lib/auth/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const body = await req.json();

    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400
      );
    }

    const rateCheck = checkRateLimit(`pwd_reset_${ip}`, 5, 60 * 60 * 1000);
    if (!rateCheck.success) {
      return apiError(
        "Too many password reset requests. Please wait before trying again.",
        "RATE_LIMITED",
        429
      );
    }

    const result = await AuthService.requestPasswordReset(parsed.data.email);
    return apiSuccess(result);
  } catch (error: any) {
    return apiError(
      error.message || "Failed to process password reset.",
      "INTERNAL_ERROR",
      500
    );
  }
}
