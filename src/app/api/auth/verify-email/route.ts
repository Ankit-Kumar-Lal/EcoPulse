import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { AuthService } from "@/lib/services/auth.service";
import { checkRateLimit } from "@/lib/auth/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`verify_email_${ip}`, 10, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return apiError("Too many verification requests. Please wait.", "RATE_LIMITED", 429);
    }

    const body = await req.json();
    const token = body?.token;

    if (!token || typeof token !== "string") {
      return apiError("Verification token is required.", "VALIDATION_ERROR", 400);
    }

    await AuthService.verifyEmail(token);
    return apiSuccess({ message: "Email verified successfully." });
  } catch (error: any) {
    return apiError(error.message || "Failed to verify email.", "BAD_REQUEST", 400);
  }
}
