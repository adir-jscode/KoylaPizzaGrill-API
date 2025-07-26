import { ICoupon } from "./coupons.interface";
import { Coupon } from "./coupons.model";

const createCoupons = async (payload: Partial<ICoupon>) => {
  const coupon = await Coupon.create(payload);
  return coupon;
};

export const CouponServices = {
  createCoupons,
};
