import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import Stripe from "stripe";
import { stripe } from "../../config/stripe";
import { OrderServices } from "./order.service";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendMail";
import { success } from "zod";
import { Order } from "./order.model";

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

//stripe webhook
const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sig = (req.headers["stripe-signature"] as string) || "";
  const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send("Missing stripe-signature or webhook secret");
  }
  if (!Buffer.isBuffer(req.body)) {
    return res
      .status(400)
      .send("Body is not raw Buffer. Check express.raw placement.");
  }

  let event: Stripe.Event;
  try {
    // req.body is a Buffer because of express.raw
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    let orderNumber = "";
    if (event.type === "payment_intent.succeeded") {
      const stripeObject = event.data.object;
      const { metadata } = stripeObject;
      orderNumber = metadata?.orderNumber;
      if (orderNumber) {
        await OrderServices.updatePaymentOrderStatus(orderNumber);

        const orderDetails = await OrderServices.trackByOrderNumber(
          orderNumber
        );

        const TrackOrder = `${envVars.URL}/track-order?orderNumber=${orderNumber}`;
        await sendEmail({
          to: orderDetails.customerEmail as string,
          subject: `Order Confirmation - Koyla Pizza Grill #${orderNumber}`,
          templateName: "order",
          templateData: {
            customerName: orderDetails.customerName,
            orderNumber,
            orderDateTime: new Date().toLocaleString("en-US"),
            orderItems: orderDetails.orderItems,
            subtotal: Number(orderDetails.subtotal),
            deliveryFee: Number(orderDetails.deliveryCharge),
            tip: Number(orderDetails.tip),
            discount: Number(orderDetails.discount),
            tax: Number(orderDetails.tax),
            total: Number(orderDetails.total.toFixed(2)),
            orderType: orderDetails.orderType,
            deliveryAddress: orderDetails.deliveryAddress ?? "",
            specialInstructions: orderDetails.specialInstructions ?? "",
            status: "CONFIRMED",
            TrackOrder,
          },
        });
      }

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment succeeded",
        data: null,
      });
    } else if (event.type === "payment_intent.payment_failed") {
      const stripeObject = event.data.object;
      const { metadata } = stripeObject;
      orderNumber = metadata?.orderNumber;
      await OrderServices.deleteOrderByOrderNumber(orderNumber);
      sendResponse(res, {
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Payment failed",
        data: null,
      });
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Webhook handler error",
      data: null,
    });
  }
};

//delete order by orderNumber
const deleteOrderByOrderNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderNumber } = req.params;
    const response = await OrderServices.deleteOrderByOrderNumber(orderNumber);
    console.log(response);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Order deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
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
      req.params.orderNumber
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
  stripeWebhook,
  deleteOrderByOrderNumber,
};
