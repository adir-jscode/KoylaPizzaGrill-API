"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScheduledClosingZodSchema = exports.createScheduledClosingZodSchema = void 0;
const zod_1 = require("zod");
exports.createScheduledClosingZodSchema = zod_1.z.object({
    date: zod_1.z.string().min(1), // ideally validate date format
    reason: zod_1.z.string().min(1),
    allDay: zod_1.z.boolean().optional().default(true),
    fromTime: zod_1.z.string().optional(),
    toTime: zod_1.z.string().optional(),
});
exports.updateScheduledClosingZodSchema = exports.createScheduledClosingZodSchema.partial();
