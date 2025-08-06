import { Types } from "mongoose";

export interface IAddon {
  name: string;
  price: number;
}

export interface IPrimaryOption {
  name: string;
  options: { name: string; price?: number }[];
}

export interface ISecondaryOption {
  name: string;
  minSelect: number;
  maxSelect: number;
  options: { name: string; price?: number }[];
}

export interface IMenuItem {
  categoryId: Types.ObjectId; // MongoDB ObjectId as string
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  primaryOption?: IPrimaryOption;
  secondaryOptions?: ISecondaryOption[];
  addons?: IAddon[];
  tags?: string[];
  isAvailable?: boolean;
  displayOrder?: number;
}
