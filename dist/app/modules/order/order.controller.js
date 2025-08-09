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
exports.OrderControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const stripe_1 = require("../../config/stripe");
const order_service_1 = require("./order.service");
// POST /orders/payment-intent
const createPaymentIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { total, customerEmail } = req.body;
        const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
            amount: Math.round(Number(total) * 100),
            currency: "usd",
            payment_method_types: ["card"],
            metadata: { tempId: Date.now().toString() },
            receipt_email: customerEmail,
        });
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.CREATED,
            success: true,
            message: "Payment intent id retrived",
            data: {
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        if (!payload.paymentMethod) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment method is required (CARD or CASH)");
        }
        const result = yield order_service_1.OrderServices.createOrder(payload);
        console.log("from controller", result);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.CREATED,
            message: "Order created successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.OrderServices.getAllOrder(req.query);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "All data retrived successfully",
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
});
const getFilteredOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.OrderServices.filteredOrders(req.query);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Data filtered successfully",
            data: orders,
        });
    }
    catch (err) {
        next(err);
    }
});
const changePaymentOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentInfo = yield order_service_1.OrderServices.updatePaymentOrderStatus(req.params.id);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Status changed successfully",
            data: paymentInfo,
        });
    }
    catch (error) {
        next(error);
    }
});
const getOrderHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderNumber = req.params.orderNumber;
        const data = yield order_service_1.OrderServices.orderHistoryByOrderNumber(orderNumber);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "order history retrived successfully",
            data: data,
        });
    }
    catch (error) {
        next(error);
    }
});
const toggleOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const order = yield order_service_1.OrderServices.changeOrderStatus(id, req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "order status changed successfully",
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
});
const trackByOrderNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderNumber } = req.body;
        const orderInfo = yield order_service_1.OrderServices.trackByOrderNumber(orderNumber);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "Data retrived successfully",
            data: orderInfo,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.OrderControllers = {
    createPaymentIntent,
    createOrder,
    getAllOrders,
    getFilteredOrders,
    changePaymentOrderStatus,
    getOrderHistory,
    toggleOrderStatus,
    trackByOrderNumber,
};
