import AppError from "../../errorHelpers/AppError";
import { ICategory } from "./categories.interface";
import { Category } from "./categories.model";
import httpStatus from "http-status-codes";

const createCategory = async (payload: ICategory) => Category.create(payload);
const getCategories = async () => Category.find();
const getCategoryById = async (id: string) => Category.findById(id);
const updateCategory = async (id: string, data: Partial<ICategory>) => {
  const isCategoryExists = await Category.findById(id);
  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  const updated = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updated;
};

const deleteCategory = async (id: string) => {
  const isCategoryExists = await Category.findById(id);
  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  await Category.findByIdAndDelete(id);
};

export const CategoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
