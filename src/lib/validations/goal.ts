import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  category: z.string().optional().nullable(),
  targetReductionPercent: z.number().min(1).max(100).optional().nullable(),
  targetKgCO2e: z.number().positive("Target emissions must be greater than zero"),
  timeHorizon: z.enum(["monthly", "quarterly", "annual"]),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val))),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val))),
});

export type GoalInput = z.infer<typeof goalSchema>;
