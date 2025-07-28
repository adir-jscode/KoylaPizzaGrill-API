"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentZodSchema = void 0;
const zod_1 = require("zod");
const paymentMethodEnum = zod_1.z.enum(["CARD", "CASH"]);
const paymentStatusEnum = zod_1.z.enum([
    "PAID",
    "UNPAID",
    "CANCELLED",
    "FAILED",
    "REFUNDED",
]);
exports.createPaymentZodSchema = zod_1.z.object({
    order: zod_1.z.string().min(1), // as ObjectId string
    transactionId: zod_1.z.string().min(1),
    amount: zod_1.z.number(),
    paymentGatewayData: zod_1.z.any().optional(),
    invoiceUrl: zod_1.z.string().url().optional(),
    status: paymentStatusEnum,
    paymentMethod: paymentMethodEnum,
});
