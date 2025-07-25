import { Router } from "express";
import { AdminControllers } from "./admin.controller";

const router = Router();

router.post("/register", AdminControllers.createAdmin);

export const AdminRoutes = router;
