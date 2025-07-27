import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    setAuthCookie(res, loginInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Logged In Successfully",
      data: loginInfo,
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out Successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
export const AuthControllers = {
  credentialsLogin,
  logout,
  resetPassword,
};
