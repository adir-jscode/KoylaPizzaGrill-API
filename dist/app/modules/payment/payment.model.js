"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const PaymentSchema = new mongoose_1.Schema({
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
        unique: true,
    },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentGatewayData: { type: mongoose_1.Schema.Types.Mixed },
    invoiceUrl: { type: String },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PAYMENT_STATUS),
        required: true,
        default: payment_interface_1.PAYMENT_STATUS.UNPAID,
    },
}, { timestamps: true, versionKey: false });
exports.Payment = (0, mongoose_1.model)("Payment", PaymentSchema);
