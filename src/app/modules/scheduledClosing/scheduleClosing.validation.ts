import { z } from "zod";

export const createScheduledClosingZodSchema = z.object({
  date: z.string().min(1), // ideally validate date format
  reason: z.string().min(1),
  allDay: z.boolean().optional().default(true),
  fromTime: z.string().optional(),
  toTime: z.string().optional(),
});
export const updateScheduledClosingZodSchema =
  createScheduledClosingZodSchema.partial();
