"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginZodSchema = exports.resetPasswordZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.resetPasswordZodSchema = zod_1.default.object({
    newPassword: zod_1.default.string({ message: "New password is required" }),
    oldPassword: zod_1.default.string({ message: "Old password is required" }),
});
exports.loginZodSchema = zod_1.default.object({
    username: zod_1.default.string({ message: "Username is required" }),
    password: zod_1.default.string({ message: "Password is required" }),
});
