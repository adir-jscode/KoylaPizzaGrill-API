import { z } from "zod";
export enum Type {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}
export const createCouponZodSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(Type),
  value: z.number().positive("Value must be greater than 0"),
  minOrder: z.number().min(0, "Minimum order must be 0 or greater").default(0),
  maxDiscount: z.number().nonnegative().optional(),
  validFrom: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  validTo: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  usageLimit: z.number().int().positive().optional().default(0),
  usedCount: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const updateCouponZodSchema = z.object({
  code: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.enum(Type).optional(),
  value: z.number().positive().optional(),
  minOrder: z.number().min(0).optional(),
  maxDiscount: z.number().nonnegative().optional(),
  validFrom: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
  validTo: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
  usageLimit: z.number().int().positive().optional(),
  usedCount: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});
