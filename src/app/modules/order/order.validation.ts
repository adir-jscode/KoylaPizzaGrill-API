import { z } from "zod";

const orderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT FOR DELIVERY",
  "COMPLETED",
  "CANCELLED",
]);

const orderTypeEnum = z.enum(["PICKUP", "DELIVERY"]);

const paymentMethodEnum = z.enum(["CARD", "CASH"]);

const orderItemSchema = z.object({
  menuItemId: z.string().min(1),
  name: z.string().optional(), // will be filled by server
  basePrice: z.number().optional(),
  quantity: z.number().int().min(1),
  primaryOption: z
    .object({
      name: z.string(),
      price: z.number().optional(), // server fills price
    })
    .optional(),
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
        id: z.string().optional(),
        name: z.string(),
        price: z.number().optional(),
      })
    )
    .optional(),
  totalPrice: z.number().optional(), // calculated server-side
});

const statusHistorySchema = z.object({
  status: orderStatusEnum,
  updatedAt: z.string().min(1), // You may refine to datetime string if you want
});

export const createOrderZodSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(1),
  orderType: orderTypeEnum,
  isScheduled: z.boolean(),
  scheduledTime: z.string().optional(), // expected date
  deliveryAddress: z.string().optional(),
  deliveryCharge: z.number().optional(),
  orderItems: z.array(orderItemSchema).min(1),
  tip: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  paymentMethod: paymentMethodEnum,
  couponCode: z.string().optional(),
  paymentIntentId: z.string().optional(),
  otp: z.string().optional(),
});

// For update, all fields are optional but at least one must exist
export const updateOrderZodSchema = createOrderZodSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
