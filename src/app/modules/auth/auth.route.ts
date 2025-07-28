import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/reset-password", checkAuth, AuthControllers.resetPassword);
router.post("/logout", AuthControllers.logout);
export const AuthRoutes = router;
