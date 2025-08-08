import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { restaurantSettingsZodSchema } from "./restaurantSettings.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { RestaurantSettingsControllers } from "./restaurantSettings.controller";

const router = Router();
router.get("/", RestaurantSettingsControllers.getSettings);
router.post(
  "/add-settings",
  checkAuth,
  validateRequest(restaurantSettingsZodSchema),
  RestaurantSettingsControllers.addSettings
);
router.put(
  "/",
  checkAuth,
  validateRequest(restaurantSettingsZodSchema),
  RestaurantSettingsControllers.updateSettings
);

export const RestaurantSettingsRoutes = router;
