import { apiError } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { UserRepository } from "@/lib/data-access/user.repository";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return apiError("Authentication required.", "UNAUTHORIZED", 401);

    const exportData = await UserRepository.exportUserData(user.id);
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `ecopulse-account-export-${dateStr}.json`;

    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to export profile data.", "INTERNAL_ERROR", 500);
  }
}
