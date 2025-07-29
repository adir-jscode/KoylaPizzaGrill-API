import AppError from "../../errorHelpers/AppError";
import { ICategory } from "./categories.interface";
import { Category } from "./categories.model";
import httpStatus from "http-status-codes";

const createCategory = async (payload: ICategory) => {
  const category = await Category.create(payload);
  return category;
};
const getCategories = async () => {
  const categories = await Category.find();
  return categories;
};
const getCategoryById = async (id: string) => {
  const categoryById = await Category.findById(id);
  if (!categoryById) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }
  return categoryById;
};
const updateCategory = async (id: string, data: Partial<ICategory>) => {
  const isCategoryExists = await Category.findById(id);
  if (!isCategoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
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
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
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
