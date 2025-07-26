export enum Type {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export interface ICoupon {
  code: string;
  description: string;
  type: Type;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}
