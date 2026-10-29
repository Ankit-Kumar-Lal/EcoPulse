import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { signInSchema } from "@/lib/validations/auth";
import { AuthService } from "@/lib/services/auth.service";
import { checkRateLimit } from "@/lib/auth/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const body = await req.json();

    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const rateCheck = checkRateLimit(
      `signin_${parsed.data.email}_${ip}`,
      10,
      15 * 60 * 1000
    );
    if (!rateCheck.success) {
      return apiError(
        `Too many failed attempts. Please try again in ${rateCheck.resetSeconds} seconds.`,
        "RATE_LIMITED",
        429
      );
    }

    const user = await AuthService.signIn(parsed.data);
    return apiSuccess({
      user,
      message: "Signed in successfully.",
    });
  } catch (error: any) {
    return apiError(
      error.message || "Invalid credentials provided.",
      "UNAUTHORIZED",
      401
    );
  }
}
