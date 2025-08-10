import { Schema, model, Types, Document } from "mongoose";
import {
  IOrder,
  IOrderItem,
  IStatusHistory,
  OrderType,
} from "./order.interface";

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: { type: String, required: true },
    basePrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    primaryOption: {
      name: { type: String },
      price: { type: Number },
    },
    secondaryOptions: [
      {
        name: String,
        price: Number,
      },
    ],
    addons: [
      {
        id: String,
        name: String,
        price: Number,
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "OUT FOR DELIVERY",
        "COMPLETED",
        "CANCELLED",
      ],
      required: true,
    },
    updatedAt: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder & Document>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String, required: true },
    orderType: {
      type: String,
      enum: Object.values(OrderType),
      required: true,
    },
    isScheduled: { type: Boolean, required: true },
    scheduledTime: { type: Date },
    deliveryAddress: { type: String },
    orderItems: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number },
    tax: { type: Number, required: true },
    tip: { type: Number },
    discount: { type: Number },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "OUT FOR DELIVERY",
        "COMPLETED",
        "CANCELLED",
      ],
      required: true,
      default: "PENDING",
    },
    statusHistory: { type: [StatusHistorySchema], default: [] },
    specialInstructions: { type: String },
    couponCode: { type: String },
    paymentIntentId: { type: String },
    payment: { type: Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true, versionKey: false }
);

export const Order = model<IOrder>("Order", OrderSchema);
