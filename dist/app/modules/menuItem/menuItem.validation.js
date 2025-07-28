"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuItemZodSchema = exports.createMenuItemZodSchema = void 0;
const zod_1 = require("zod");
const addonSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    price: zod_1.z.number().nonnegative(),
});
const optionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    price: zod_1.z.number().nonnegative().optional().default(0),
});
const primaryOptionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    options: zod_1.z.array(optionSchema).min(1),
});
const secondaryOptionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    minSelect: zod_1.z.number().int().min(0),
    maxSelect: zod_1.z.number().int().min(1),
    options: zod_1.z.array(optionSchema).min(1),
});
exports.createMenuItemZodSchema = zod_1.z.object({
    categoryId: zod_1.z.string().min(1), // MongoDB ObjectId string validation optional (can add regex)
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    price: zod_1.z.number().positive(),
    primaryOption: primaryOptionSchema,
    secondaryOptions: zod_1.z.array(secondaryOptionSchema).optional(),
    addons: zod_1.z.array(addonSchema).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    isAvailable: zod_1.z.boolean().optional().default(true),
    displayOrder: zod_1.z.number().int().optional().default(0),
});
exports.updateMenuItemZodSchema = exports.createMenuItemZodSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});
