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
exports.CouponControllers = void 0;
const coupons_service_1 = require("./coupons.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const createCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield coupons_service_1.CouponServices.createCoupons(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.CREATED,
            success: true,
            message: "New Coupon Created",
            data: coupon,
        });
    }
    catch (err) {
        next(err);
    }
});
const getAllCoupons = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield coupons_service_1.CouponServices.getAllCoupons();
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "All Coupons Retrived Successfully",
            data: coupons,
        });
    }
    catch (err) {
        next(err);
    }
});
const deleteCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield coupons_service_1.CouponServices.deleteCoupon(id);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "Deleted Successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
const UpdateCouponStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const coupon = yield coupons_service_1.CouponServices.updateCouponStatus(id, req.body);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "Status Updated",
            data: coupon,
        });
    }
    catch (err) {
        next(err);
    }
});
const UpdateCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const coupon = yield coupons_service_1.CouponServices.updateCoupon(id, req.body);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "Coupone Updated",
            data: coupon,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.CouponControllers = {
    createCoupon,
    deleteCoupon,
    UpdateCouponStatus,
    UpdateCoupon,
    getAllCoupons,
};
