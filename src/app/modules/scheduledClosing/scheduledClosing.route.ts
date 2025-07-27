import { Router } from "express";
import * as ctrl from "./scheduledClosing.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createScheduledClosingZodSchema,
  updateScheduledClosingZodSchema,
} from "./scheduleClosing.validation";

const router = Router();
router.get("/", ctrl.getClosings);
router.get("/:id", ctrl.getClosingById);
router.post(
  "/",
  validateRequest(createScheduledClosingZodSchema),
  ctrl.createClosing
);
router.patch(
  "/:id",
  validateRequest(updateScheduledClosingZodSchema),
  ctrl.updateClosing
);
router.delete("/:id", ctrl.deleteClosing);

export const ScheduledClosingRoutes = router;
