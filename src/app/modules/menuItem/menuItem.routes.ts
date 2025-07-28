import { Router } from "express";
import { menuItemController } from "./menuItem.controller";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createMenuItemZodSchema,
  updateMenuItemZodSchema,
} from "./menuItem.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/add-menu",
  checkAuth,
  multerUpload.single("file"),
  validateRequest(createMenuItemZodSchema),
  menuItemController.createMenuItem
);
router.get("/", checkAuth, menuItemController.getMenuItems);
router.get("/:id", checkAuth, menuItemController.getMenuItemById);
router.patch(
  "/:id",
  checkAuth,
  multerUpload.single("file"),
  validateRequest(updateMenuItemZodSchema),
  menuItemController.updateMenuItem
);
router.delete("/:id", checkAuth, menuItemController.deleteMenuItem);

export const MenuItemsRoutes = router;
