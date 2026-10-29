import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { goalSchema } from "@/lib/validations/goal";
import { GoalRepository } from "@/lib/data-access/goal.repository";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const goals = await GoalRepository.listByUser(user.id);
    return apiSuccess(goals);
  } catch (error: any) {
    return apiError(error.message || "Failed to load goals.", "INTERNAL_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const body = await req.json();
    const parsed = goalSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message || "Validation error",
        "VALIDATION_ERROR",
        400
      );
    }

    const created = await GoalRepository.create(user.id, parsed.data);
    return apiSuccess(created, 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create goal.", "INTERNAL_ERROR", 500);
  }
}
