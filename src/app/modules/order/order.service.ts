import { stripe } from "../../config/stripe";
import AppError from "../../errorHelpers/AppError";
import { Type } from "../coupons/coupons.interface";
import { Coupon } from "../coupons/coupons.model";
import { MenuItem } from "../menuItem/menuItem.model";
import { IPayment, PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import {
  IOrder,
  IOrderItem,
  IStatusHistory,
  OrderType,
  PAYMENT_METHOD,
} from "./order.interface";
import { Order } from "./order.model";
import httpStatus from "http-status-codes";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Document, FilterQuery } from "mongoose";
import { RestaurantSettings } from "../restaurantSettings/restaurantSettings.model";
import { OtpServices } from "../otp/otp.service";
import { sendEmail } from "../../utils/sendMail";
import crypto from "crypto";
import { CouponServices } from "../coupons/coupons.service";
import ca from "zod/v4/locales/ca.cjs";
import { envVars } from "../../config/env";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const generateOrderNumber = (length = 6) => {
  const randomNum = crypto.randomInt(10 ** (length - 1), 10 ** length);
  return `KPG-${randomNum}`;
};

const updatePaymentOrderStatus = async (orderNumber: string) => {
  console.log(orderNumber);
  const order = await Order.findOne({ orderNumber: orderNumber });
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order not found");
  }
  order.status = "CONFIRMED";
  order.statusHistory.push({
    status: "CONFIRMED",
    updatedAt: new Date().toISOString(),
  });
  await order.save();
  const payment = await Payment.findById(order.payment);
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment not received");
  }
  payment.status = PAYMENT_STATUS.PAID;
  await payment.save();
  return payment;
};

const orderHistoryByOrderNumber = async (orderNumber: string) => {
  const order = await Order.findOne({ orderNumber });
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order number not found");
  }
  const sortedStatusHistory = order.statusHistory
    .slice()
    .sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    );
  return {
    orderNumber: order.orderNumber,
    statusHistory: sortedStatusHistory,
  };
};

const getAllOrder = async (query: Record<string, string>) => {
  const orders = await Order.find(query);
  return orders;
};
const filteredOrders = async (query: Record<string, string>) => {
  const filter: FilterQuery<typeof Order> = {};

  // Parse date filters if provided
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (query.startDate) {
    startDate = startOfDay(parseISO(query.startDate));
  }
  if (query.endDate) {
    endDate = endOfDay(parseISO(query.endDate));
  }

  if (startDate && endDate) {
    filter.createdAt = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    filter.createdAt = { $gte: startDate };
  } else if (endDate) {
    filter.createdAt = { $lte: endDate };
  } else {
    // No dates passed, filter for today by default
    filter.createdAt = {
      $gte: startOfDay(new Date()),
      $lte: endOfDay(new Date()),
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
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate("payment");

  return orders;
};
const changeOrderStatus = async (orderId: string, payload: IStatusHistory) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order id not found");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      status: payload.status,
      $push: {
        statusHistory: {
          status: payload.status,
          updatedAt: new Date().toISOString(),
        },
      },
    },
    { new: true }
  ).populate("payment");

  return { order: updatedOrder };
};

const calulateOrderAmount = async (payload: IOrder) => {
  try {
    console.log("payload from front", payload);
    let subtotal = 0;
    let preparedItems: IOrderItem[] = [];

    // Calculate item prices and prepare items for order
    for (const orderItem of payload.orderItems) {
      const menuItem = await MenuItem.findById(orderItem.menuItemId).lean();
      if (!menuItem)
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Menu item ${orderItem.menuItemId} not found.`
        );

      // Base price from menu item
      let basePrice = orderItem.basePrice ?? 0;

      // Primary option price
      let primaryOptPrice = 0;
      if (orderItem.primaryOption) {
        basePrice = orderItem.primaryOption?.price;
      }

      // Secondary options with individual prices and totals
      let secondaryOptionsWithPrice: typeof orderItem.secondaryOptions =
        undefined;
      let secondaryTotal = 0;
      if (orderItem.secondaryOptions && menuItem.secondaryOptions) {
        secondaryOptionsWithPrice = orderItem.secondaryOptions.map((so) => {
          const foundSecondary = menuItem.secondaryOptions?.find(
            (ms) => ms.name === so.name
          );
          const optPrice =
            foundSecondary?.options.find((opt) => opt.name === so.name)
              ?.price ??
            so.price ??
            0;
          secondaryTotal += optPrice;
          return { ...so, price: optPrice };
        });
      }

      // Addons with individual prices and totals
      let addonsWithPrice: typeof orderItem.addons = undefined;
      let addonsTotal = 0;
      if (orderItem.addons && menuItem.addons) {
        addonsWithPrice = orderItem.addons.map((addon) => {
          const foundAddon = menuItem.addons?.find(
            (ma) => ma.name === addon.name
          );
          const addonPrice = foundAddon?.price ?? addon.price ?? 0;
          addonsTotal += addonPrice;
          return { ...addon, price: addonPrice };
        });
      }

      // Calculate total price for this order item (including quantity)
      console.log(basePrice);
      console.log(secondaryTotal);
      console.log(addonsTotal);
      const totalPrice =
        (basePrice + secondaryTotal + addonsTotal) * orderItem.quantity;
      subtotal += totalPrice;
      console.log(totalPrice);
      console.log("subtotal", subtotal);

      // Push prepared item to array
      preparedItems.push({
        ...orderItem,
        name: menuItem.name,
        basePrice,
        primaryOption: { ...orderItem.primaryOption, price: basePrice },
        secondaryOptions: secondaryOptionsWithPrice,
        addons: addonsWithPrice,
        totalPrice,
      });
    }

    // Calculate delivery fee
    console.log("payload delivery charge = ", payload.deliveryCharge);
    const deliveryFee =
      payload.orderType === OrderType.DELIVERY
        ? (payload.deliveryCharge as number)
        : 0;

    const tip = payload.tip ?? 0;
    let discount = 0;

    // Apply coupon discount if valid
    if (payload.couponCode) {
      const coupon = await Coupon.findOne({
        code: payload.couponCode,
        active: true,
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
        $or: [{ usageLimit: null }, { usageLimit: { $gt: 0 } }],
      });

      if (!coupon || coupon.usedCount === coupon.usageLimit)
        throw new AppError(httpStatus.FORBIDDEN, "Invalid coupon code");

      if (coupon && subtotal >= coupon.minOrder) {
        if (coupon.type === Type.PERCENTAGE) {
          discount = subtotal * (coupon.value / 100);
          if (coupon.maxDiscount)
            discount = Math.min(discount, coupon.maxDiscount);
        } else {
          discount = coupon.value;
        }
      }
    }
    discount = Math.max(discount, 0);

    const settings = await RestaurantSettings.findOne();
    const TAX_RATE = settings?.taxRate as number;
    const tax = Number((((subtotal - discount) / 100) * TAX_RATE).toFixed(2));

    // Calculate grand total
    console.log("discount = ", discount);
    console.log("delivery fee =", deliveryFee);
    console.log("tex =", tax);
    console.log("tip =", tip);
    const total = Number(
      (subtotal - discount + deliveryFee + tax + tip).toFixed(2)
    );
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
  } catch (error: any) {
    console.log(error);
    throw new AppError(httpStatus.BAD_REQUEST, "calculation error");
  }
};

const createOrder = async (
  payload: IOrder & {
    paymentMethod: PAYMENT_METHOD;
    paymentIntentId?: string;
    otp: string;
  }
) => {
  const session = await Order.startSession();
  let transactionCommitted = false;
  await session.startTransaction();
  try {
    const orderNumber = generateOrderNumber();
    const transactionId = getTransactionId();

    let orderDoc: (IOrder & Document) | undefined;
    let paymentDoc: (IPayment & Document) | undefined;
    let paymentStatus = PAYMENT_STATUS.UNPAID;

    const calculation = await calulateOrderAmount(payload);

    let orderStatus: IStatusHistory["status"] = "PENDING";
    if (payload.paymentMethod === PAYMENT_METHOD.CASH) {
      paymentStatus = PAYMENT_STATUS.UNPAID;
    }

    // --- Order status history ---
    const statusHistory: IStatusHistory[] = [
      {
        status: "CONFIRMED" as IStatusHistory["status"],
        updatedAt: new Date().toISOString(),
      },
    ];

    // CARD PAYMENT
    // let paymentDoc: IPayment & Document;
    // let orderDoc: IOrder & Document;
    let generatePaymentIntent;
    if (payload.paymentMethod === PAYMENT_METHOD.CARD) {
      //check payment failed

      generatePaymentIntent = await stripe.paymentIntents.create({
        amount: Number(Math.round(Number(calculation.total) * 100).toFixed(2)),
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { orderNumber: orderNumber, tempId: Date.now().toString() },
        receipt_email: calculation.customerEmail,
      });
      if (!generatePaymentIntent) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Missing paymentIntentId for card payment"
        );
      }

      // Retrieve and check intent status
      const paymentIntent = await stripe.paymentIntents.retrieve(
        generatePaymentIntent.id as string
      );

      // Await Payment.create and then get first document

      const paymentDocs = await Payment.create(
        [
          {
            order: undefined,
            transactionId,
            paymentIntentId: generatePaymentIntent.id,
            amount: Number(calculation.total.toFixed(2)),
            status: PAYMENT_STATUS.UNPAID,
            paymentMethod: PAYMENT_METHOD.CARD,
          },
        ],
        { session }
      );
      paymentDoc = paymentDocs[0]; // <-- correctly accessed after await

      // Await Order.create and get first document
      const orderDocs = await Order.create(
        [
          {
            ...payload,
            orderNumber,
            orderItems: calculation.preparedItems,
            subtotal: Number(calculation.subtotal.toFixed(2)),
            deliveryCharge: Number(calculation.deliveryFee.toFixed(2)),
            tax: Number(calculation.tax.toFixed(2)),
            tip: Number(calculation.tip.toFixed(2)),
            scheduledTime: calculation.isScheduled
              ? calculation.scheduledTime
              : undefined,
            discount: Number(calculation.discount.toFixed(2)),
            total: Number(calculation.total.toFixed(2)),
            status: "PENDING",
            statusHistory: [
              { status: "PENDING", updatedAt: new Date().toISOString() },
            ],
            payment: paymentDoc._id,
          },
        ],
        { session }
      );
      orderDoc = orderDocs[0];
      await Payment.findByIdAndUpdate(
        paymentDoc._id,
        { order: orderDoc._id },
        { session }
      );
    }

    // CASH PAYMENT FLOW
    if (payload.paymentMethod === PAYMENT_METHOD.CASH) {
      await OtpServices.verifyOtp(
        payload.customerEmail as string,
        payload.otp as string
      );

      const paymentDocs = await Payment.create(
        [
          {
            order: undefined,
            transactionId: transactionId,
            amount: Number(calculation.total.toFixed(2)),
            status: PAYMENT_STATUS.UNPAID,
            paymentMethod: PAYMENT_METHOD.CASH,
          },
        ],
        { session }
      );

      paymentDoc = paymentDocs[0];
      const orderDocs = await Order.create(
        [
          {
            ...payload,
            orderNumber,
            orderItems: calculation.preparedItems,
            subtotal: Number(calculation.subtotal.toFixed(2)),
            deliveryCharge: calculation.deliveryFee,
            tax: calculation.tax,
            tip: calculation.tip,
            discount: calculation.discount,
            total: Number(calculation.total.toFixed(2)),
            status: orderStatus,
            statusHistory: [
              { status: "PENDING", updatedAt: new Date().toISOString() },
            ],
            payment: paymentDoc._id,
          },
        ],
        { session }
      );
      orderDoc = orderDocs[0];

      await Payment.findByIdAndUpdate(
        paymentDoc._id,
        { order: orderDoc._id },
        { session }
      );
    }

    await session.commitTransaction();
    transactionCommitted = true;
    session.endSession();
    const latestOrder = await Order.findById(orderDoc?._id);
    const latestPayment = await Payment.findById(paymentDoc?._id);
    if (payload.couponCode) {
      await CouponServices.updateCouponCount(payload.couponCode as string);
    }
    return {
      order: latestOrder ?? orderDoc,
      payment: latestPayment ?? paymentDoc,
      orderNumber: orderDoc?.orderNumber,
      clientSecret:
        payload.paymentMethod === PAYMENT_METHOD.CARD
          ? generatePaymentIntent?.client_secret
          : undefined,
      paymentIntentId: generatePaymentIntent?.id,
    };
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};

const trackByOrderNumber = async (orderNumber: string) => {
  const order = await Order.findOne({ orderNumber }).select("-payment");
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, "order not found");
  }
  return order;
};

//delete order by orderNumber
const deleteOrderByOrderNumber = async (orderNumber: string) => {
  const result = await Order.findOneAndDelete({ orderNumber });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

export const OrderServices = {
  createOrder,
  trackByOrderNumber,
  filteredOrders,
  deleteOrderByOrderNumber,
  getAllOrder,
  changeOrderStatus,
  updatePaymentOrderStatus,
  orderHistoryByOrderNumber,
  calulateOrderAmount,
};
