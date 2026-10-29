import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { DashboardService } from "@/lib/services/dashboard.service";

export async function GET(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return apiError("Authentication required.", "UNAUTHORIZED", 401);
    }

    const periodParam = req.nextUrl.searchParams.get("period");
    const period =
      periodParam === "week" || periodParam === "year" ? periodParam : "month";

    const metrics = await DashboardService.getMetrics(user.id, period);
    return apiSuccess(metrics);
  } catch (error: any) {
    return apiError(
      error.message || "Failed to load dashboard metrics.",
      "INTERNAL_ERROR",
      500
    );
  }
}
