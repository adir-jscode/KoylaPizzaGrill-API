import { z } from "zod";

export const createScheduledClosingZodSchema = z.object({
  date: z.string().min(1, "Date is required"),
  reason: z.string().min(1, "Reason is required"),
  allDay: z.boolean().optional().default(true),
  fromTime: z.string().optional(),
  toTime: z.string().optional(),
  createdAt: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date().optional()
  ),
});

export const updateScheduledClosingZodSchema = createScheduledClosingZodSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
