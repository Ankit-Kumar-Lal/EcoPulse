import { z } from "zod";

export const onboardingSchema = z.object({
  region: z.string().min(2, "Region is required"),
  units: z.enum(["metric", "imperial"]).default("metric"),
  householdSize: z.number().int().min(1).max(20).default(1),
  focusAreas: z.array(z.string()).min(1, "Please select at least one focus area"),
  initialGoal: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  region: z.string().min(2, "Region code is required"),
  units: z.enum(["metric", "imperial"]),
  householdSize: z.number().int().min(1).max(20),
  bio: z.string().max(280, "Bio cannot exceed 280 characters").optional(),
  leaderboardOptIn: z.boolean().default(false),
});

export const notificationPreferenceSchema = z.object({
  emailWeeklyDigest: z.boolean(),
  emailMonthlyReport: z.boolean(),
  challengeReminders: z.boolean(),
  productUpdates: z.boolean(),
  inAppAlerts: z.boolean(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type NotificationPreferenceInput = z.infer<typeof notificationPreferenceSchema>;
