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
exports.createOrder = exports.changeOrderStatus = exports.filteredOrders = exports.getAllOrder = exports.orderHistoryById = exports.updatePaymentOrderStatus = void 0;
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
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const generateOrderNumber = () => {
    return `KPG-${Date.now()}`;
};
// export const createOrder = async (
//   payload: IOrder & { paymentMethod: PAYMENT_METHOD }
// ) => {
//   const transactionId = getTransactionId();
//   const session = await Order.startSession();
//   console.log(payload);
//   session.startTransaction();
//   try {
//     let subtotal = 0;
//     let preparedItems: IOrderItem[] = [];
//     for (const orderItem of payload.orderItems) {
//       const menuItem = await MenuItem.findById(orderItem.menuItemId).lean();
//       if (!menuItem)
//         throw new AppError(
//           httpStatus.NOT_FOUND,
//           `Menu item ${orderItem.menuItemId} not found.`
//         );
//       let basePrice = menuItem.price;
//       let primaryOptPrice = 0;
//       if (orderItem.primaryOption) {
//         const foundOpt = menuItem.primaryOption.options.find(
//           (opt) => opt.name === orderItem.primaryOption.name
//         );
//         basePrice = primaryOptPrice = foundOpt?.price ?? 0;
//       }
//       // Prepare secondaryOptions with individual prices
//       let secondaryOptionsWithPrice: typeof orderItem.secondaryOptions =
//         undefined;
//       let secondaryTotal = 0;
//       if (orderItem.secondaryOptions && menuItem.secondaryOptions) {
//         secondaryOptionsWithPrice = orderItem.secondaryOptions.map((so) => {
//           const foundSecondary = menuItem?.secondaryOptions?.find(
//             (ms) => ms.name === so.name
//           );
//           const optPrice =
//             foundSecondary?.options.find((opt) => opt.name === so.name)
//               ?.price ??
//             so.price ??
//             0;
//           secondaryTotal += optPrice;
//           return { ...so, price: optPrice };
//         });
//       }
//       // Prepare addons with individual prices
//       let addonsWithPrice: typeof orderItem.addons = undefined;
//       let addonsTotal = 0;
//       if (orderItem.addons && menuItem.addons) {
//         addonsWithPrice = orderItem.addons.map((addon) => {
//           const foundAddon = menuItem?.addons?.find(
//             (ma) => ma.name === addon.name
//           );
//           const addonPrice = foundAddon?.price ?? addon.price ?? 0;
//           addonsTotal += addonPrice;
//           return { ...addon, price: addonPrice };
//         });
//       }
//       const totalPrice =
//         (basePrice + secondaryTotal + addonsTotal) * orderItem.quantity;
//       subtotal += totalPrice;
//       preparedItems.push({
//         ...orderItem,
//         name: menuItem.name,
//         basePrice,
//         primaryOption: {
//           ...orderItem.primaryOption,
//           price: primaryOptPrice,
//         },
//         secondaryOptions: secondaryOptionsWithPrice,
//         addons: addonsWithPrice,
//         totalPrice,
//       });
//     }
//     let deliveryFee = 0;
//     if (payload.orderType === OrderType.DELIVERY) deliveryFee = 5; // adjust as needed
//     const tip = payload.tip ?? 0;
//     let discount = 0;
//     // Valid coupon application
//     if (payload.couponCode) {
//       const coupon = await Coupon.findOne({
//         code: payload.couponCode,
//         active: true,
//         validFrom: { $lte: new Date() },
//         validTo: { $gte: new Date() },
//         $or: [{ usageLimit: null }, { usageLimit: { $gt: 0 } }],
//       });
//       if (!coupon) {
//         throw new AppError(httpStatus.FORBIDDEN, "Invalid coupon code");
//       }
//       if (coupon && subtotal >= coupon.minOrder) {
//         if (coupon.type === Type.PERCENTAGE) {
//           discount = subtotal * (coupon.value / 100);
//           if (coupon.maxDiscount)
//             discount = Math.min(discount, coupon.maxDiscount);
//         } else {
//           discount = coupon.value;
//         }
//       }
//     }
//     discount = Math.max(discount, 0);
//     const settings = await RestaurantSettings.findOne();
//     const TAX_RATE = (settings?.taxRate as number) / 100;
//     const tax = Number(((subtotal - discount) * TAX_RATE).toFixed(2));
//     const total = Number(
//       (subtotal - discount + deliveryFee + tax + tip).toFixed(2)
//     );
//     const orderNumber = generateOrderNumber();
//     let paymentStatus = PAYMENT_STATUS.UNPAID;
//     let orderStatus: IStatusHistory["status"] = "PENDING";
//     if (payload.paymentMethod === PAYMENT_METHOD.CASH) {
//       paymentStatus = PAYMENT_STATUS.UNPAID;
//       orderStatus = "CONFIRMED";
//     }
//     //order history
//     const statusHistory: IStatusHistory[] = [
//       {
//         status: "PENDING" as IStatusHistory["status"],
//         updatedAt: new Date().toISOString(),
//       },
//       ...(orderStatus === "CONFIRMED"
//         ? [
//             {
//               status: "CONFIRMED" as IStatusHistory["status"],
//               updatedAt: new Date().toISOString(),
//             },
//           ]
//         : []),
//     ];
//     // Prepare Payment doc
//     const paymentDocArr = await Payment.create(
//       [
//         {
//           order: undefined, // will link after
//           transactionId, // temp
//           amount: total,
//           status: paymentStatus,
//           paymentMethod: payload.paymentMethod,
//         },
//       ],
//       { session }
//     );
//     let paymentDoc = paymentDocArr[0];
//     // Create Order doc
//     const orderDocArr = await Order.create(
//       [
//         {
//           ...payload,
//           orderNumber,
//           orderItems: preparedItems,
//           subtotal: Number(subtotal.toFixed(2)),
//           deliveryFee,
//           tax,
//           tip,
//           discount,
//           total,
//           status: orderStatus,
//           statusHistory,
//           payment: paymentDoc._id,
//         },
//       ],
//       { session }
//     );
//     let orderDoc = orderDocArr[0];
//     // Link payment -> order
//     await Payment.findByIdAndUpdate(
//       paymentDoc._id,
//       { order: orderDoc._id },
//       { session }
//     );
//     // Stripe PaymentIntent Logic
//     let clientSecret: string | undefined = undefined;
//     let updatedPaymentDoc = paymentDoc;
//     const { paymentIntentId } = payload;
//     if (payload.paymentMethod === PAYMENT_METHOD.CARD && paymentIntentId) {
//       const paymentIntent = await stripe.paymentIntents.retrieve(
//         paymentIntentId as string
//       );
//       if (paymentIntent.status !== "succeeded") {
//         throw new AppError(
//           httpStatus.PAYMENT_REQUIRED,
//           "Payment not completed"
//         );
//       }
//       const updatedPayment = await Payment.findByIdAndUpdate(
//         paymentDoc._id,
//         {
//           transactionId: transactionId,
//           paymentIntentId: paymentIntent,
//           status: PAYMENT_STATUS.UNPAID,
//         },
//         { new: true, session }
//       );
//       if (!updatedPayment) {
//         throw new Error(
//           "Failed to update payment document with PaymentIntent info"
//         );
//       }
//       updatedPaymentDoc = updatedPayment;
//       //clientSecret = paymentIntent?.client_secret ?? undefined;
//     }
//     // Commit and close session **before reading order again**
//     await session.commitTransaction();
//     session.endSession();
//     // Now fetch the latest versions OUTSIDE THE SESSION if you want to ensure all is saved.
//     const latestOrder = await Order.findById(orderDoc._id);
//     const latestPayment = await Payment.findById(paymentDoc._id);
//     // if (latestOrder && latestOrder.customerEmail) {
//     //   try {
//     //     await sendEmail({
//     //       to: latestOrder.customerEmail,
//     //       subject: `Your Order Confirmation: ${latestOrder.orderNumber}`,
//     //       templateName: "order", // Name of your .ejs file (without .ejs)
//     //       templateData: {
//     //         customerName: latestOrder.customerName,
//     //         orderNumber: latestOrder.orderNumber,
//     //         orderDateTime: new Date().toLocaleString("en-US", {
//     //           timeZone: "Asia/Dhaka",
//     //         }),
//     //         orderType: latestOrder.orderType,
//     //         deliveryAddress: latestOrder.deliveryAddress,
//     //         specialInstructions: latestOrder.specialInstructions,
//     //         status: latestOrder.status,
//     //         orderItems: latestOrder.orderItems,
//     //         subtotal: latestOrder.subtotal,
//     //         deliveryFee: latestOrder.deliveryFee || 0,
//     //         tip: latestOrder.tip || 0,
//     //         discount: latestOrder.discount || 0,
//     //         tax: latestOrder.tax,
//     //         total: latestOrder.total,
//     //         couponCode: latestOrder.couponCode,
//     //       },
//     //     });
//     //   } catch (emailError: any) {
//     //     // Log, but don't block order completion
//     //     console.error(
//     //       "Order confirmation email failed:",
//     //       emailError?.message || emailError
//     //     );
//     //   }
//     // }
//     // Return freshest docs
//     return {
//       order: latestOrder ?? orderDoc,
//       payment: latestPayment ?? updatedPaymentDoc ?? paymentDoc,
//       clientSecret,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };
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
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const transactionId = getTransactionId();
    const session = yield order_model_1.Order.startSession();
    session.startTransaction();
    try {
        let subtotal = 0;
        let preparedItems = [];
        // --- Prepare items with correct pricing ---
        for (const orderItem of payload.orderItems) {
            const menuItem = yield menuItem_model_1.MenuItem.findById(orderItem.menuItemId).lean();
            if (!menuItem)
                throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Menu item ${orderItem.menuItemId} not found.`);
            let basePrice = menuItem.price ? menuItem.price : 0;
            let primaryOptPrice = 0;
            if (orderItem.primaryOption) {
                const foundOpt = menuItem.primaryOption.options.find((opt) => opt.name === orderItem.primaryOption.name);
                basePrice = (_a = foundOpt === null || foundOpt === void 0 ? void 0 : foundOpt.price) !== null && _a !== void 0 ? _a : 0;
            }
            // --- Secondary options with individual prices ---
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
            // --- Addons with individual prices ---
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
            const totalPrice = (basePrice + secondaryTotal + addonsTotal) * orderItem.quantity;
            subtotal += totalPrice;
            preparedItems.push(Object.assign(Object.assign({}, orderItem), { name: menuItem.name, basePrice, primaryOption: Object.assign(Object.assign({}, orderItem.primaryOption), { price: primaryOptPrice }), secondaryOptions: secondaryOptionsWithPrice, addons: addonsWithPrice, totalPrice }));
        }
        // --- Other charges and order totals ---
        let deliveryFee = payload.orderType === order_interface_1.OrderType.DELIVERY ? 5 : 0;
        const tip = (_b = payload.tip) !== null && _b !== void 0 ? _b : 0;
        let discount = 0;
        // --- Coupon ---
        if (payload.couponCode) {
            const coupon = yield coupons_model_1.Coupon.findOne({
                code: payload.couponCode,
                active: true,
                validFrom: { $lte: new Date() },
                validTo: { $gte: new Date() },
                $or: [{ usageLimit: null }, { usageLimit: { $gt: 0 } }],
            });
            if (!coupon)
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Invalid coupon code");
            if (subtotal >= coupon.minOrder) {
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
        const TAX_RATE = (settings === null || settings === void 0 ? void 0 : settings.taxRate) / 100;
        const tax = Number(((subtotal - discount) * TAX_RATE).toFixed(2));
        const total = Number((subtotal - discount + deliveryFee + tax + tip).toFixed(2));
        const orderNumber = generateOrderNumber();
        // --- Set statuses ---
        let paymentStatus = payment_interface_1.PAYMENT_STATUS.UNPAID;
        let orderStatus = "PENDING";
        if (payload.paymentMethod === order_interface_1.PAYMENT_METHOD.CASH) {
            paymentStatus = payment_interface_1.PAYMENT_STATUS.UNPAID;
            orderStatus = "CONFIRMED";
        }
        // --- Order status history ---
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
        // --------------------------
        // CARD PAYMENT FLOW
        // --------------------------
        // CARD PAYMENT FLOW
        let paymentDoc;
        let orderDoc;
        const { paymentIntentId } = payload;
        if (payload.paymentMethod === order_interface_1.PAYMENT_METHOD.CARD && paymentIntentId) {
            if (!paymentIntentId) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Missing paymentIntentId for card payment");
            }
            // Retrieve and check intent status
            const paymentIntent = yield stripe_1.stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status !== "succeeded") {
                throw new AppError_1.default(http_status_codes_1.default.PAYMENT_REQUIRED, "Stripe payment not completed");
            }
            // Await Payment.create and then get first document
            const paymentDocs = yield payment_model_1.Payment.create([
                {
                    order: undefined,
                    transactionId,
                    paymentIntentId,
                    amount: total,
                    status: payment_interface_1.PAYMENT_STATUS.PAID,
                    paymentMethod: order_interface_1.PAYMENT_METHOD.CARD,
                },
            ], { session });
            paymentDoc = paymentDocs[0]; // <-- correctly accessed after await
            // Await Order.create and get first document
            const orderDocs = yield order_model_1.Order.create([
                Object.assign(Object.assign({}, payload), { orderNumber, orderItems: preparedItems, subtotal: Number(subtotal.toFixed(2)), deliveryFee,
                    tax,
                    tip,
                    discount,
                    total, status: "CONFIRMED", statusHistory: [
                        { status: "PENDING", updatedAt: new Date().toISOString() },
                        { status: "CONFIRMED", updatedAt: new Date().toISOString() },
                    ], payment: paymentDoc._id }),
            ], { session });
            orderDoc = orderDocs[0]; // <-- correctly accessed after await
            yield payment_model_1.Payment.findByIdAndUpdate(paymentDoc._id, { order: orderDoc._id }, { session });
        }
        // --------------------------
        // CASH PAYMENT FLOW
        // --------------------------
        // CASH PAYMENT FLOW
        if (payload.paymentMethod === order_interface_1.PAYMENT_METHOD.CASH) {
            const paymentDocs = yield payment_model_1.Payment.create([
                {
                    order: undefined, // To be linked later
                    transaction: transactionId,
                    amount: total,
                    status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                    paymentMethod: order_interface_1.PAYMENT_METHOD.CASH,
                },
            ], { session });
            // Access the first created document safely after await
            const paymentDoc = paymentDocs[0];
            // Create order document (await and pick first element)
            const orderDocs = yield order_model_1.Order.create([
                Object.assign(Object.assign({}, payload), { orderNumber, orderItems: preparedItems, subtotal: Number(subtotal.toFixed(2)), deliveryFee,
                    tax,
                    tip,
                    discount,
                    total, status: orderStatus, statusHistory, payment: paymentDoc._id }),
            ], { session });
            const orderDoc = orderDocs[0];
            // Link the payment document with the order
            yield payment_model_1.Payment.findByIdAndUpdate(paymentDoc._id, { order: orderDoc._id }, { session });
        }
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.createOrder = createOrder;
