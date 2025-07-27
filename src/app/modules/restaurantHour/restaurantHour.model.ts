import { model, Schema, Document } from "mongoose";
import { IRestaurantHour, IHourRange } from "./restaurantHour.interface";

const HourRangeSchema = new Schema<IHourRange>({
  from: String,
  to: String,
});

const RestaurantHourSchema = new Schema<IRestaurantHour>(
  {
    day: { type: Number, min: 0, max: 6, required: true, unique: true },
    pickupHours: { type: [HourRangeSchema], default: [] },
    deliveryHours: { type: [HourRangeSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const RestaurantHour = model<IRestaurantHour>(
  "RestaurantHour",
  RestaurantHourSchema
);
