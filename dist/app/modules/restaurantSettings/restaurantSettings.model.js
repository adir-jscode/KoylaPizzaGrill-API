"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantSettings = void 0;
const mongoose_1 = require("mongoose");
const RestaurantSettingsSchema = new mongoose_1.Schema({
    isAcceptingPickup: { type: Boolean, default: true },
    isAcceptingDelivery: { type: Boolean, default: true },
    restaurantName: String,
    phone: String,
    address: String,
    deliveryFee: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.0875 },
    minDeliveryAmount: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false });
exports.RestaurantSettings = (0, mongoose_1.model)("RestaurantSettings", RestaurantSettingsSchema);
