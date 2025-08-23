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
const env_1 = require("../../config/env");
const sendMail_1 = require("../../utils/sendMail");
// POST /orders/payment-intent
const createPaymentIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderinfo = yield order_service_1.OrderServices.calulateOrderAmount(req.body);
        const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
            amount: Number(Math.round(Number(orderinfo.total) * 100).toFixed(2)),
            currency: "usd",
            payment_method_types: ["card"],
            metadata: { tempId: Date.now().toString() },
            receipt_email: orderinfo.customerEmail,
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
//stripe webhook
const stripeWebhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sig = req.headers["stripe-signature"] || "";
    const webhookSecret = env_1.envVars.STRIPE_WEBHOOK_SECRET;
    if (!sig || !webhookSecret) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .send("Missing stripe-signature or webhook secret");
    }
    if (!Buffer.isBuffer(req.body)) {
        return res
            .status(400)
            .send("Body is not raw Buffer. Check express.raw placement.");
    }
    let event;
    try {
        // req.body is a Buffer because of express.raw
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error("Error verifying webhook signature:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        let orderNumber = "";
        if (event.type === "payment_intent.succeeded") {
            const stripeObject = event.data.object;
            const { metadata } = stripeObject;
            orderNumber = metadata === null || metadata === void 0 ? void 0 : metadata.orderNumber;
            if (orderNumber) {
                yield order_service_1.OrderServices.updatePaymentOrderStatus(orderNumber);
                const orderDetails = yield order_service_1.OrderServices.trackByOrderNumber(orderNumber);
                const TrackOrder = `${env_1.envVars.URL}/track-order?orderNumber=${orderNumber}`;
                yield (0, sendMail_1.sendEmail)({
                    to: orderDetails.customerEmail,
                    subject: `Order Confirmation - Koyla Pizza Grill #${orderNumber}`,
                    templateName: "order",
                    templateData: {
                        customerName: orderDetails.customerName,
                        orderNumber,
                        orderDateTime: new Date().toLocaleString("en-US"),
                        orderItems: orderDetails.orderItems,
                        subtotal: Number(orderDetails.subtotal),
                        deliveryFee: Number(orderDetails.deliveryCharge),
                        tip: Number(orderDetails.tip),
                        discount: Number(orderDetails.discount),
                        tax: Number(orderDetails.tax),
                        total: Number(orderDetails.total.toFixed(2)),
                        orderType: orderDetails.orderType,
                        deliveryAddress: (_a = orderDetails.deliveryAddress) !== null && _a !== void 0 ? _a : "",
                        specialInstructions: (_b = orderDetails.specialInstructions) !== null && _b !== void 0 ? _b : "",
                        status: "CONFIRMED",
                        TrackOrder,
                    },
                });
            }
            (0, sendResponse_1.sendResponse)(res, {
                success: true,
                statusCode: http_status_codes_1.default.OK,
                message: "Payment succeeded",
                data: null,
            });
        }
        else if (event.type === "payment_intent.payment_failed") {
            const stripeObject = event.data.object;
            const { metadata } = stripeObject;
            orderNumber = metadata === null || metadata === void 0 ? void 0 : metadata.orderNumber;
            yield order_service_1.OrderServices.deleteOrderByOrderNumber(orderNumber);
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
                message: "Payment failed",
                data: null,
            });
        }
    }
    catch (err) {
        console.error("Webhook handler error:", err);
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            message: "Webhook handler error",
            data: null,
        });
    }
});
//delete order by orderNumber
const deleteOrderByOrderNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderNumber } = req.params;
        const response = yield order_service_1.OrderServices.deleteOrderByOrderNumber(orderNumber);
        console.log(response);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Order deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
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
        const paymentInfo = yield order_service_1.OrderServices.updatePaymentOrderStatus(req.params.orderNumber);
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
    stripeWebhook,
    deleteOrderByOrderNumber,
};
