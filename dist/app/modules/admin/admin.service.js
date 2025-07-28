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
exports.AdminServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const admin_model_1 = require("./admin.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, name } = payload;
    const isAdminExist = yield admin_model_1.Admin.findOne({ email });
    if (isAdminExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Admin already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const admin = yield admin_model_1.Admin.create({
        username,
        password: hashedPassword,
        email,
        name,
    });
    return admin;
});
const getAllAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield admin_model_1.Admin.find({});
    return admins;
});
exports.AdminServices = {
    createAdmin,
    getAllAdmins,
};
