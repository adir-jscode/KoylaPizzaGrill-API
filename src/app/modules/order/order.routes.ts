import { Router } from "express";
import * as orderController from "./order.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createOrderZodSchema } from "./order.validation";

const router = Router();

router.post("/", orderController.createOrderController);

export const OrderRoutes = router;
