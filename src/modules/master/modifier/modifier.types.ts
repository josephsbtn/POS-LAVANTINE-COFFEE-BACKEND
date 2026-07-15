import { Document } from "mongoose";

export interface IModifierOption {
  name: string;
  price: number;
}

export interface IModifierCreate {
  groupName: string;
  options: IModifierOption[];
}

export interface IModifierUpdate extends Partial<IModifierCreate> {}

export interface IModifierDocument extends IModifierCreate, Document {
  createdAt: Date;
  updatedAt: Date;
}
