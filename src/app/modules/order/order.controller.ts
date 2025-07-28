import { Request, Response, NextFunction } from "express";
import { createOrder, updatePaymentOrderStatus } from "./order.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";

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
      },
    });
  } catch (error) {
    next(error);
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
  } catch (error) {}
};
