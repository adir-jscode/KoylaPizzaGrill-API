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
exports.OrderServices = void 0;
const stripe_1 = require("../../config/stripe");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const coupons_interface_1 = require("../coupons/coupons.interface");
const coupons_model_1 = require("../coupons/coupons.model");
const menuItem_model_1 = require("../menuItem/menuItem.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const order_interface_1 = require("./order.interface");
const order_model_1 = require("./order.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const date_fns_1 = require("date-fns");
const restaurantSettings_model_1 = require("../restaurantSettings/restaurantSettings.model");
const otp_service_1 = require("../otp/otp.service");
const sendMail_1 = require("../../utils/sendMail");
const crypto_1 = __importDefault(require("crypto"));
const coupons_service_1 = require("../coupons/coupons.service");
const env_1 = require("../../config/env");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const generateOrderNumber = (length = 6) => {
    const randomNum = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length);
    return `KPG-${randomNum}`;
};
const updatePaymentOrderStatus = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order id not found");
    }
    order.status = "CONFIRMED";
    order.statusHistory.push({
        status: "CONFIRMED",
        updatedAt: new Date().toISOString(),
    });
    order.save();
    const payment = yield payment_model_1.Payment.findById(order.payment);
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment not received");
    }
    payment.status = payment_interface_1.PAYMENT_STATUS.PAID;
    payment.save();
    return payment;
});
const orderHistoryByOrderNumber = (orderNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findOne({ orderNumber });
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order number not found");
    }
    const sortedStatusHistory = order.statusHistory
        .slice()
        .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    return {
        orderNumber: order.orderNumber,
        statusHistory: sortedStatusHistory,
    };
});
const getAllOrder = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find(query);
    return orders;
});
const filteredOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    // Parse date filters if provided
    let startDate;
    let endDate;
    if (query.startDate) {
        startDate = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(query.startDate));
    }
    if (query.endDate) {
        endDate = (0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(query.endDate));
    }
    if (startDate && endDate) {
        filter.createdAt = { $gte: startDate, $lte: endDate };
    }
    else if (startDate) {
        filter.createdAt = { $gte: startDate };
    }
    else if (endDate) {
        filter.createdAt = { $lte: endDate };
    }
    else {
        // No dates passed, filter for today by default
        filter.createdAt = {
            $gte: (0, date_fns_1.startOfDay)(new Date()),
            $lte: (0, date_fns_1.endOfDay)(new Date()),
        };
    }
    // Optional: additional filters
    if (query.status) {
        filter.status = query.status.toUpperCase(); // assuming stored as uppercase
    }
    if (query.customerName) {
        // Case-insensitive partial match
        filter.customerName = { $regex: query.customerName, $options: "i" };
    }
    // Fetch and sort descending by creation
    const orders = yield order_model_1.Order.find(filter)
        .sort({ createdAt: -1 })
        .populate("payment");
    return orders;
});
const changeOrderStatus = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order id not found");
    }
    const updatedOrder = yield order_model_1.Order.findByIdAndUpdate(orderId, {
        status: payload.status,
        $push: {
            statusHistory: {
                status: payload.status,
                updatedAt: new Date().toISOString(),
            },
        },
    }, { new: true }).populate("payment");
    return { order: updatedOrder };
});
const calulateOrderAmount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        console.log("payload from front", payload);
        let subtotal = 0;
        let preparedItems = [];
        // Calculate item prices and prepare items for order
        for (const orderItem of payload.orderItems) {
            const menuItem = yield menuItem_model_1.MenuItem.findById(orderItem.menuItemId).lean();
            if (!menuItem)
                throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Menu item ${orderItem.menuItemId} not found.`);
            // Base price from menu item
            let basePrice = (_a = orderItem.basePrice) !== null && _a !== void 0 ? _a : 0;
            // Primary option price
            let primaryOptPrice = 0;
            if (orderItem.primaryOption) {
                basePrice = (_b = orderItem.primaryOption) === null || _b === void 0 ? void 0 : _b.price;
            }
            // Secondary options with individual prices and totals
            let secondaryOptionsWithPrice = undefined;
            let secondaryTotal = 0;
            if (orderItem.secondaryOptions && menuItem.secondaryOptions) {
                secondaryOptionsWithPrice = orderItem.secondaryOptions.map((so) => {
                    var _a, _b, _c, _d;
                    const foundSecondary = (_a = menuItem.secondaryOptions) === null || _a === void 0 ? void 0 : _a.find((ms) => ms.name === so.name);
                    const optPrice = (_d = (_c = (_b = foundSecondary === null || foundSecondary === void 0 ? void 0 : foundSecondary.options.find((opt) => opt.name === so.name)) === null || _b === void 0 ? void 0 : _b.price) !== null && _c !== void 0 ? _c : so.price) !== null && _d !== void 0 ? _d : 0;
                    secondaryTotal += optPrice;
                    return Object.assign(Object.assign({}, so), { price: optPrice });
                });
            }
            // Addons with individual prices and totals
            let addonsWithPrice = undefined;
            let addonsTotal = 0;
            if (orderItem.addons && menuItem.addons) {
                addonsWithPrice = orderItem.addons.map((addon) => {
                    var _a, _b, _c;
                    const foundAddon = (_a = menuItem.addons) === null || _a === void 0 ? void 0 : _a.find((ma) => ma.name === addon.name);
                    const addonPrice = (_c = (_b = foundAddon === null || foundAddon === void 0 ? void 0 : foundAddon.price) !== null && _b !== void 0 ? _b : addon.price) !== null && _c !== void 0 ? _c : 0;
                    addonsTotal += addonPrice;
                    return Object.assign(Object.assign({}, addon), { price: addonPrice });
                });
            }
            // Calculate total price for this order item (including quantity)
            console.log(basePrice);
            console.log(secondaryTotal);
            console.log(addonsTotal);
            const totalPrice = (basePrice + secondaryTotal + addonsTotal) * orderItem.quantity;
            subtotal += totalPrice;
            console.log(totalPrice);
            console.log("subtotal", subtotal);
            // Push prepared item to array
            preparedItems.push(Object.assign(Object.assign({}, orderItem), { name: menuItem.name, basePrice, primaryOption: Object.assign(Object.assign({}, orderItem.primaryOption), { price: basePrice }), secondaryOptions: secondaryOptionsWithPrice, addons: addonsWithPrice, totalPrice }));
        }
        // Calculate delivery fee
        console.log("payload delivery charge = ", payload.deliveryCharge);
        const deliveryFee = payload.orderType === order_interface_1.OrderType.DELIVERY
            ? payload.deliveryCharge
            : 0;
        const tip = (_c = payload.tip) !== null && _c !== void 0 ? _c : 0;
        let discount = 0;
        // Apply coupon discount if valid
        if (payload.couponCode) {
            const coupon = yield coupons_model_1.Coupon.findOne({
                code: payload.couponCode,
                active: true,
                validFrom: { $lte: new Date() },
                validTo: { $gte: new Date() },
                $or: [{ usageLimit: null }, { usageLimit: { $gt: 0 } }],
            });
            if (!coupon || coupon.usedCount === coupon.usageLimit)
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Invalid coupon code");
            if (coupon && subtotal >= coupon.minOrder) {
                if (coupon.type === coupons_interface_1.Type.PERCENTAGE) {
                    discount = subtotal * (coupon.value / 100);
                    if (coupon.maxDiscount)
                        discount = Math.min(discount, coupon.maxDiscount);
                }
                else {
                    discount = coupon.value;
                }
            }
        }
        discount = Math.max(discount, 0);
        const settings = yield restaurantSettings_model_1.RestaurantSettings.findOne();
        const TAX_RATE = settings === null || settings === void 0 ? void 0 : settings.taxRate;
        const tax = Number((((subtotal - discount) / 100) * TAX_RATE).toFixed(2));
        // Calculate grand total
        console.log("discount = ", discount);
        console.log("delivery fee =", deliveryFee);
        console.log("tex =", tax);
        console.log("tip =", tip);
        const total = Number((subtotal - discount + deliveryFee + tax + tip).toFixed(2));
        const customerEmail = payload.customerEmail;
        const isScheduled = payload.isScheduled;
        const scheduledTime = payload.scheduledTime;
        console.log("grand total = ", total);
        return {
            customerEmail,
            total,
            preparedItems,
            subtotal,
            discount,
            deliveryFee,
            tax,
            tip,
            isScheduled,
            scheduledTime,
        };
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "calculation error");
    }
});
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session = yield order_model_1.Order.startSession();
    let transactionCommitted = false;
    yield session.startTransaction();
    try {
        const orderNumber = generateOrderNumber();
        const transactionId = getTransactionId();
        let orderDoc;
        let paymentDoc;
        let paymentStatus = payment_interface_1.PAYMENT_STATUS.UNPAID;
        const calculation = yield calulateOrderAmount(payload);
        let orderStatus = "CONFIRMED";
        if (payload.paymentMethod === order_interface_1.PAYMENT_METHOD.CASH) {
            paymentStatus = payment_interface_1.PAYMENT_STATUS.UNPAID;
        }
        // --- Order status history ---
        const statusHistory = [
            {
                status: "CONFIRMED",
                updatedAt: new Date().toISOString(),
            },
        ];
        // CARD PAYMENT
        // let paymentDoc: IPayment & Document;
        // let orderDoc: IOrder & Document;
        const { paymentIntentId } = payload;
        if (payload.paymentMethod === order_interface_1.PAYMENT_METHOD.CARD && paymentIntentId) {
            if (!paymentIntentId) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Missing paymentIntentId for card payment");
            }
            // Retrieve and check intent status
            const paymentIntent = yield stripe_1.stripe.paymentIntents.retrieve(paymentIntentId);
            console.log(paymentIntent);
            if (paymentIntent.status !== "succeeded") {
                throw new AppError_1.default(http_status_codes_1.default.PAYMENT_REQUIRED, "Stripe payment not completed");
            }
            // Await Payment.create and then get first document
            const paymentDocs = yield payment_model_1.Payment.create([
                {
                    order: undefined,
                    transactionId,
                    paymentIntentId,
                    amount: Number(calculation.total.toFixed(2)),
                    status: payment_interface_1.PAYMENT_STATUS.PAID,
                    paymentMethod: order_interface_1.PAYMENT_METHOD.CARD,
                },
            ], { session });
            paymentDoc = paymentDocs[0]; // <-- correctly accessed after await
            // Await Order.create and get first document
            const orderDocs = yield order_model_1.Order.create([
                Object.assign(Object.assign({}, payload), { orderNumber, orderItems: calculation.preparedItems, subtotal: Number(calculation.subtotal.toFixed(2)), deliveryCharge: Number(calculation.deliveryFee.toFixed(2)), tax: Number(calculation.tax.toFixed(2)), tip: Number(calculation.tip.toFixed(2)), scheduledTime: calculation.isScheduled
                        ? calculation.scheduledTime
                        : undefined, discount: Number(calculation.discount.toFixed(2)), total: Number(calculation.total.toFixed(2)), status: "CONFIRMED", statusHistory: [
                        { status: "PENDING", updatedAt: new Date().toISOString() },
                        { status: "CONFIRMED", updatedAt: new Date().toISOString() },
                    ], payment: paymentDoc._id }),
            ], { session });
            orderDoc = orderDocs[0];
            yield payment_model_1.Payment.findByIdAndUpdate(paymentDoc._id, { order: orderDoc._id }, { session });
            const TrackOrder = `${env_1.envVars.VERCEL_URL}track-order?orderNumber=${orderNumber}`;
            yield (0, sendMail_1.sendEmail)({
                to: payload.customerEmail,
                subject: `Order Confirmation - Koyla Pizza Grill #${orderNumber}`,
                templateName: "order", // Match your template file name here
                templateData: {
                    customerName: payload.customerName,
                    orderNumber: orderNumber,
                    orderDateTime: new Date().toLocaleString("en-US"),
                    orderItems: calculation.preparedItems,
                    subtotal: Number(calculation.subtotal),
                    deliveryFee: Number(calculation.deliveryFee),
                    tip: Number(calculation.tip),
                    discount: Number(calculation.discount),
                    tax: Number(calculation.tax),
                    total: Number(calculation.total.toFixed(2)),
                    orderType: payload.orderType,
                    deliveryAddress: (_a = payload.deliveryAddress) !== null && _a !== void 0 ? _a : "",
                    specialInstructions: (_b = payload.specialInstructions) !== null && _b !== void 0 ? _b : "",
                    status: "CONFIRMED",
                    TrackOrder: TrackOrder,
                },
            });
        }
        // CASH PAYMENT FLOW
        if (payload.paymentMethod === order_interface_1.PAYMENT_METHOD.CASH) {
            yield otp_service_1.OtpServices.verifyOtp(payload.customerEmail, payload.otp);
            const paymentDocs = yield payment_model_1.Payment.create([
                {
                    order: undefined,
                    transactionId: transactionId,
                    amount: Number(calculation.total.toFixed(2)),
                    status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                    paymentMethod: order_interface_1.PAYMENT_METHOD.CASH,
                },
            ], { session });
            paymentDoc = paymentDocs[0];
            const orderDocs = yield order_model_1.Order.create([
                Object.assign(Object.assign({}, payload), { orderNumber, orderItems: calculation.preparedItems, subtotal: Number(calculation.subtotal.toFixed(2)), deliveryCharge: calculation.deliveryFee, tax: calculation.tax, tip: calculation.tip, discount: calculation.discount, total: Number(calculation.total.toFixed(2)), status: orderStatus, statusHistory: [
                        { status: "PENDING", updatedAt: new Date().toISOString() },
                        { status: "CONFIRMED", updatedAt: new Date().toISOString() },
                    ], payment: paymentDoc._id }),
            ], { session });
            orderDoc = orderDocs[0];
            yield payment_model_1.Payment.findByIdAndUpdate(paymentDoc._id, { order: orderDoc._id }, { session });
        }
        yield session.commitTransaction();
        transactionCommitted = true;
        session.endSession();
        const latestOrder = yield order_model_1.Order.findById(orderDoc === null || orderDoc === void 0 ? void 0 : orderDoc._id);
        const latestPayment = yield payment_model_1.Payment.findById(paymentDoc === null || paymentDoc === void 0 ? void 0 : paymentDoc._id);
        if (payload.couponCode) {
            yield coupons_service_1.CouponServices.updateCouponCount(payload.couponCode);
        }
        return {
            order: latestOrder !== null && latestOrder !== void 0 ? latestOrder : orderDoc,
            payment: latestPayment !== null && latestPayment !== void 0 ? latestPayment : paymentDoc,
        };
    }
    catch (error) {
        if (!transactionCommitted) {
            yield session.abortTransaction();
        }
        session.endSession();
        throw error;
    }
});
const trackByOrderNumber = (orderNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findOne({ orderNumber }).select("-payment");
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "order not found");
    }
    return order;
});
exports.OrderServices = {
    createOrder,
    trackByOrderNumber,
    filteredOrders,
    getAllOrder,
    changeOrderStatus,
    updatePaymentOrderStatus,
    orderHistoryByOrderNumber,
    calulateOrderAmount,
};
