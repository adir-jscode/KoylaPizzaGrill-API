"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantHourZodSchema = void 0;
const zod_1 = require("zod");
const hourRangeSchema = zod_1.z.object({
    from: zod_1.z.string(),
    to: zod_1.z.string(),
});
exports.restaurantHourZodSchema = zod_1.z.object({
    day: zod_1.z.number().int().min(0).max(6),
    pickupHours: zod_1.z.array(hourRangeSchema),
    deliveryHours: zod_1.z.array(hourRangeSchema),
    isActive: zod_1.z.boolean().optional().default(true),
});
