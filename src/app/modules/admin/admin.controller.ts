import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { AdminServices } from "./admin.service";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("Testing error");
    const admin = await AdminServices.createAdmin(req.body);
    res
      .status(httpStatus.CREATED)
      .json({ success: true, message: "New admin created", admin });
  } catch (err: any) {
    next(err);
  }
};

export const AdminControllers = {
  createAdmin,
};
