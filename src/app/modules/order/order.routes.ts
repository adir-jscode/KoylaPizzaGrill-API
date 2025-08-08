import { Router } from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { createOrderZodSchema } from "./order.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import express from "express";
import { OrderControllers } from "./order.controller";

const router = Router();

router.post(
  "/",
  validateRequest(createOrderZodSchema),
  OrderControllers.createOrder
);
router.get("/", checkAuth, OrderControllers.getAllOrders);
router.get(
  "/history/:orderNumber",
  checkAuth,
  OrderControllers.getOrderHistory
);
router.put("/:id", checkAuth, OrderControllers.toggleOrderStatus);
router.get("/filter", checkAuth, OrderControllers.getFilteredOrders);
router.post("/payment-intent", OrderControllers.createPaymentIntent);
router.post("/track", OrderControllers.trackByOrderNumber);
export const OrderRoutes = router;
