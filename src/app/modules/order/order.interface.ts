export interface IOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  basePrice: number;
  category: string;
  imageUrl: string;
  primaryOption: { name: string; price: number };
  secondaryOptions?: { name: string; price?: number }[];
  addons?: { id: string; name: string; price?: number }[];
  specialInstruction?: string;
}

export interface IStatusHistory {
  name:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out for delivery"
    | "completed"
    | "cancelled";
  updatedAt: string;
}

export interface IOrder {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  orderItems: IOrderItem[];
  orderType: "pickup" | "delivery";
  deliveryAddress?: string;
  subTotal: number;
  deliveryFee?: number;
  tax: number;
  tip?: number;
  discount?: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out for delivery"
    | "completed"
    | "cancelled";
  statusHistory: IStatusHistory[];
  couponUsed?: string;
  kitchenNote?: string;
  payment_method: "card" | "cash";
  payment_status?: "pending" | "paid" | "failed";
  stripe_payment_intent_id?: string;
  createdAt?: string;
}
