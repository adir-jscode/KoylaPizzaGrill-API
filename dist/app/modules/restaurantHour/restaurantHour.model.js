"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantHour = void 0;
const mongoose_1 = require("mongoose");
const HourRangeSchema = new mongoose_1.Schema({
    from: String,
    to: String,
}, { _id: false });
const RestaurantHourSchema = new mongoose_1.Schema({
    day: { type: Number, min: 0, max: 6, required: true, unique: true },
    pickupHours: { type: [HourRangeSchema], default: [] },
    deliveryHours: { type: [HourRangeSchema], default: [] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });
exports.RestaurantHour = (0, mongoose_1.model)("RestaurantHour", RestaurantHourSchema);
