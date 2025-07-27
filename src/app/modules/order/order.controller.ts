import { Request, Response, NextFunction } from "express";
import * as OrderService from "./order.service";
import httpStatus from "http-status-codes";
// Stripe webhook handler
import { stripe } from "../../config/stripe";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await OrderService.createOrder(req.body);
    res.status(httpStatus.CREATED).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const createStripeIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const clientSecret = await OrderService.createStripePaymentIntent(id);
    res.status(200).json({ success: true, clientSecret });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await OrderService.getOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await OrderService.updateOrder(req.params.id, req.body);
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await OrderService.deleteOrder(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    await OrderService.handleStripeWebhook(event);
    res.json({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
