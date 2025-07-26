import { Router } from "express";
import { CouponControllers } from "./coupons.controller";

const router = Router();

router.post("/add-coupon", CouponControllers.createCoupon);

export const CouponRoutes = router;
