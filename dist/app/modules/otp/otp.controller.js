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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpControllers = void 0;
const otp_service_1 = require("./otp.service");
const sendResponse_1 = require("../../utils/sendResponse");
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = req.body;
        const otp = yield otp_service_1.OtpServices.sendOtp(email, name);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "OTP sent successfully",
            data: otp,
        });
    }
    catch (error) {
        next(error);
    }
});
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        yield otp_service_1.OtpServices.verifyOtp(email, otp);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "OTP verified successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.OtpControllers = { sendOtp, verifyOtp };
