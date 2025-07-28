import { Request, Response, NextFunction } from "express";
import { createOrder } from "./order.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod is required in the payload (CARD or CASH)",
      });
    }

    const result = await createOrder(payload); // your service function

    // Return order, payment, and Stripe client secret if exists
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order created successfully",
      data: {
        order: result.order,
        payment: result.payment,
        clientSecret: result.clientSecret, // will be undefined for cash payments
      },
    });
  } catch (error) {
    next(error);
  }
};
