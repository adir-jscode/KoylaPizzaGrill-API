import { Request, Response, NextFunction } from "express";
import {
  createOrder,
  orderHistoryById,
  updatePaymentOrderStatus,
  getAllOrder,
  changeOrderStatus,
  filteredOrders,
} from "./order.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import Stripe from "stripe";
import { Order } from "./order.model";
import { stripe } from "../../config/stripe";

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload.paymentMethod) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Payment method is required (CARD or CASH)"
      );
    }

    const result = await createOrder(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order created successfully",
      data: {
        order: result.order,
        payment: result.payment,
        clientSecret: result.clientSecret,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await getAllOrder(req.query as Record<string, string>);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All data retrived successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
export const getFilteredOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await filteredOrders(req.query as Record<string, string>);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All data retrived successfully",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const changePaymentOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentInfo = await updatePaymentOrderStatus(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Status changed successfully",
      data: paymentInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const payment = await Payment.findOne({ transactionId: paymentIntent.id });
    if (payment) {
      payment.status = PAYMENT_STATUS.PAID;
      await payment.save();
      // Also update order status to CONFIRMED, push to statusHistory
      const order = await Order.findById(payment.order);
      if (order) {
        order.status = "CONFIRMED";
        order.statusHistory.push({
          status: "CONFIRMED",
          updatedAt: new Date().toISOString(),
        });
        await order.save();
      }
    }
  }
  res.status(200).json({ received: true });
};

export const getOrderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.id;
    const data = await orderHistoryById(orderId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "order history retrived successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const order = await changeOrderStatus(id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "order status changed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
