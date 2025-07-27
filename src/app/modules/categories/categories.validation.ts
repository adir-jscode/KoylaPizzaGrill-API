import { z } from "zod";
import { Available } from "./categories.interface";

export const createCategoryZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  display: z.boolean().optional().default(true),
  available: z.array(z.enum([Available.PICKUP, Available.DELIVERY])),
  availableDays: z.array(z.number().int().min(0).max(6)), // 0 = Sunday, 6 = Saturday
  availableTime: z.object({
    from: z.string().min(1, "From time is required"),
    to: z.string().min(1, "To time is required"),
  }),
  displayOrder: z.number().int().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export const updateCategoryZodSchema = createCategoryZodSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
