"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderZodSchema = exports.createOrderZodSchema = void 0;
const zod_1 = require("zod");
const orderStatusEnum = zod_1.z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT FOR DELIVERY",
    "COMPLETED",
    "CANCELLED",
]);
const orderTypeEnum = zod_1.z.enum(["PICKUP", "DELIVERY"]);
const paymentMethodEnum = zod_1.z.enum(["CARD", "CASH"]);
const orderItemSchema = zod_1.z.object({
    menuItemId: zod_1.z.string().min(1),
    name: zod_1.z.string().optional(), // will be filled by server
    basePrice: zod_1.z.number().optional(),
    quantity: zod_1.z.number().int().min(1),
    primaryOption: zod_1.z.object({
        name: zod_1.z.string(),
        price: zod_1.z.number().optional(), // server fills price
    }),
    secondaryOptions: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string(),
        price: zod_1.z.number().optional(),
    }))
        .optional(),
    addons: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string().optional(),
        name: zod_1.z.string(),
        price: zod_1.z.number().optional(),
    }))
        .optional(),
    totalPrice: zod_1.z.number().optional(), // calculated server-side
});
const statusHistorySchema = zod_1.z.object({
    status: orderStatusEnum,
    updatedAt: zod_1.z.string().min(1), // You may refine to datetime string if you want
});
exports.createOrderZodSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(1),
    customerEmail: zod_1.z.string().email().optional(),
    customerPhone: zod_1.z.string().min(1),
    orderType: orderTypeEnum,
    isScheduled: zod_1.z.boolean(),
    deliveryAddress: zod_1.z.string().optional(),
    deliveryCharge: zod_1.z.number().optional(),
    orderItems: zod_1.z.array(orderItemSchema).min(1),
    tip: zod_1.z.number().nonnegative().optional(),
    discount: zod_1.z.number().nonnegative().optional(),
    paymentMethod: paymentMethodEnum,
    couponCode: zod_1.z.string().optional(),
    paymentIntentId: zod_1.z.string().optional(),
    otp: zod_1.z.string().optional(),
});
// For update, all fields are optional but at least one must exist
exports.updateOrderZodSchema = exports.createOrderZodSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});
