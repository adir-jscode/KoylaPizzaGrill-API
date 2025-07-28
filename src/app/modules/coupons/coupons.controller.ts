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
const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupons = await CouponServices.getAllCoupons();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Coupons Retrived Successfully",
      data: coupons,
    });
  } catch (err: any) {
    next(err);
  }
};

const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const coupon = await CouponServices.deleteCoupon(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Deleted Successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const UpdateCouponStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    console.log("body", req.body);
    const coupon = await CouponServices.updateCouponStatus(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Status Updated",
      data: coupon,
    });
  } catch (err: any) {
    next(err);
  }
};
const UpdateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const coupon = await CouponServices.updateCoupon(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coupone Updated",
      data: coupon,
    });
  } catch (err: any) {
    next(err);
  }
};
export const CouponControllers = {
  createCoupon,
  deleteCoupon,
  UpdateCouponStatus,
  UpdateCoupon,
  getAllCoupons,
};
