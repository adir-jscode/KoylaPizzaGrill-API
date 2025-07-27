import { model, Schema } from "mongoose";
import { Available, ICategory } from "./categories.interface";

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String },
    display: { type: Boolean, default: true },
    available: [{ type: String, enum: Object.values(Available) }],
    availableDays: [Number],
    availableTime: {
      from: String,
      to: String,
    },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Category = model<ICategory>("Category", CategorySchema);
