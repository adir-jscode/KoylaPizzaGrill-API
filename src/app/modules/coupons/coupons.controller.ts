import { NextFunction, Request, Response } from "express";
import { CouponServices } from "./coupons.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupon = await CouponServices.createCoupons(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "New Coupon Created",
      data: coupon,
    });
  } catch (err: any) {
    next(err);
  }
};

export const CouponControllers = {
  createCoupon,
};
