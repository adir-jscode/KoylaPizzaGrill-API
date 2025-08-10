import { Request, Response, NextFunction } from "express";

import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import Stripe from "stripe";
import { Order } from "./order.model";
import { stripe } from "../../config/stripe";
import { OrderServices } from "./order.service";

// POST /orders/payment-intent
const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderinfo = await OrderServices.calulateOrderAmount(req.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(Math.round(Number(orderinfo.total) * 100).toFixed(2)),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { tempId: Date.now().toString() },
      receipt_email: orderinfo.customerEmail,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment intent id retrived",
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;

    if (!payload.paymentMethod) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Payment method is required (CARD or CASH)"
      );
    }

    const result = await OrderServices.createOrder(payload);
    console.log("from controller", result);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await OrderServices.getAllOrder(
      req.query as Record<string, string>
    );
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
const getFilteredOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await OrderServices.filteredOrders(
      req.query as Record<string, string>
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data filtered successfully",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};
const changePaymentOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentInfo = await OrderServices.updatePaymentOrderStatus(
      req.params.id
    );
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

const getOrderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderNumber = req.params.orderNumber;
    const data = await OrderServices.orderHistoryByOrderNumber(orderNumber);
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

const toggleOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const order = await OrderServices.changeOrderStatus(id, req.body);
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

const trackByOrderNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderNumber } = req.body;
    const orderInfo = await OrderServices.trackByOrderNumber(orderNumber);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Data retrived successfully",
      data: orderInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const OrderControllers = {
  createPaymentIntent,
  createOrder,
  getAllOrders,
  getFilteredOrders,
  changePaymentOrderStatus,
  getOrderHistory,
  toggleOrderStatus,
  trackByOrderNumber,
};
