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
exports.toggleOrderStatus = exports.getOrderHistory = exports.stripeWebhookHandler = exports.changePaymentOrderStatus = exports.getFilteredOrders = exports.getAllOrders = exports.createOrderController = exports.createPaymentIntent = void 0;
const order_service_1 = require("./order.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const order_model_1 = require("./order.model");
const stripe_1 = require("../../config/stripe");
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
        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createPaymentIntent = createPaymentIntent;
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
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createOrderController = createOrderController;
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, order_service_1.getAllOrder)(req.query);
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
exports.getAllOrders = getAllOrders;
const getFilteredOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, order_service_1.filteredOrders)(req.query);
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
exports.getFilteredOrders = getFilteredOrders;
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
    catch (error) {
        next(error);
    }
});
exports.changePaymentOrderStatus = changePaymentOrderStatus;
const stripeWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("Stripe webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const payment = yield payment_model_1.Payment.findOne({ transactionId: paymentIntent.id });
        if (payment) {
            payment.status = payment_interface_1.PAYMENT_STATUS.PAID;
            yield payment.save();
            // Also update order status to CONFIRMED, push to statusHistory
            const order = yield order_model_1.Order.findById(payment.order);
            if (order) {
                order.status = "CONFIRMED";
                order.statusHistory.push({
                    status: "CONFIRMED",
                    updatedAt: new Date().toISOString(),
                });
                yield order.save();
            }
        }
    }
    res.status(200).json({ received: true });
});
exports.stripeWebhookHandler = stripeWebhookHandler;
const getOrderHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const data = yield (0, order_service_1.orderHistoryById)(orderId);
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
exports.getOrderHistory = getOrderHistory;
const toggleOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const order = yield (0, order_service_1.changeOrderStatus)(id, req.body);
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
exports.toggleOrderStatus = toggleOrderStatus;
