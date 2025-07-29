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
    if (payload.orderType === OrderType.DELIVERY) deliveryFee = 5; // adjust as needed

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

    //handling STATUS
    /**
     * CASH-> PAYMENT (UNPAID) -> PAYMENT STATUS UPDATED TO PAID MANUALLY
     * CARD ->
     */
    // Prepare initial payment status and order status
    let paymentStatus = PAYMENT_STATUS.UNPAID;
    let orderStatus: IStatusHistory["status"] = "PENDING";

    if (payload.paymentMethod === PAYMENT_METHOD.CASH) {
      paymentStatus = PAYMENT_STATUS.UNPAID;
      orderStatus = "CONFIRMED";
    }

    //order history
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

    // Prepare Payment doc
    const paymentDocArr = await Payment.create(
      [
        {
          order: undefined, // will link after
          transactionId, // temp
          amount: total,
          status: paymentStatus,
          paymentMethod: payload.paymentMethod,
        },
      ],
      { session }
    );
    let paymentDoc = paymentDocArr[0];

    // Create Order doc
    const orderDocArr = await Order.create(
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
          payment: paymentDoc._id,
        },
      ],
      { session }
    );
    let orderDoc = orderDocArr[0];

    // Link payment -> order
    await Payment.findByIdAndUpdate(
      paymentDoc._id,
      { order: orderDoc._id },
      { session }
    );

    // Stripe PaymentIntent Logic
    let clientSecret: string | undefined = undefined;
    let updatedPaymentDoc = paymentDoc;

    if (payload.paymentMethod === PAYMENT_METHOD.CARD) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { transactionId },
        receipt_email: payload.customerEmail || undefined,
      });

      const updatedPayment = await Payment.findByIdAndUpdate(
        paymentDoc._id,
        {
          transactionId: transactionId,
          paymentIntentId: paymentIntent.id,
          status: PAYMENT_STATUS.UNPAID,
        },
        { new: true, session }
      );

      if (!updatedPayment) {
        throw new Error(
          "Failed to update payment document with PaymentIntent info"
        );
      }

      updatedPaymentDoc = updatedPayment;
      clientSecret = paymentIntent.client_secret ?? undefined;
    }

    // Commit and close session **before reading order again**
    await session.commitTransaction();
    session.endSession();

    // Now fetch the latest versions OUTSIDE THE SESSION if you want to ensure all is saved.
    const latestOrder = await Order.findById(orderDoc._id);
    const latestPayment = await Payment.findById(paymentDoc._id);

    // Return freshest docs
    return {
      order: latestOrder ?? orderDoc,
      payment: latestPayment ?? updatedPaymentDoc ?? paymentDoc,
      clientSecret,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const updatePaymentOrderStatus = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order id not found");
  }
  order.status = "CONFIRMED";
  order.statusHistory.push({
    status: "CONFIRMED",
    updatedAt: new Date().toISOString(),
  });
  order.save();
  const payment = await Payment.findById(order.payment);
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment not received");
  }
  payment.status = PAYMENT_STATUS.PAID;
  payment.save();
  return payment;
};

export const orderHistoryById = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order id not found");
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

export const getAllOrder = async () => {
  const orders = await Order.find({});
  return orders;
};

export const changeOrderStatus = async (
  orderId: string,
  payload: IStatusHistory
) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order id not found");
  }
  if (payload.status === "CONFIRMED") {
    order.status = payload.status;

    order.statusHistory.push({
      status: payload.status,
      updatedAt: new Date().toISOString(),
    });
    const payment = await Payment.findById(order.payment);
    if (!payment) {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment not received");
    }
    payment.status = PAYMENT_STATUS.PAID;
    payment.save();
  } else {
    order.status = payload.status;
    order.statusHistory.push({
      status: payload.status,
      updatedAt: new Date().toISOString(),
    });
  }

  order.save();
  return { order: order.statusHistory };
};
