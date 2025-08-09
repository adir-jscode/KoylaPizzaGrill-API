import { NextFunction, Response, Request } from "express";
import { PaymentServices } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const togglePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await PaymentServices.togglePaymentStatus(
      req.params.id,
      req.body.status
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Status changed successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const PaymentControllers = { togglePaymentStatus };
