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
exports.changeOrderStatus = exports.filteredOrders = exports.getAllOrder = exports.orderHistoryById = exports.updatePaymentOrderStatus = exports.createOrder = void 0;
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
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const generateOrderNumber = () => {
    return `KPG-${Date.now()}`;
};
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const transactionId = getTransactionId();
    const session = yield order_model_1.Order.startSession();
    session.startTransaction();
    try {
        let subtotal = 0;
        let preparedItems = [];
        for (const orderItem of payload.orderItems) {
            const menuItem = yield menuItem_model_1.MenuItem.findById(orderItem.menuItemId).lean();
            if (!menuItem)
                throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Menu item ${orderItem.menuItemId} not found.`);
            let basePrice = menuItem.price;
            let primaryOptPrice = 0;
            if (orderItem.primaryOption) {
                const foundOpt = menuItem.primaryOption.options.find((opt) => opt.name === orderItem.primaryOption.name);
                basePrice = primaryOptPrice = (_a = foundOpt === null || foundOpt === void 0 ? void 0 : foundOpt.price) !== null && _a !== void 0 ? _a : 0;
            }
            // Prepare secondaryOptions with individual prices
            let secondaryOptionsWithPrice = undefined;
            let secondaryTotal = 0;
            if (orderItem.secondaryOptions && menuItem.secondaryOptions) {
                secondaryOptionsWithPrice = orderItem.secondaryOptions.map((so) => {
                    var _a, _b, _c, _d;
                    const foundSecondary = (_a = menuItem === null || menuItem === void 0 ? void 0 : menuItem.secondaryOptions) === null || _a === void 0 ? void 0 : _a.find((ms) => ms.name === so.name);
                    const optPrice = (_d = (_c = (_b = foundSecondary === null || foundSecondary === void 0 ? void 0 : foundSecondary.options.find((opt) => opt.name === so.name)) === null || _b === void 0 ? void 0 : _b.price) !== null && _c !== void 0 ? _c : so.price) !== null && _d !== void 0 ? _d : 0;
                    secondaryTotal += optPrice;
                    return Object.assign(Object.assign({}, so), { price: optPrice });
                });
            }
            // Prepare addons with individual prices
            let addonsWithPrice = undefined;
            let addonsTotal = 0;
            if (orderItem.addons && menuItem.addons) {
                addonsWithPrice = orderItem.addons.map((addon) => {
                    var _a, _b, _c;
                    const foundAddon = (_a = menuItem === null || menuItem === void 0 ? void 0 : menuItem.addons) === null || _a === void 0 ? void 0 : _a.find((ma) => ma.name === addon.name);
                    const addonPrice = (_c = (_b = foundAddon === null || foundAddon === void 0 ? void 0 : foundAddon.price) !== null && _b !== void 0 ? _b : addon.price) !== null && _c !== void 0 ? _c : 0;
                    addonsTotal += addonPrice;
                    return Object.assign(Object.assign({}, addon), { price: addonPrice });
                });
            }
            const totalPrice = (basePrice + secondaryTotal + addonsTotal) * orderItem.quantity;
            subtotal += totalPrice;
            preparedItems.push(Object.assign(Object.assign({}, orderItem), { name: menuItem.name, basePrice, primaryOption: Object.assign(Object.assign({}, orderItem.primaryOption), { price: primaryOptPrice }), secondaryOptions: secondaryOptionsWithPrice, addons: addonsWithPrice, totalPrice }));
        }
        let deliveryFee = 0;
        if (payload.orderType === order_interface_1.OrderType.DELIVERY)
            deliveryFee = 5; // adjust as needed
        const tip = (_b = payload.tip) !== null && _b !== void 0 ? _b : 0;
        let discount = 0;
        // Valid coupon application
        if (payload.couponCode) {
            const coupon = yield coupons_model_1.Coupon.findOne({
                code: payload.couponCode,
                active: true,
                validFrom: { $lte: new Date() },
                validTo: { $gte: new Date() },
                $or: [{ usageLimit: null }, { usageLimit: { $gt: 0 } }],
            });
            if (!coupon) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Invalid coupon code");
            }
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
        const TAX_RATE = 0.0875; //assume
        const tax = Number(((subtotal - discount) * TAX_RATE).toFixed(2));
        const total = Number((subtotal - discount + deliveryFee + tax + tip).toFixed(2));
        const orderNumber = generateOrderNumber();
        //handling STATUS
        /**
         * CASH-> PAYMENT (UNPAID) -> PAYMENT STATUS UPDATED TO PAID MANUALLY
         * CARD ->
         */
        // Prepare initial payment status and order status
        let paymentStatus = payment_interface_1.PAYMENT_STATUS.UNPAID;
        let orderStatus = "PENDING";
        if (payload.paymentMethod === order_interface_1.PAYMENT_METHOD.CASH) {
            paymentStatus = payment_interface_1.PAYMENT_STATUS.UNPAID;
            orderStatus = "CONFIRMED";
        }
        //order history
        const statusHistory = [
            {
                status: "PENDING",
                updatedAt: new Date().toISOString(),
            },
            ...(orderStatus === "CONFIRMED"
                ? [
                    {
                        status: "CONFIRMED",
                        updatedAt: new Date().toISOString(),
                    },
                ]
                : []),
        ];
        // Prepare Payment doc
        const paymentDocArr = yield payment_model_1.Payment.create([
            {
                order: undefined, // will link after
                transactionId, // temp
                amount: total,
                status: paymentStatus,
                paymentMethod: payload.paymentMethod,
            },
        ], { session });
        let paymentDoc = paymentDocArr[0];
        // Create Order doc
        const orderDocArr = yield order_model_1.Order.create([
            Object.assign(Object.assign({}, payload), { orderNumber, orderItems: preparedItems, subtotal: Number(subtotal.toFixed(2)), deliveryFee,
                tax,
                tip,
                discount,
                total, status: orderStatus, statusHistory, payment: paymentDoc._id }),
        ], { session });
        let orderDoc = orderDocArr[0];
        // Link payment -> order
        yield payment_model_1.Payment.findByIdAndUpdate(paymentDoc._id, { order: orderDoc._id }, { session });
        // Stripe PaymentIntent Logic
        let clientSecret = undefined;
        let updatedPaymentDoc = paymentDoc;
        if (payload.paymentMethod === order_interface_1.PAYMENT_METHOD.CARD) {
            const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
                amount: Math.round(total * 100),
                currency: "usd",
                payment_method_types: ["card"],
                metadata: { transactionId },
                receipt_email: payload.customerEmail || undefined,
            });
            const updatedPayment = yield payment_model_1.Payment.findByIdAndUpdate(paymentDoc._id, {
                transactionId: transactionId,
                paymentIntentId: paymentIntent.id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
            }, { new: true, session });
            if (!updatedPayment) {
                throw new Error("Failed to update payment document with PaymentIntent info");
            }
            updatedPaymentDoc = updatedPayment;
            clientSecret = (_c = paymentIntent.client_secret) !== null && _c !== void 0 ? _c : undefined;
        }
        // Commit and close session **before reading order again**
        yield session.commitTransaction();
        session.endSession();
        // Now fetch the latest versions OUTSIDE THE SESSION if you want to ensure all is saved.
        const latestOrder = yield order_model_1.Order.findById(orderDoc._id);
        const latestPayment = yield payment_model_1.Payment.findById(paymentDoc._id);
        // if (latestOrder && latestOrder.customerEmail) {
        //   try {
        //     await sendEmail({
        //       to: latestOrder.customerEmail,
        //       subject: `Your Order Confirmation: ${latestOrder.orderNumber}`,
        //       templateName: "order", // Name of your .ejs file (without .ejs)
        //       templateData: {
        //         customerName: latestOrder.customerName,
        //         orderNumber: latestOrder.orderNumber,
        //         orderDateTime: new Date().toLocaleString("en-US", {
        //           timeZone: "Asia/Dhaka",
        //         }),
        //         orderType: latestOrder.orderType,
        //         deliveryAddress: latestOrder.deliveryAddress,
        //         specialInstructions: latestOrder.specialInstructions,
        //         status: latestOrder.status,
        //         orderItems: latestOrder.orderItems,
        //         subtotal: latestOrder.subtotal,
        //         deliveryFee: latestOrder.deliveryFee || 0,
        //         tip: latestOrder.tip || 0,
        //         discount: latestOrder.discount || 0,
        //         tax: latestOrder.tax,
        //         total: latestOrder.total,
        //         couponCode: latestOrder.couponCode,
        //       },
        //     });
        //   } catch (emailError: any) {
        //     // Log, but don't block order completion
        //     console.error(
        //       "Order confirmation email failed:",
        //       emailError?.message || emailError
        //     );
        //   }
        // }
        // Return freshest docs
        return {
            order: latestOrder !== null && latestOrder !== void 0 ? latestOrder : orderDoc,
            payment: (_d = latestPayment !== null && latestPayment !== void 0 ? latestPayment : updatedPaymentDoc) !== null && _d !== void 0 ? _d : paymentDoc,
            clientSecret,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.createOrder = createOrder;
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
exports.updatePaymentOrderStatus = updatePaymentOrderStatus;
const orderHistoryById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order id not found");
    }
    const sortedStatusHistory = order.statusHistory
        .slice()
        .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    return {
        orderNumber: order.orderNumber,
        statusHistory: sortedStatusHistory,
    };
});
exports.orderHistoryById = orderHistoryById;
const getAllOrder = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find(query);
    return orders;
});
exports.getAllOrder = getAllOrder;
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
    const orders = yield order_model_1.Order.find(filter).sort({ createdAt: -1 });
    return orders;
});
exports.filteredOrders = filteredOrders;
const changeOrderStatus = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order id not found");
    }
    if (payload.status === "CONFIRMED") {
        order.status = payload.status;
        order.statusHistory.push({
            status: payload.status,
            updatedAt: new Date().toISOString(),
        });
        const payment = yield payment_model_1.Payment.findById(order.payment);
        if (!payment) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment not received");
        }
        payment.status = payment_interface_1.PAYMENT_STATUS.PAID;
        payment.save();
    }
    else {
        order.status = payload.status;
        order.statusHistory.push({
            status: payload.status,
            updatedAt: new Date().toISOString(),
        });
    }
    order.save();
    return { order: order.statusHistory };
});
exports.changeOrderStatus = changeOrderStatus;
