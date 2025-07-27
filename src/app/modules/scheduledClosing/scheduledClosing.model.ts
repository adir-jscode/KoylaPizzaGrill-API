import { Schema, model, Document } from "mongoose";
import { IScheduledClosing } from "./scheduledClosing.interface";

const ScheduledClosingSchema = new Schema<IScheduledClosing>(
  {
    date: { type: String, required: true },
    reason: { type: String, required: true },
    allDay: { type: Boolean, default: true },
    fromTime: String,
    toTime: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

export const ScheduledClosing = model<IScheduledClosing>(
  "ScheduledClosing",
  ScheduledClosingSchema
);
