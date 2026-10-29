import { apiError } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { ActivityService } from "@/lib/services/activity.service";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return apiError("Authentication required.", "UNAUTHORIZED", 401);
    }

    const csvContent = await ActivityService.generateCsvExport(user.id);
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `ecopulse-activities-${dateStr}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to export data.", "INTERNAL_ERROR", 500);
  }
}
