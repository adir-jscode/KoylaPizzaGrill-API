import { MenuItem } from "./menuItem.model";
import { IMenuItem } from "./menuItem.interface";

const createMenuItem = async (payload: IMenuItem) => {
  const created = await MenuItem.create(payload);
  return created;
};

const getMenuItems = async () => {
  return MenuItem.find().populate("categoryId");
};

const getMenuItemById = async (id: string) => {
  return MenuItem.findById(id).populate("categoryId");
};

const updateMenuItem = async (id: string, data: Partial<IMenuItem>) => {
  const updated = await MenuItem.findByIdAndUpdate(id, data, { new: true });
  return updated;
};

const deleteMenuItem = async (id: string) => {
  const deleted = await MenuItem.findByIdAndDelete(id);
  return deleted;
};

export const MenuItemService = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
