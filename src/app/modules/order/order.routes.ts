import { Router } from "express";
import * as orderController from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createOrderZodSchema } from "./order.validation";

const router = Router();

router.post(
  "/",
  validateRequest(createOrderZodSchema),
  orderController.createOrder
);
router.post("/:id/pay", orderController.createStripeIntent);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
// Stripe webhook - must use raw body parser for this endpoint!
router.post("/stripe/webhook", orderController.stripeWebhook);

export const OrderRoutes = router;
