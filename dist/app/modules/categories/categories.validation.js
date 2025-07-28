"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryZodSchema = exports.createCategoryZodSchema = void 0;
const zod_1 = require("zod");
const categories_interface_1 = require("./categories.interface");
exports.createCategoryZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    display: zod_1.z.boolean().optional().default(true),
    available: zod_1.z.array(zod_1.z.enum([categories_interface_1.Available.PICKUP, categories_interface_1.Available.DELIVERY])),
    availableDays: zod_1.z.array(zod_1.z.number().int().min(0).max(6)), // 0 = Sunday, 6 = Saturday
    availableTime: zod_1.z.object({
        from: zod_1.z.string().min(1, "From time is required"),
        to: zod_1.z.string().min(1, "To time is required"),
    }),
    displayOrder: zod_1.z.number().int().optional().default(0),
    isVisible: zod_1.z.boolean().optional().default(true),
});
exports.updateCategoryZodSchema = exports.createCategoryZodSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});
