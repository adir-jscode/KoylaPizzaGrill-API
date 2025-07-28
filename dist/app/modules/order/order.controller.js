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
exports.changePaymentOrderStatus = exports.createOrderController = void 0;
const order_service_1 = require("./order.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        if (!payload.paymentMethod) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment method is required (CARD or CASH)");
        }
        const result = yield (0, order_service_1.createOrder)(payload);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "Order created successfully",
            data: {
                order: result.order,
                payment: result.payment,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createOrderController = createOrderController;
const changePaymentOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentInfo = yield (0, order_service_1.updatePaymentOrderStatus)(req.params.id);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Status changed successfully",
            data: paymentInfo,
        });
    }
    catch (error) { }
});
exports.changePaymentOrderStatus = changePaymentOrderStatus;
