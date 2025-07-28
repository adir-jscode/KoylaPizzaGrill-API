import { Request, Response, NextFunction } from "express";
import { ScheduledClosingService } from "./scheduledClosing.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

export const getClosings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const closings = await ScheduledClosingService.getAll();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All data retrived Successfully",
      data: closings,
    });
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
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data retrived Successfully",
      data: closing,
    });
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
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Data created Successfully",
      data: closing,
    });
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
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data updated Successfully",
      data: updated,
    });
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
    await ScheduledClosingService.remove(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Data deleted Successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
