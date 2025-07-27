import { Router } from "express";
import { CategoriesController } from "./categories.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./categories.validation";

const router = Router();

router.post(
  "/create-category",
  validateRequest(createCategoryZodSchema),
  CategoriesController.createCategory
);
router.get("/", CategoriesController.getCategories);
router.get("/:id", CategoriesController.getCategoryById);
router.put(
  "/:id",
  validateRequest(updateCategoryZodSchema),
  CategoriesController.updateCategory
);
router.delete("/:id", CategoriesController.deleteCategory);

export const CategoriesRoutes = router;
