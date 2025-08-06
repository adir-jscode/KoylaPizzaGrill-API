"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const OrderItemSchema = new mongoose_1.Schema({
    menuItemId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
    },
    name: { type: String, required: true },
    basePrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    primaryOption: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
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
}, { _id: false });
const StatusHistorySchema = new mongoose_1.Schema({
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
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String, required: true },
    orderType: {
        type: String,
        enum: Object.values(order_interface_1.OrderType),
        required: true,
    },
    isScheduled: { type: Boolean, required: true },
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
    payment: { type: mongoose_1.Types.ObjectId, ref: "Payment" },
}, { timestamps: true, versionKey: false });
exports.Order = (0, mongoose_1.model)("Order", OrderSchema);
