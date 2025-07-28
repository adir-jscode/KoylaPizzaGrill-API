import { Schema, model, Document } from "mongoose";
import { IRestaurantSettings } from "./restaurantSettings.interface";

const RestaurantSettingsSchema = new Schema<IRestaurantSettings>(
  {
    isAcceptingPickup: { type: Boolean, default: true },
    isAcceptingDelivery: { type: Boolean, default: true },
    restaurantName: String,
    phone: String,
    address: String,
    deliveryFee: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.0875 },
    minDeliveryAmount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export const RestaurantSettings = model<IRestaurantSettings>(
  "RestaurantSettings",
  RestaurantSettingsSchema
);
