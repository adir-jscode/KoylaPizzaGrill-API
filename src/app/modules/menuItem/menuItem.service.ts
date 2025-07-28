import { MenuItem } from "./menuItem.model";
import { IMenuItem } from "./menuItem.interface";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

const createMenuItem = async (payload: IMenuItem) => {
  const created = await MenuItem.create(payload);
  return created;
};

const getMenuItems = async () => {
  return MenuItem.find().populate("categoryId");
};

const getMenuItemById = async (id: string) => {
  const menuItem = await MenuItem.findById(id).populate("categoryId");
  if (!menuItem) {
    throw new AppError(httpStatus.BAD_REQUEST, "Menu Item not found");
  }
  return menuItem;
};

const updateMenuItem = async (id: string, data: Partial<IMenuItem>) => {
  const existingMenu = await MenuItem.findById(id);
  if (!existingMenu) {
    throw new AppError(httpStatus.BAD_REQUEST, "Menu Item not found");
  }
  const updateMenu = await MenuItem.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (data.imageUrl && updateMenu?.imageUrl) {
    await deleteImageFromCLoudinary(existingMenu.imageUrl as string);
  }
  return updateMenu;
};

const deleteMenuItem = async (id: string) => {
  const menuItem = await MenuItem.findById(id);

  if (!menuItem) {
    throw new AppError(httpStatus.BAD_REQUEST, "Menu item not found");
  }

  if (menuItem.imageUrl) {
    try {
      await deleteImageFromCLoudinary(menuItem.imageUrl);
    } catch (error) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cloudinary image deletion failed - proceeding with menu item delete:"
      );
    }
  }

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
