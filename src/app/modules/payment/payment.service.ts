import { stripe } from "../../config/stripe";

export const paymentIntent = async (
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
