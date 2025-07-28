import { Router } from "express";
import * as ctrl from "./restaurantSettings.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { restaurantSettingsZodSchema } from "./restaurantSettings.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();
router.get("/", checkAuth, ctrl.getSettings);
router.post(
  "/add-settings",
  checkAuth,
  validateRequest(restaurantSettingsZodSchema),
  ctrl.addSettings
);
router.put(
  "/",
  checkAuth,
  validateRequest(restaurantSettingsZodSchema),
  ctrl.updateSettings
);

export const RestaurantSettingsRoutes = router;
