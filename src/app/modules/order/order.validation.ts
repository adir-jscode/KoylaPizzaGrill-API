import { z } from "zod";

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().min(1),
  price: z.number(),
  basePrice: z.number(),
  category: z.string(),
  imageUrl: z.string().url().optional(),
  primaryOption: z.object({ name: z.string(), price: z.number() }),
  secondaryOptions: z
    .array(z.object({ name: z.string(), price: z.number().optional() }))
    .optional(),
  addons: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number().optional(),
      })
    )
    .optional(),
  specialInstruction: z.string().optional(),
});

const statusHistorySchema = z.object({
  name: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out for delivery",
    "completed",
    "cancelled",
  ]),
  updatedAt: z.string(),
});

export const createOrderZodSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().min(1),
  orderItems: z.array(orderItemSchema).min(1),
  orderType: z.enum(["pickup", "delivery"]),
  deliveryAddress: z.string().optional(),
  subTotal: z.number(),
  deliveryFee: z.number().optional(),
  tax: z.number(),
  tip: z.number().optional(),
  discount: z.number().optional(),
  total: z.number(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out for delivery",
      "completed",
      "cancelled",
    ])
    .optional()
    .default("pending"),
  statusHistory: z.array(statusHistorySchema).default([]),
  couponUsed: z.string().optional(),
  kitchenNote: z.string().optional(),
  payment_method: z.enum(["card", "cash"]),
});
