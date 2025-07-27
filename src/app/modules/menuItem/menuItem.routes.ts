import { Router } from "express";
import { menuItemController } from "./menuItem.controller";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createMenuItemZodSchema,
  updateMenuItemZodSchema,
} from "./menuItem.validation";

const router = Router();

router.post(
  "/add-menu",
  multerUpload.single("file"),
  validateRequest(createMenuItemZodSchema),
  menuItemController.createMenuItem
);
router.get("/", menuItemController.getMenuItems);
router.get("/:id", menuItemController.getMenuItemById);
router.patch(
  "/:id",
  multerUpload.single("file"),
  validateRequest(updateMenuItemZodSchema),
  menuItemController.updateMenuItem
);
router.delete("/:id", menuItemController.deleteMenuItem);

export const MenuItemsRoutes = router;
