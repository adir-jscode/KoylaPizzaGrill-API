export interface IHourRange {
  from: string;
  to: string;
}
export interface IRestaurantHour {
  day: number; // 0: Sunday - 6: Saturday
  pickupHours: IHourRange[];
  deliveryHours: IHourRange[];
  isActive?: boolean;
}
