import { Request, Response, NextFunction } from "express";
import { MenuItemService } from "./menuItem.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { IMenuItem } from "./menuItem.interface";

export const createMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload: IMenuItem = {
      ...req.body,
      imageUrl: req.file?.path,
    };
    const menuItem = await MenuItemService.createMenuItem(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Menu Item created Successfully",
      data: menuItem,
    });
  } catch (err) {
    next(err);
  }
};

export const getMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menuItems = await MenuItemService.getMenuItems();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Data Retrived Successfully",
      data: menuItems,
    });
  } catch (err) {
    next(err);
  }
};

export const getMenuItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menuItem = await MenuItemService.getMenuItemById(req.params.id);
    if (!menuItem)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data Retrived Successfully",
      data: menuItem,
    });
  } catch (err) {
    next(err);
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload: IMenuItem = {
      ...req.body,
      imageUrl: req.file?.path,
    };
    const updated = await MenuItemService.updateMenuItem(
      req.params.id,
      payload
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data updated Successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await MenuItemService.deleteMenuItem(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data deleted Successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const menuItemController = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
