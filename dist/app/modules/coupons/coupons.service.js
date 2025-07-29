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
exports.CouponServices = void 0;
const coupons_model_1 = require("./coupons.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createCoupons = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupons_model_1.Coupon.create(payload);
    return coupon;
});
const getAllCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield coupons_model_1.Coupon.find({});
    return coupons;
});
const updateCouponStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCouponExist = yield coupons_model_1.Coupon.findById(id);
    if (!isCouponExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coupon not found");
    }
    else {
        const newUpdatedCoupon = yield coupons_model_1.Coupon.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return newUpdatedCoupon;
    }
});
const updateCoupon = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCouponExist = yield coupons_model_1.Coupon.findById(id);
    if (!isCouponExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coupon not found");
    }
    else {
        const newUpdatedCoupon = yield coupons_model_1.Coupon.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
        return newUpdatedCoupon;
    }
});
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isCouponExist = yield coupons_model_1.Coupon.findById(id);
    if (!isCouponExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coupon not found");
    }
    else {
        yield coupons_model_1.Coupon.findByIdAndDelete(id);
    }
});
exports.CouponServices = {
    createCoupons,
    deleteCoupon,
    updateCouponStatus,
    updateCoupon,
    getAllCoupons,
};
