"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantSettingsZodSchema = void 0;
const zod_1 = require("zod");
exports.restaurantSettingsZodSchema = zod_1.z.object({
    isAcceptingPickup: zod_1.z.boolean(),
    isAcceptingDelivery: zod_1.z.boolean(),
    restaurantName: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    deliveryFee: zod_1.z.number().min(0),
    taxRate: zod_1.z.number().min(0),
    minDeliveryAmount: zod_1.z.number().min(0).optional(),
});
