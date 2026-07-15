import mongoose from "mongoose";

export const TransactionDiscountSchema = new mongoose.Schema({
  discountId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
});

export type TransactionDiscountType = mongoose.InferSchemaType<
  typeof TransactionDiscountSchema
>;
