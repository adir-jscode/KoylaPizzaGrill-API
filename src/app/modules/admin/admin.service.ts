import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";

const createAdmin = async (payload: Partial<IAdmin>) => {
  const { username, password, email, name } = payload;
  const admin = await Admin.create({ username, password, email, name });
  return admin;
};

export const AdminServices = {
  createAdmin,
};
