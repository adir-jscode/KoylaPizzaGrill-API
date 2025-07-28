import { ScheduledClosing } from "./scheduledClosing.model";
import { IScheduledClosing } from "./scheduledClosing.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

const getAll = async () => {
  const scheduleClosing = await ScheduledClosing.find();
  return scheduleClosing;
};
const getById = async (id: string) => {
  const scheduleClosing = await ScheduledClosing.findById(id);
  if (!scheduleClosing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Schedule closing hour not found"
    );
  }
  return scheduleClosing;
};
const create = async (data: IScheduledClosing) => {
  const scheduleClosing = await ScheduledClosing.create(data);
  return scheduleClosing;
};
const update = async (id: string, data: Partial<IScheduledClosing>) => {
  const updated = await ScheduledClosing.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updated) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Schedule closing hour not found"
    );
  }
  return updated;
};

const remove = async (id: string) => {
  const isExist = await ScheduledClosing.findById(id);
  if (!isExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Schedule closing hour not found"
    );
  }
  await ScheduledClosing.findByIdAndDelete(id);
};

export const ScheduledClosingService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
