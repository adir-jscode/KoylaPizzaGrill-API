import { ICategory } from "./categories.interface";
import { Category } from "./categories.model";

const createCategory = async (payload: ICategory) => Category.create(payload);
const getCategories = async () => Category.find();
const getCategoryById = async (id: string) => Category.findById(id);
const updateCategory = async (id: string, data: Partial<ICategory>) =>
  Category.findByIdAndUpdate(id, data, { new: true });
const deleteCategory = async (id: string) => Category.findByIdAndDelete(id);

export const CategoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
