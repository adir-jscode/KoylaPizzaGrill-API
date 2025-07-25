import { Request, Response } from "express";
import { Admin } from "./admin.model";
import httpStatus from "http-status-codes";
import { AdminServices } from "./admin.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await AdminServices.createAdmin(req.body);
    res
      .status(httpStatus.CREATED)
      .json({ success: true, message: "New admin created", admin });
  } catch (err: any) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: "Something went wrong", err });
  }
};

export const AdminControllers = {
  createAdmin,
};
