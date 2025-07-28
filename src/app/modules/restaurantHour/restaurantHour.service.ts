import { RestaurantHour } from "./restaurantHour.model";
import { IRestaurantHour } from "./restaurantHour.interface";

const createRestaurantHour = async (payload: Partial<IRestaurantHour>) => {
  const newHour = await RestaurantHour.create(payload);
  return newHour;
};
const getAll = async () => RestaurantHour.find();
const getByDay = async (day: number) => RestaurantHour.findOne({ day });
const updateByDay = async (day: number, data: Partial<IRestaurantHour>) =>
  RestaurantHour.findOneAndUpdate({ day }, data, { upsert: true, new: true });
const create = async (data: IRestaurantHour) => RestaurantHour.create(data);

export const RestaurantHourService = {
  createRestaurantHour,
  getAll,
  getByDay,
  updateByDay,
  create,
};
