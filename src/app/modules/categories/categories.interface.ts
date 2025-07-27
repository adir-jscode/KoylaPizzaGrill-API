export enum Available {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

export interface ICategory {
  name: string;
  description?: string;
  display: boolean;
  available: Available[];
  availableDays: number[];
  availableTime: {
    from: string;
    to: string;
  };
  displayOrder?: number;
  isVisible?: boolean;
}
