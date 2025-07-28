import { Router } from "express";
import * as ctrl from "./scheduledClosing.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createScheduledClosingZodSchema,
  updateScheduledClosingZodSchema,
} from "./scheduleClosing.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();
router.get("/", checkAuth, ctrl.getClosings);
router.get("/:id", checkAuth, ctrl.getClosingById);
router.post(
  "/",
  checkAuth,
  validateRequest(createScheduledClosingZodSchema),
  ctrl.createClosing
);
router.patch(
  "/:id",
  checkAuth,
  validateRequest(updateScheduledClosingZodSchema),
  ctrl.updateClosing
);
router.delete("/:id", checkAuth, ctrl.deleteClosing);

export const ScheduledClosingRoutes = router;
