import { Router } from "express";
import { CategoriesController } from "./categories.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./categories.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/create-category",
  checkAuth,
  validateRequest(createCategoryZodSchema),
  CategoriesController.createCategory
);
router.get("/", CategoriesController.getCategories);
router.get("/:id", CategoriesController.getCategoryById);
router.put(
  "/:id",
  checkAuth,
  validateRequest(updateCategoryZodSchema),
  CategoriesController.updateCategory
);
router.delete("/:id", checkAuth, CategoriesController.deleteCategory);

export const CategoriesRoutes = router;
