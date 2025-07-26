import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createAdminZodSchema } from "./admin.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createAdminZodSchema),
  AdminControllers.createAdmin
);
router.get("/", AdminControllers.getAllAdmins);

export const AdminRoutes = router;
