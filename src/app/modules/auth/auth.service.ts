import AppError from "../../errorHelpers/AppError";
import { IAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IAdmin>) => {
  const { username, password } = payload;
  const isUserExist = await Admin.findOne({ username });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};

export const AuthServices = { credentialsLogin };
