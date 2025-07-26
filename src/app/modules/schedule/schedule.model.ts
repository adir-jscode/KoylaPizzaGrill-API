import { model, Schema } from "mongoose";
import { IScheduledClosing } from "./schedule.interface";

const ScheduledClosingSchema = new Schema<IScheduledClosing>(
  {
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    allDay: { type: Boolean, default: true },
    fromTime: String,
    toTime: String,
  },
  { timestamps: true, versionKey: false }
);

export const ScheduledClosing = model<IScheduledClosing>(
  "ScheduledClosing",
  ScheduledClosingSchema
);
