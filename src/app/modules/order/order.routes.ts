import { Router } from "express";
import * as orderController from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createOrderZodSchema } from "./order.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import express from "express";

const router = Router();

router.post(
  "/",
  validateRequest(createOrderZodSchema),
  orderController.createOrderController
);
router.get("/", checkAuth, orderController.getAllOrders);
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  orderController.stripeWebhookHandler
);

router.get("/history/:id", checkAuth, orderController.getOrderHistory);
router.put("/:id", checkAuth, orderController.toggleOrderStatus);
router.get("/", checkAuth, orderController.getFilteredOrders);
export const OrderRoutes = router;
