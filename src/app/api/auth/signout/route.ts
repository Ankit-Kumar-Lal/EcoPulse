import { apiSuccess } from "@/lib/api/response";
import { AuthService } from "@/lib/services/auth.service";

export async function POST() {
  await AuthService.signOut();
  return apiSuccess({ message: "Signed out successfully." });
}
