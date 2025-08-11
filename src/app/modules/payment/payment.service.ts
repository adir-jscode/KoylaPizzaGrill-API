import { stripe } from "../../config/stripe";
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const paymentIntent = async (
  amount: number,
  transactionId: string,
  customerEmail: string
) => {
  await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // in cents
    currency: "usd", // change if needed
    metadata: { transactionId },
    receipt_email: customerEmail || undefined,
  });
};

const togglePaymentStatus = async (
  paymentId: string,
  status: PAYMENT_STATUS
) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment not found");
  }
  payment.status = status;
  payment.save();
  return payment;
};

export const PaymentServices = { paymentIntent, togglePaymentStatus };
