import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { activitySchema, activityFilterSchema } from "@/lib/validations/activity";
import { ActivityService } from "@/lib/services/activity.service";

export async function GET(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return apiError("Authentication required.", "UNAUTHORIZED", 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const filterInput = {
      category: searchParams.get("category") || "ALL",
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20,
    };

    const parsed = activityFilterSchema.safeParse(filterInput);
    if (!parsed.success) {
      return apiError("Invalid filter parameters", "VALIDATION_ERROR", 400);
    }

    const result = await ActivityService.listActivities(user.id, parsed.data);
    return apiSuccess(result);
  } catch (error: any) {
    return apiError(error.message || "Failed to retrieve activities.", "INTERNAL_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return apiError("Authentication required.", "UNAUTHORIZED", 401);
    }

    const body = await req.json();
    const parsed = activitySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const activity = await ActivityService.addActivity(user.id, parsed.data);
    return apiSuccess(activity, 201);
  } catch (error: any) {
    return apiError(
      error.message || "Failed to record activity.",
      error.code || "INTERNAL_ERROR",
      400
    );
  }
}
