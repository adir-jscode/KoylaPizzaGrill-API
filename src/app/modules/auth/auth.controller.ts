import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const credentialsLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logged In Successfully",
      data: loginInfo,
    });
  } catch (error) {
    next(error);
  }
};
export const AuthControllers = {
  credentialsLogin,
};
