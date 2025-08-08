import { Router } from "express";
import { CouponControllers } from "./coupons.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createCouponZodSchema,
  updateCouponZodSchema,
} from "./coupons.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", checkAuth, CouponControllers.getAllCoupons);

router.post(
  "/add-coupon",
  checkAuth,
  validateRequest(createCouponZodSchema),
  CouponControllers.createCoupon
);

router.delete("/:id", checkAuth, CouponControllers.deleteCoupon);
router.patch(
  "/update-status/:id",
  checkAuth,
  CouponControllers.UpdateCouponStatus
);
router.put(
  "/:id",
  checkAuth,
  validateRequest(updateCouponZodSchema),
  CouponControllers.UpdateCoupon
);
router.post("/apply-coupon", CouponControllers.applyCoupon);

export const CouponRoutes = router;
