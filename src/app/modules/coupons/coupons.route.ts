import { Router } from "express";
import { CouponControllers } from "./coupons.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCouponZodSchema } from "./coupons.validation";

const router = Router();

router.post(
  "/add-coupon",
  validateRequest(createCouponZodSchema),
  CouponControllers.createCoupon
);

export const CouponRoutes = router;
