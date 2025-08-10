"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponZodSchema = exports.createCouponZodSchema = exports.Type = void 0;
const zod_1 = require("zod");
var Type;
(function (Type) {
    Type["PERCENTAGE"] = "PERCENTAGE";
    Type["FIXED"] = "FIXED";
})(Type || (exports.Type = Type = {}));
exports.createCouponZodSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, "Coupon code is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    type: zod_1.z.enum(Type),
    value: zod_1.z.number().positive("Value must be greater than 0"),
    minOrder: zod_1.z.number().min(0, "Minimum order must be 0 or greater").default(0),
    maxDiscount: zod_1.z.number().nonnegative().optional(),
    validFrom: zod_1.z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), zod_1.z.date()),
    validTo: zod_1.z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), zod_1.z.date()),
    usageLimit: zod_1.z.number().int().positive().optional().default(0),
    usedCount: zod_1.z.number().int().min(0).default(0),
    active: zod_1.z.boolean().default(true),
});
exports.updateCouponZodSchema = zod_1.z.object({
    code: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    type: zod_1.z.enum(Type).optional(),
    value: zod_1.z.number().positive().optional(),
    minOrder: zod_1.z.number().min(0).optional(),
    maxDiscount: zod_1.z.number().nonnegative().optional(),
    validFrom: zod_1.z
        .preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), zod_1.z.date())
        .optional(),
    validTo: zod_1.z
        .preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), zod_1.z.date())
        .optional(),
    usageLimit: zod_1.z.number().int().positive().optional(),
    usedCount: zod_1.z.number().int().min(0).optional(),
    active: zod_1.z.boolean().optional(),
});
