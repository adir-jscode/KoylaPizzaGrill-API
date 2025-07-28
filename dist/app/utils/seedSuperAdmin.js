"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const env_1 = require("../config/env");
const admin_model_1 = require("../modules/admin/admin.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield admin_model_1.Admin.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            console.log("Super Admin Already Exists!");
            return;
        }
        console.log("Trying to create super admin...");
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const payload = {
            name: "Super Admin",
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            username: env_1.envVars.SUPER_ADMIN_USERNAME,
            isActive: true,
            last_login: new Date(),
        };
        const superAdmin = yield admin_model_1.Admin.create(payload);
        console.log("Super Admin Created Successfuly! \n");
        console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
