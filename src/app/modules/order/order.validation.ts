import { z } from "zod";

const orderTypeEnum = z.enum(["PICKUP", "DELIVERY"]);
const orderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT FOR DELIVERY",
  "COMPLETED",
  "CANCELLED",
]);

const orderItemZod = z.object({
  menuItemId: z.string().min(1),
  name: z.string().min(1),
  basePrice: z.number(),
  quantity: z.number().int().min(1),
  primaryOption: z.object({
    name: z.string().min(1),
    price: z.number(),
  }),
  secondaryOptions: z
    .array(
      z.object({
        name: z.string(),
        price: z.number().optional(),
      })
    )
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
  totalPrice: z.number(),
});

const statusHistoryZod = z.object({
  status: orderStatusEnum,
  updatedAt: z.string(), // Could use z.date().transform((d)=>d.toISOString()) if Date
});

export const createOrderZodSchema = z.object({
  orderNumber: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(1),
  orderType: orderTypeEnum,
  isScheduled: z.boolean(),
  deliveryAddress: z.string().optional(),
  orderItems: z.array(orderItemZod).min(1),
  subtotal: z.number(),
  deliveryFee: z.number().optional(),
  tax: z.number(),
  tip: z.number().optional(),
  discount: z.number().optional(),
  total: z.number(),
  status: orderStatusEnum,
  statusHistory: z.array(statusHistoryZod),
  specialInstructions: z.string().optional(),
  couponCode: z.string().optional(),
  payment: z.string().optional(), // as ObjectId string
});
