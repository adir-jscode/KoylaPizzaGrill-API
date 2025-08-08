import { Request, Response, NextFunction } from "express";
import { RestaurantHourService } from "./restaurantHour.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

export const createRestaurantHour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hour = await RestaurantHourService.createRestaurantHour(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All data retrived Successfully",
      data: hour,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hours = await RestaurantHourService.getAll();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All data retrived Successfully",
      data: hours,
    });
  } catch (err) {
    next(err);
  }
};

export const getHourByDay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hour = await RestaurantHourService.getByDay(Number(req.params.day));
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data retrived Successfully",
      data: hour,
    });
  } catch (err) {
    next(err);
  }
};

export const updateHourByDay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await RestaurantHourService.updateByDay(
      Number(req.params.day),
      req.body
    );
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

export const RestaurantHourControllers = {
  createRestaurantHour,
  getAllHours,
  getHourByDay,
  updateHourByDay,
};
