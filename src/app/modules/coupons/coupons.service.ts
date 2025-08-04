import { ICoupon } from "./coupons.interface";
import { Coupon } from "./coupons.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const createCoupons = async (payload: Partial<ICoupon>) => {
  const coupon = await Coupon.create(payload);
  return coupon;
};

const getAllCoupons = async () => {
  const coupons = await Coupon.find({});
  return coupons;
};

const updateCouponCount = async (code: string) => {
  await Coupon.findOneAndUpdate({ code }, { usedCount: +1 }, { new: true });
};

const updateCouponStatus = async (id: string, payload: Partial<ICoupon>) => {
  const isCouponExist = await Coupon.findById(id);
  if (!isCouponExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon not found");
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
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon not found");
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
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon not found");
  } else {
    await Coupon.findByIdAndDelete(id);
  }
};

export const CouponServices = {
  createCoupons,
  deleteCoupon,
  updateCouponStatus,
  updateCoupon,
  getAllCoupons,
  updateCouponCount,
};
