import { Request, Response, NextFunction } from "express";
import { RestaurantHourService } from "./restaurantHour.service";
import httpStatus from "http-status-codes";

export const getAllHours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hours = await RestaurantHourService.getAll();
    res.status(httpStatus.OK).json({ success: true, data: hours });
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
    if (!hour)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(httpStatus.OK).json({ success: true, data: hour });
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
    res.status(httpStatus.OK).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
