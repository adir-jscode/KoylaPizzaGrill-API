import { envVars } from "../config/env";
import { IAdmin } from "../modules/admin/admin.interface";
import { Admin } from "../modules/admin/admin.model";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await Admin.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }
    console.log("Trying to create super admin...");
    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload: IAdmin = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      username: envVars.SUPER_ADMIN_USERNAME,
      isActive: true,
      last_login: new Date(),
    };

    const superAdmin = await Admin.create(payload);
    console.log("Super Admin Created Successfuly! \n");
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
