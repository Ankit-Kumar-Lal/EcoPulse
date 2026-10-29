import { z } from "zod";

export const activitySchema = z.object({
  category: z.enum(["HOME_ENERGY", "TRANSPORT", "FOOD", "WATER", "WASTE"], {
    errorMap: () => ({ message: "Please select a valid sustainability category." }),
  }),
  activityType: z.string().min(1, "Activity type is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a numeric value" })
    .positive("Amount must be greater than zero")
    .max(1000000, "Amount exceeds realistic limits for a single entry"),
  unit: z.string().min(1, "Unit of measurement is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "A valid date must be selected",
  }),
  note: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const activityFilterSchema = z.object({
  category: z.enum(["ALL", "HOME_ENERGY", "TRANSPORT", "FOOD", "WATER", "WASTE"]).default("ALL"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type ActivityInput = z.infer<typeof activitySchema>;
export type ActivityFilterInput = z.infer<typeof activityFilterSchema>;
