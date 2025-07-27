import { Router } from "express";
import * as ctrl from "./restaurantSettings.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { restaurantSettingsZodSchema } from "./restaurantSettings.validation";

const router = Router();
router.get("/", ctrl.getSettings);
router.post(
  "/add-settings",
  validateRequest(restaurantSettingsZodSchema),
  ctrl.addSettings
);
router.put(
  "/",
  validateRequest(restaurantSettingsZodSchema),
  ctrl.updateSettings
);

export const RestaurantSettingsRoutes = router;
