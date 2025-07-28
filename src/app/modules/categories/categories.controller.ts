import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./categories.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created Successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await CategoryService.getCategories();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All data retrived Successfully",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data retrived successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await CategoryService.updateCategory(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CategoryService.deleteCategory(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const CategoriesController = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
