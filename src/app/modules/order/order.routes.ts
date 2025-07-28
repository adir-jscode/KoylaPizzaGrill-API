import { Router } from "express";
import * as orderController from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createOrderZodSchema } from "./order.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/",
  validateRequest(createOrderZodSchema),
  orderController.createOrderController
);

router.patch("/:id", checkAuth, orderController.changePaymentOrderStatus);
export const OrderRoutes = router;
