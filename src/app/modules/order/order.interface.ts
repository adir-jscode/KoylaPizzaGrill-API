import { Types } from "mongoose";

export interface IOrderItem {
  id?: string;
  menuItemId: Types.ObjectId;
  name: string;
  basePrice: number;
  quantity: number;
  primaryOption: { name: string; price: number };
  secondaryOptions?: { name: string; price?: number }[];
  addons?: { id: string; name: string; price?: number }[];
  totalPrice: number;
}

export interface IStatusHistory {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "OUT FOR DELIVERY"
    | "COMPLETED"
    | "CANCELLED";
  updatedAt: string;
}

export enum OrderType {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}
export enum PAYMENT_METHOD {
  CARD = "CARD",
  CASH = "CASH",
}

export interface IOrder {
  orderNumber: string; // custom id- KPG-currentDateTime
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  orderType: OrderType;
  isScheduled: boolean;
  deliveryAddress?: string;
  orderItems: IOrderItem[];
  subtotal: number;
  deliveryFee?: number;
  tax: number;
  tip?: number;
  discount?: number;
  total: number;
  status: IStatusHistory["status"];
  statusHistory: IStatusHistory[];
  specialInstructions?: string;
  couponCode?: string;
  payment?: Types.ObjectId;
  paymentMethod: PAYMENT_METHOD;
}
