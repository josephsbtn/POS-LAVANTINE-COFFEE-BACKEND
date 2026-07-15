import { Document } from "mongoose";

export interface ICategoryCreate {
  name: string;
}

export interface ICategoryUpdate extends Partial<ICategoryCreate> {}

export interface ICategoryDocument extends ICategoryCreate, Document {
  createdAt: Date;
  updatedAt: Date;
}
