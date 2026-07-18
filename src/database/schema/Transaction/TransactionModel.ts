import mongoose from "mongoose";
import {
  transactionStatus,
  paymentMethod,
  transactionType,
} from "../../../modules/transactions/transaction.types";
import { TransactionItemsSchema } from "./TransactionItems";
import { TransactionDiscountSchema } from "./TransactionDiscount";

const TransanctionSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      index: true,
    },
    cashier: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(transactionType),
      required: true,
      index: true,
    },
    items: [TransactionItemsSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(paymentMethod),
      required: true,
      index: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
      required: true,
    },
    changeAmount: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: TransactionDiscountSchema,
    status: {
      type: String,
      enum: Object.values(transactionStatus),
      default: transactionStatus.PREPARING,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

TransanctionSchema.index({ status: 1, createdAt: -1 });
TransanctionSchema.index({ cashier: 1, createdAt: -1 });

const TransactionsModel = mongoose.model("transaction", TransanctionSchema);
export type TypeTransactionSchema = mongoose.InferSchemaType<
  typeof TransanctionSchema
>;
export default TransactionsModel;
