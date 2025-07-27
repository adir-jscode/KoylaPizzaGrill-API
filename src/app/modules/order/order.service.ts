import { Order } from "./order.model";
import { IOrder } from "./order.interface";
import { stripe } from "../../config/stripe";

// Create order (status depends on payment_method)
export const createOrder = async (payload: IOrder) => {
  // Cash orders: instantly mark as 'confirmed' and paid
  let status = "pending";
  let payment_status: IOrder["payment_status"] = "pending";

  if (payload.payment_method === "cash") {
    status = "confirmed";
    payment_status = "paid";
  }

  const newOrder = await Order.create({
    ...payload,
    status,
    payment_status,
    statusHistory: [
      ...(payload.statusHistory || []),
      { name: status, updatedAt: new Date().toISOString() },
    ],
  });

  return newOrder;
};

// Only for 'card' orders, create payment intent and save its ID
export const createStripePaymentIntent = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.payment_method !== "card")
    throw new Error("Not a card payment order");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: "usd",
    metadata: { orderId: order.id, customer: order.customer_name },
    receipt_email: order.customer_email,
  });

  order.stripe_payment_intent_id = paymentIntent.id;
  await order.save();

  return paymentIntent.client_secret;
};

// Stripe Webhook: confirm payment and update order
export const handleStripeWebhook = async (event: any) => {
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const order = await Order.findOne({ stripe_payment_intent_id: intent.id });
    if (order) {
      order.payment_status = "paid";
      order.status = "confirmed";
      order.statusHistory.push({
        name: "confirmed",
        updatedAt: new Date().toISOString(),
      });
      order.payment_method = "card";
      await order.save();
    }
  }
};

export const getOrders = async () => Order.find();
export const getOrderById = async (id: string) => Order.findById(id);
export const updateOrder = async (id: string, data: Partial<IOrder>) =>
  Order.findByIdAndUpdate(id, data, { new: true });
export const deleteOrder = async (id: string) => Order.findByIdAndDelete(id);
