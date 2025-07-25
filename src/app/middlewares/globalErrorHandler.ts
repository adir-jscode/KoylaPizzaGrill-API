import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = `Something went wrong!! ${err.message}`;
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: message,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
