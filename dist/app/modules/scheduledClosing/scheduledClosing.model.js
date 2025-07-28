"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledClosing = void 0;
const mongoose_1 = require("mongoose");
const ScheduledClosingSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    reason: { type: String, required: true },
    allDay: { type: Boolean, default: true },
    fromTime: String,
    toTime: String,
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true, versionKey: false });
exports.ScheduledClosing = (0, mongoose_1.model)("ScheduledClosing", ScheduledClosingSchema);
