"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const coupons_interface_1 = require("./coupons.interface");
const couponSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: Object.values(coupons_interface_1.Type),
        default: coupons_interface_1.Type.PERCENTAGE,
        required: true,
    },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Coupon = (0, mongoose_1.model)("Coupon", couponSchema);
