export interface IRestaurantSettings {
  isAcceptingPickup: boolean;
  isAcceptingDelivery: boolean;
  restaurantName?: string;
  phone?: string;
  address?: string;
  deliveryFee: number;
  taxRate: number;
  minDeliveryAmount?: number;
  updatedAt: Date;
}
