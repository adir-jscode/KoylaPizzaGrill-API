import { NextFunction, Request, Response } from "express";
import { OtpServices } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";

const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    await OtpServices.sendOtp(email, name);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP sent successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    await OtpServices.verifyOtp(email, otp);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP verified successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const OtpControllers = { sendOtp, verifyOtp };
