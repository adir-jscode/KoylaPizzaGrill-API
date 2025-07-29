import { RestaurantSettings } from "./restaurantSettings.model";
import { IRestaurantSettings } from "./restaurantSettings.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

const createRestaurantSettings = async (payload: IRestaurantSettings) => {
  const created = await RestaurantSettings.create(payload);
  return created;
};
const getSettings = async () => {
  const settings = await RestaurantSettings.find({});
  return settings;
};
const updateSettings = async (data: Partial<IRestaurantSettings>) => {
  const updated = await RestaurantSettings.findOneAndUpdate({}, data, {
    upsert: true,
    new: true,
  });
  if (!updated) {
    throw new AppError(httpStatus.BAD_REQUEST, "Settings Not Found");
  }
  return updated;
};

export const RestaurantSettingsService = {
  createRestaurantSettings,
  getSettings,
  updateSettings,
};
