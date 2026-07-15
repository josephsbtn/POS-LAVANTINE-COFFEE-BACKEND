import { Document, Types } from "mongoose";

export interface IItemAddon {
  name: string;
  price: number;
}

export interface IItemCreate {
  categoryId: string | Types.ObjectId;
  name: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  modifier?: string[] | Types.ObjectId[];
  addon?: IItemAddon[];
}

export interface IItemUpdate extends Partial<IItemCreate> {}

export interface IItemDocument extends IItemCreate, Document {
  createdAt: Date;
  updatedAt: Date;
}
