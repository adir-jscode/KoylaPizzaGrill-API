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
exports.OtpServices = void 0;
const crypto_1 = __importDefault(require("crypto"));
const radis_config_1 = require("../../config/radis.config");
const sendMail_1 = require("../../utils/sendMail");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const order_model_1 = require("../order/order.model");
const OTP_EXPIRATION = 2 * 60;
const generateOtp = (length = 6) => {
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
const sendOtp = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = generateOtp();
    const redisKey = `otp:${email}`;
    yield radis_config_1.redisClient.set(redisKey, otp, {
        expiration: { type: "EX", value: OTP_EXPIRATION },
    });
    yield (0, sendMail_1.sendEmail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: { name: name, otp: otp },
    });
});
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redisKey = `otp:${email}`;
        const savedOtp = yield radis_config_1.redisClient.get(redisKey);
        if (!savedOtp) {
            throw new AppError_1.default(401, "Invalid otp");
        }
        if (savedOtp === otp) {
            throw new AppError_1.default(401, "Invalid otp");
        }
        yield order_model_1.Order.updateOne({ customerEmail: email }, { status: "CONFIRMED" }, { runValidators: true });
        yield radis_config_1.redisClient.del(redisKey);
    }
    catch (error) {
        throw new AppError_1.default(400, "Fail to verify OTP");
    }
});
exports.OtpServices = { sendOtp, verifyOtp };
