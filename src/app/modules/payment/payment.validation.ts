import { z } from "zod";

const paymentMethodEnum = z.enum(["CARD", "CASH"]);
const paymentStatusEnum = z.enum([
  "PAID",
  "UNPAID",
  "CANCELLED",
  "FAILED",
  "REFUNDED",
]);

export const createPaymentZodSchema = z.object({
  order: z.string().min(1), // as ObjectId string
  transactionId: z.string().min(1),
  paymentIntentId: z.string().min(1).optional(),
  amount: z.number(),
  paymentGatewayData: z.any().optional(),
  invoiceUrl: z.string().url().optional(),
  status: paymentStatusEnum,
  paymentMethod: paymentMethodEnum,
});

export const changePaymentStatusZodSchema = z.object({
  status: paymentStatusEnum,
});
