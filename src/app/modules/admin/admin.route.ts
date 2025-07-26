import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createAdminZodSchema } from "./admin.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/register",
  validateRequest(createAdminZodSchema),
  AdminControllers.createAdmin
);
router.get("/", checkAuth, AdminControllers.getAllAdmins);

export const AdminRoutes = router;
