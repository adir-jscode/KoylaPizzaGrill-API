import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { restaurantHourZodSchema } from "./restaurantHour.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { RestaurantHourControllers } from "./restaurantHour.controller";

const router = Router();
router.post(
  "/add-hours",
  checkAuth,
  validateRequest(restaurantHourZodSchema),
  RestaurantHourControllers.createRestaurantHour
);
router.get("/", RestaurantHourControllers.getAllHours);
router.get("/:day", RestaurantHourControllers.getHourByDay);
router.put(
  "/:day",
  checkAuth,
  validateRequest(restaurantHourZodSchema),
  RestaurantHourControllers.updateHourByDay
);

export const RestaurantHourRoutes = router;
