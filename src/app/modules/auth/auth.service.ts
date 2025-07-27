import AppError from "../../errorHelpers/AppError";
import { IAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
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

  const userTokens = createUserTokens(isUserExist);
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    admin: rest,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const email = decodedToken.email;
  const user = await Admin.findOne({ email });

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user!.save();
};

export const AuthServices = { credentialsLogin, resetPassword };
