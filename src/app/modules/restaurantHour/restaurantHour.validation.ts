import { z } from "zod";

const hourRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
});
export const restaurantHourZodSchema = z.object({
  day: z.number().int().min(0).max(6),
  pickupHours: z.array(hourRangeSchema),
  deliveryHours: z.array(hourRangeSchema),
  isActive: z.boolean().optional().default(true),
});
