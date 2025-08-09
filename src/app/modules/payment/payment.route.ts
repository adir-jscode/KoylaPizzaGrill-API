import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { changePaymentStatusZodSchema } from "./payment.validation";

const router = Router();
router.patch(
  "/payment-status/:id",
  validateRequest(changePaymentStatusZodSchema),
  checkAuth,
  PaymentControllers.togglePaymentStatus
);

export const PaymentRoutes = router;
