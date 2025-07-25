import { Request, Response } from "express";
import { Admin } from "./admin.model";
import httpStatus from "http-status-codes";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password, email, name } = req.body;
    const admin = await Admin.create({ username, password, email, name });
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
