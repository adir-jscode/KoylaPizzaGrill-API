import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginZodSchema, resetPasswordZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(loginZodSchema),
  AuthControllers.credentialsLogin
);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  checkAuth,
  AuthControllers.resetPassword
);
router.post("/logout", AuthControllers.logout);
export const AuthRoutes = router;
