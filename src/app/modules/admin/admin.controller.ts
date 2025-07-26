import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { AdminServices } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await AdminServices.createAdmin(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Admin Created Successfully",
      data: admin,
    });
  } catch (err: any) {
    next(err);
  }
};

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admins = await AdminServices.getAllAdmins();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Data Retrived Successfully",
      data: admins,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminControllers = {
  createAdmin,
  getAllAdmins,
};
