import { ActivityRepository } from "../data-access/activity.repository";
import { calculateFootprint } from "../calculations/calculator";
import { ActivityInput, ActivityFilterInput } from "../validations/activity";
import { UserRepository } from "../data-access/user.repository";
import { GamificationService } from "./gamification.service";

export class ActivityService {
  static async addActivity(userId: string, input: ActivityInput) {
    // Get user's region from profile
    const user = await UserRepository.findById(userId);
    const region = user?.profile?.region || "IN";

    // Perform calculation in service layer
    const calc = calculateFootprint({
      category: input.category,
      activityType: input.activityType,
      amount: input.amount,
      unit: input.unit,
      region,
    });

    const created = await ActivityRepository.create(userId, input, calc);

    // Update gamification progress asynchronously
    try {
      await GamificationService.onActivityLogged(userId, created);
    } catch (e) {
      console.error("Gamification update on activity logged failed", e);
    }

    return created;
  }

  static async updateActivity(
    id: string,
    userId: string,
    input: ActivityInput
  ) {
    const user = await UserRepository.findById(userId);
    const region = user?.profile?.region || "IN";

    const calc = calculateFootprint({
      category: input.category,
      activityType: input.activityType,
      amount: input.amount,
      unit: input.unit,
      region,
    });

    const updated = await ActivityRepository.update(id, userId, input, calc);
    if (!updated) {
      throw new Error("Activity not found or unauthorized.");
    }
    return updated;
  }

  static async deleteActivity(id: string, userId: string) {
    const success = await ActivityRepository.delete(id, userId);
    if (!success) {
      throw new Error("Activity not found or unauthorized.");
    }
    return { success: true };
  }

  static async listActivities(userId: string, filters: ActivityFilterInput) {
    const startDate = filters.startDate ? new Date(filters.startDate) : undefined;
    const endDate = filters.endDate ? new Date(filters.endDate) : undefined;

    return ActivityRepository.list(userId, {
      category: filters.category,
      startDate,
      endDate,
      page: filters.page,
      limit: filters.limit,
    });
  }

  /**
   * Generates a structured RFC-4180 compliant CSV of the user's recorded activities.
   * Includes metadata header, methodology source notes, and explicit column definitions.
   */
  static async generateCsvExport(userId: string): Promise<string> {
    const user = await UserRepository.findById(userId);
    const result = await ActivityRepository.list(userId, { limit: 5000 });
    const records = result.items;

    const metadataLines = [
      `# EcoPulse Personal Carbon Activity Export`,
      `# User: "${user?.name || "EcoPulse User"}" <${user?.email || ""}>`,
      `# Export Timestamp (ISO 8601): ${new Date().toISOString()}`,
      `# Calculation Standard: Greenhouse Gas Protocol (Corporate/Household Tier 1 & 2)`,
      `# Slogan: "Small Actions. Measurable Impact."`,
      `# Notice: All carbon figures are estimates based on published factors cited in each row.`,
      `#`,
    ];

    const headers = [
      "Activity ID",
      "Date",
      "Category",
      "Activity Type",
      "Entered Amount",
      "Unit",
      "Estimated kg CO2e",
      "Factor Value",
      "Emission Factor Source",
      "Factor Version",
      "Estimation Method",
      "Notes",
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = records.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.date.toISOString().split("T")[0]),
      escapeCsv(r.category),
      escapeCsv(r.activityType),
      r.amount.toString(),
      escapeCsv(r.unit),
      r.calculatedKgCO2e.toFixed(2),
      r.factorValue.toString(),
      escapeCsv(r.factorSource),
      escapeCsv(r.factorVersion),
      escapeCsv(r.estimationMethod),
      escapeCsv(r.note || ""),
    ]);

    const csvContent = [
      ...metadataLines,
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\r\n");

    return csvContent;
  }
}
