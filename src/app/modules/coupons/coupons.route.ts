import { Router } from "express";
import { CouponControllers } from "./coupons.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createCouponZodSchema,
  updateCouponZodSchema,
} from "./coupons.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { updateAdminZodSchema } from "../admin/admin.validation";

const router = Router();

router.post(
  "/add-coupon",
  validateRequest(createCouponZodSchema),
  CouponControllers.createCoupon
);

router.delete("/:id", CouponControllers.deleteCoupon);
router.patch(
  "/update-status/:id",
  checkAuth,
  CouponControllers.UpdateCouponStatus
);
router.put(
  "/:id",
  validateRequest(updateCouponZodSchema),
  CouponControllers.UpdateCoupon
);

export const CouponRoutes = router;
