import { RestaurantHour } from "./restaurantHour.model";
import { IRestaurantHour } from "./restaurantHour.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
const createRestaurantHour = async (payload: Partial<IRestaurantHour>) => {
  const newHour = await RestaurantHour.create(payload);
  return newHour;
};
const getAll = async () => {
  const restaurantHour = await RestaurantHour.find();
  return restaurantHour;
};
const getByDay = async (day: number) => {
  const restaurantHourByDay = await RestaurantHour.findOne({ day });
  if (!restaurantHourByDay) {
    throw new AppError(httpStatus.BAD_REQUEST, "Restaurant Hour Not Found");
  }
  return restaurantHourByDay;
};
const updateByDay = async (day: number, data: Partial<IRestaurantHour>) => {
  const restaurantHourByDay = await RestaurantHour.findOne({ day });
  if (!restaurantHourByDay) {
    throw new AppError(httpStatus.BAD_REQUEST, "Restaurant Hour Not Found");
  }
  const updated = await RestaurantHour.findOneAndUpdate({ day }, data, {
    upsert: true,
    new: true,
  });
  return updated;
};

export const RestaurantHourService = {
  createRestaurantHour,
  getAll,
  getByDay,
  updateByDay,
};
