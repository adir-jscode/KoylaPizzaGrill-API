import { ICoupon } from "./coupons.interface";
import { Coupon } from "./coupons.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const createCoupons = async (payload: Partial<ICoupon>) => {
  const coupon = await Coupon.create(payload);
  return coupon;
};

const updateCouponStatus = async (id: string, payload: Partial<ICoupon>) => {
  const isCouponExist = await Coupon.findById(id);
  if (!isCouponExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  } else {
    const newUpdatedCoupon = await Coupon.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return newUpdatedCoupon;
  }
};

const updateCoupon = async (id: string, payload: Partial<ICoupon>) => {
  const isCouponExist = await Coupon.findById(id);
  if (!isCouponExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  } else {
    const newUpdatedCoupon = await Coupon.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    return newUpdatedCoupon;
  }
};

const deleteCoupon = async (id: string) => {
  const isCouponExist = await Coupon.findById(id);
  if (!isCouponExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  } else {
    await Coupon.findByIdAndDelete(id);
  }
};

export const CouponServices = {
  createCoupons,
  deleteCoupon,
  updateCouponStatus,
  updateCoupon,
};
