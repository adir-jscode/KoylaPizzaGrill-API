import { model, Schema } from "mongoose";
import { ICoupon, Type } from "./coupons.interface";

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(Type),
      default: Type.PERCENTAGE,
      required: true,
    },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: Number,
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);
