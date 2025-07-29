import { Router } from "express";
import * as ctrl from "./restaurantHour.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { restaurantHourZodSchema } from "./restaurantHour.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();
router.post(
  "/add-hours",
  checkAuth,
  validateRequest(restaurantHourZodSchema),
  ctrl.createRestaurantHour
);
router.get("/", ctrl.getAllHours);
router.get("/:day", ctrl.getHourByDay);
router.put(
  "/:day",
  checkAuth,
  validateRequest(restaurantHourZodSchema),
  ctrl.updateHourByDay
);

export const RestaurantHourRoutes = router;
