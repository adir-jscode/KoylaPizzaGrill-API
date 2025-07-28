"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminZodSchema = exports.createAdminZodSchema = void 0;
const zod_1 = require("zod");
exports.createAdminZodSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username is required and must be at least 3 characters"),
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("A valid email is required"),
    password: zod_1.z
        .string()
        .min(6, "Password is required and must be at least 6 characters"),
    isActive: zod_1.z.boolean().optional(),
    last_login: zod_1.z.date().optional(),
});
exports.updateAdminZodSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).optional(),
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    isActive: zod_1.z.boolean().optional(),
    last_login: zod_1.z.date().optional(),
});
