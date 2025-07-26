import AppError from "../../errorHelpers/AppError";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";

const createAdmin = async (payload: Partial<IAdmin>) => {
  const { username, password, email, name } = payload;
  const isAdminExist = await Admin.findOne({ email });
  if (isAdminExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin already Exist");
  }
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const admin = await Admin.create({
    username,
    password: hashedPassword,
    email,
    name,
  });
  return admin;
};

const getAllAdmins = async () => {
  const admins = await Admin.find({});
  return admins;
};

export const AdminServices = {
  createAdmin,
  getAllAdmins,
};
