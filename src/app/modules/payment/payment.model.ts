import { Schema, model, Types, Document } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      unique: true,
    },
    transactionId: { type: String, required: true },
    paymentIntentId: { type: String },
    amount: { type: Number, required: true },
    paymentGatewayData: { type: Schema.Types.Mixed },
    invoiceUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      required: true,
      default: PAYMENT_STATUS.UNPAID,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Payment = model<IPayment>("Payment", PaymentSchema);
