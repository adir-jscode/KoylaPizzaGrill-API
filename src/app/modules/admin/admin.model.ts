import { model, Schema } from "mongoose";
import { IAdmin } from "./admin.interface";

const adminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false },
    last_login: { type: Date },
    password: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Admin = model<IAdmin>("Admin", adminSchema);
