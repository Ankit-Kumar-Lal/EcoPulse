import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return apiError("Unauthenticated", "UNAUTHORIZED", 401);
  }
  return apiSuccess({ user });
}
