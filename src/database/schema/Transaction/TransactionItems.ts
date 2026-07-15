import mongoose from "mongoose";
import { AddonSchema } from "../Items/ItemModel";

export const TransactionItemsSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "item",
    required: true,
  },
  addon: [AddonSchema],
  mod: [
    {
      groupName: {
        type: String,
      },
      options: {
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
});

export type TransactionItemType = mongoose.InferSchemaType<
  typeof TransactionItemsSchema
>;
