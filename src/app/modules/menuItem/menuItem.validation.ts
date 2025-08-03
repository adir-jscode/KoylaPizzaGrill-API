import { z } from "zod";

const addonSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
});

const optionSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative().optional().default(0),
});

const primaryOptionSchema = z.object({
  name: z.string().min(1),
  options: z.array(optionSchema).min(1),
});

const secondaryOptionSchema = z.object({
  name: z.string().min(1),
  minSelect: z.number().int().min(0),
  maxSelect: z.number().int().min(1),
  options: z.array(optionSchema).min(1),
});

export const createMenuItemZodSchema = z.object({
  categoryId: z.string().min(1), // MongoDB ObjectId string validation optional (can add regex)
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().positive(),
  primaryOption: primaryOptionSchema.optional(),
  secondaryOptions: z.array(secondaryOptionSchema).optional(),
  addons: z.array(addonSchema).optional(),
  tags: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
});

export const updateMenuItemZodSchema = createMenuItemZodSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
