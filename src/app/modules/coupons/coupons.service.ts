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

const applyCoupon = async (code: string) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid coupon code");
  }
  if (coupon.usedCount >= coupon?.usageLimit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Coupon has reached its usage limit"
    );
  }
  if (coupon.validFrom > new Date() || coupon.validTo < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon is not valid");
  }

  if (!coupon.active) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon is not active");
  }
  return coupon;
};

const updateCouponCount = async (code: string) => {
  const coupon = await Coupon.findOne({ code: code });
  if (!coupon) {
    throw new AppError(httpStatus.BAD_REQUEST, "coupon not found");
  }
  coupon.usedCount = coupon.usedCount + 1;
  await coupon.save();
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
  applyCoupon,
};
