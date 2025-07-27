import { Schema, model, Document } from "mongoose";
import { IOrder, IOrderItem, IStatusHistory } from "./order.interface";

const OrderItemSchema = new Schema<IOrderItem>(
  {
    id: String,
    name: String,
    quantity: Number,
    price: Number,
    basePrice: Number,
    category: String,
    imageUrl: String,
    primaryOption: { name: String, price: Number },
    secondaryOptions: [{ name: String, price: Number }],
    addons: [{ id: String, name: String, price: Number }],
    specialInstruction: String,
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    name: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out for delivery",
        "completed",
        "cancelled",
      ],
    },
    updatedAt: String,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customer_name: { type: String, required: true },
    customer_email: { type: String },
    customer_phone: { type: String, required: true },
    orderItems: [OrderItemSchema],
    orderType: { type: String, enum: ["pickup", "delivery"], required: true },
    deliveryAddress: String,
    subTotal: Number,
    deliveryFee: Number,
    tax: Number,
    tip: Number,
    discount: Number,
    total: Number,
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out for delivery",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    statusHistory: [StatusHistorySchema],
    couponUsed: String,
    kitchenNote: String,
    payment_method: { type: String, enum: ["card", "cash"], required: true },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripe_payment_intent_id: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

export const Order = model<IOrder>("Order", OrderSchema);
