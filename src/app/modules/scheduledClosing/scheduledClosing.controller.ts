import { Request, Response, NextFunction } from "express";
import { ScheduledClosingService } from "./scheduledClosing.service";
import httpStatus from "http-status-codes";

export const getClosings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const closings = await ScheduledClosingService.getAll();
    res.status(httpStatus.OK).json({ success: true, data: closings });
  } catch (err) {
    next(err);
  }
};

export const getClosingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const closing = await ScheduledClosingService.getById(req.params.id);
    if (!closing)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(httpStatus.OK).json({ success: true, data: closing });
  } catch (err) {
    next(err);
  }
};

export const createClosing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const closing = await ScheduledClosingService.create(req.body);
    res.status(httpStatus.CREATED).json({ success: true, data: closing });
  } catch (err) {
    next(err);
  }
};

export const updateClosing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await ScheduledClosingService.update(
      req.params.id,
      req.body
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(httpStatus.OK).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteClosing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const removed = await ScheduledClosingService.remove(req.params.id);
    if (!removed)
      return res.status(404).json({ success: false, message: "Not found" });
    res
      .status(httpStatus.OK)
      .json({ success: true, message: "Removed", data: null });
  } catch (err) {
    next(err);
  }
};
