import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IAdmin } from "../modules/admin/admin.interface";
import { generateToken, verifyToken } from "./jwt";
import { Admin } from "../modules/admin/admin.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const createUserTokens = (user: Partial<IAdmin>) => {
  const jwtPayload = {
    username: user.username,
    email: user.email,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};
export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await Admin.findOne({
    email: verifiedRefreshToken.email,
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  const jwtPayload = {
    username: isUserExist.username,
    email: isUserExist.email,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};
