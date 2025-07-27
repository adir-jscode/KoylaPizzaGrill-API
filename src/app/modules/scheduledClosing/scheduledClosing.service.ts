import { ScheduledClosing } from "./scheduledClosing.model";
import { IScheduledClosing } from "./scheduledClosing.interface";

const getAll = async () => ScheduledClosing.find();
const getById = async (id: string) => ScheduledClosing.findById(id);
const create = async (data: IScheduledClosing) => ScheduledClosing.create(data);
const update = async (id: string, data: Partial<IScheduledClosing>) =>
  ScheduledClosing.findByIdAndUpdate(id, data, { new: true });
const remove = async (id: string) => ScheduledClosing.findByIdAndDelete(id);

export const ScheduledClosingService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
