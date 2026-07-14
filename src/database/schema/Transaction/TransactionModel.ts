import mongoose from "mongoose";
import {
  transactionStatus,
  paymentMethod,
  transactionType,
} from "../../../modules/transactions/transaction.types";
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
    discount: {
      type: {
        discountId: {
          type: mongoose.Types.ObjectId,
          ref: "discount",
        },
        name: {
          type: String,
        },
        discountNominal: {
          type: Number,
        },
      },

      default: {},
    },
    items: [],
  },
  {
    timestamps: true,
  },
);

TransanctionSchema.index({ status: 1, createdAt: -1 });
TransanctionSchema.index({ cashier: 1, createdAt: -1 });
