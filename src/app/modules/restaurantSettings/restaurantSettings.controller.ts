import { Request, Response, NextFunction } from "express";
import { RestaurantSettingsService } from "./restaurantSettings.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

export const getSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await RestaurantSettingsService.getSettings();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All data retrived Successfully",
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};
export const addSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await RestaurantSettingsService.createRestaurantSettings(
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Settings created Successfully",
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await RestaurantSettingsService.updateSettings(req.body);
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
