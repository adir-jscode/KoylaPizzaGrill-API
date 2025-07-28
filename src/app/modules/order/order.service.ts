import { stripe } from "../../config/stripe";
import AppError from "../../errorHelpers/AppError";
import { Type } from "../coupons/coupons.interface";
import { Coupon } from "../coupons/coupons.model";
import { MenuItem } from "../menuItem/menuItem.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
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

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const generateOrderNumber = () => {
  return `KPG-${Date.now()}`;
};
export const createOrder = async (
  payload: IOrder & { paymentMethod: PAYMENT_METHOD }
) => {
  const transactionId = getTransactionId();
  const session = await Order.startSession();

  session.startTransaction();
  try {
    let subtotal = 0;
    let preparedItems: IOrderItem[] = [];

    for (const orderItem of payload.orderItems) {
      const menuItem = await MenuItem.findById(orderItem.menuItemId).lean();

      if (!menuItem)
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Menu item ${orderItem.menuItemId} not found.`
        );

      const basePrice = menuItem.price;

      let primaryOptPrice = 0;
      if (orderItem.primaryOption) {
        const foundOpt = menuItem.primaryOption.options.find(
          (opt) => opt.name === orderItem.primaryOption.name
        );
        primaryOptPrice = foundOpt?.price ?? 0;
      }

      // Calculate secondary options total price
      let secondaryOptTotal = 0;
      if (orderItem.secondaryOptions && menuItem.secondaryOptions) {
        for (const so of orderItem.secondaryOptions) {
          const foundSec = menuItem.secondaryOptions.find(
            (sec) => sec.name === so.name
          );
          if (foundSec) {
            const foundPrice =
              foundSec.options.find((opt) => opt.name === so.name)?.price ??
              so.price ??
              0;
            secondaryOptTotal += foundPrice;
          } else {
            secondaryOptTotal += so.price ?? 0;
          }
        }
      }

      // Calculate addons total price
      let addonsTotal = 0;
      if (orderItem.addons && menuItem.addons) {
        for (const add of orderItem.addons) {
          const foundAdd = menuItem.addons.find((a) => a.name === add.name);
          addonsTotal += foundAdd?.price ?? add.price ?? 0;
        }
      }

      const totalPrice =
        (basePrice + primaryOptPrice + secondaryOptTotal + addonsTotal) *
        orderItem.quantity;

      subtotal += totalPrice;

      preparedItems.push({
        ...orderItem,
        name: menuItem.name,
        basePrice,
        primaryOption: {
          ...orderItem.primaryOption,
          price: primaryOptPrice,
        },
        secondaryOptions: orderItem.secondaryOptions,
        addons: orderItem.addons,
        totalPrice,
      });
    }

    // Calculate other charges
    let deliveryFee = 0;
    if (payload.orderType === "DELIVERY") deliveryFee = 5; // adjust as needed

    const tip = payload.tip ?? 0;
    let discount = 0;

    // Valid coupon application
    if (payload.couponCode) {
      const coupon = await Coupon.findOne({
        code: payload.couponCode,
        active: true,
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
        $or: [{ usageLimit: null }, { usageLimit: { $gt: 0 } }],
      });

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

    const TAX_RATE = 0.0875; //assume
    const tax = Number(((subtotal - discount) * TAX_RATE).toFixed(2));

    const total = Number(
      (subtotal - discount + deliveryFee + tax + tip).toFixed(2)
    );

    const orderNumber = generateOrderNumber();

    // Prepare initial payment status and order status
    let paymentStatus = PAYMENT_STATUS.UNPAID;
    let orderStatus: IStatusHistory["status"] = "PENDING";

    if (payload.paymentMethod === PAYMENT_METHOD.CASH) {
      paymentStatus = PAYMENT_STATUS.UNPAID;
      orderStatus = "CONFIRMED";
    }

    const statusHistory: IStatusHistory[] = [
      {
        status: "PENDING" as IStatusHistory["status"],
        updatedAt: new Date().toISOString(),
      },
      ...(orderStatus === "CONFIRMED"
        ? [
            {
              status: "CONFIRMED" as IStatusHistory["status"],
              updatedAt: new Date().toISOString(),
            },
          ]
        : []),
    ];

    // Create Payment document with payment status
    const paymentDoc = await Payment.create(
      [
        {
          order: undefined, // link after creating order
          transactionId,
          amount: total,
          status: paymentStatus,
          paymentMethod: payload.paymentMethod,
        },
      ],
      { session }
    );

    // Create Order document
    const orderDoc = await Order.create(
      [
        {
          ...payload,
          orderNumber,
          orderItems: preparedItems,
          subtotal: Number(subtotal.toFixed(2)),
          deliveryFee,
          tax,
          tip,
          discount,
          total,
          status: orderStatus,
          statusHistory,
          payment: paymentDoc[0]._id,
        },
      ],
      { session }
    );

    // Update payment with order reference
    await Payment.findByIdAndUpdate(
      paymentDoc[0]._id,
      { order: orderDoc[0]._id },
      { session }
    );

    // If card payment, create Stripe payment intent and save its client_secret in extra data
    let clientSecret: string | undefined;

    if (payload.paymentMethod === PAYMENT_METHOD.CARD) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // in cents
        currency: "usd", // change if needed
        metadata: { transactionId },
        receipt_email: payload.customerEmail || undefined,
      });

      await Payment.findByIdAndUpdate(
        paymentDoc[0]._id,
        { transactionId: paymentIntent.id, status: PAYMENT_STATUS.PAID },
        { new: true, runValidators: true, session }
      );
      clientSecret = paymentIntent.client_secret ?? undefined;
    }

    // After order creation, requery fresh order
    const freshOrder = await Order.findById(orderDoc[0]._id).session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      order: freshOrder ?? orderDoc[0],
      payment: paymentDoc[0],
      clientSecret,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
