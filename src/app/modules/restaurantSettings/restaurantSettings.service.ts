import { RestaurantSettings } from "./restaurantSettings.model";
import { IRestaurantSettings } from "./restaurantSettings.interface";

const createRestaurantSettings = async (payload: IRestaurantSettings) => {
  const created = await RestaurantSettings.create(payload);
  return created;
};
const getSettings = async () => RestaurantSettings.findOne();
const updateSettings = async (data: Partial<IRestaurantSettings>) =>
  RestaurantSettings.findOneAndUpdate({}, data, { upsert: true, new: true });

export const RestaurantSettingsService = {
  createRestaurantSettings,
  getSettings,
  updateSettings,
};
