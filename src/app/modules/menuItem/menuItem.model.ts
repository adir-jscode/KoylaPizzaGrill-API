import { model, Schema } from "mongoose";
import {
  IMenuItem,
  IAddon,
  IPrimaryOption,
  ISecondaryOption,
} from "./menuItem.interface";

const AddonSchema = new Schema<IAddon>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const PrimaryOptionSchema = new Schema<IPrimaryOption>({
  name: { type: String, required: true },
  options: [
    {
      name: { type: String, required: true },
      price: { type: Number, default: 0 },
    },
  ],
});

const SecondaryOptionSchema = new Schema<ISecondaryOption>({
  name: { type: String, required: true },
  minSelect: { type: Number, required: true },
  maxSelect: { type: Number, required: true },
  options: [
    {
      name: { type: String, required: true },
      price: { type: Number, default: 0 },
    },
  ],
});

const MenuItemSchema = new Schema<IMenuItem>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    primaryOption: { type: PrimaryOptionSchema, required: true },
    secondaryOptions: { type: [SecondaryOptionSchema], default: [] },
    addons: { type: [AddonSchema], default: [] },
    tags: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export const MenuItem = model<IMenuItem>("MenuItem", MenuItemSchema);
