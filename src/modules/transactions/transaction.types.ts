import { ObjectId, Types } from "mongoose";
import { ITimestamps } from "../../database/BaseRepository";
import TransactionsModel from "../../database/schema/Transaction/TransactionModel";
import { TransactionDiscountType } from "../../database/schema/Transaction/TransactionDiscount";
import { TransactionItemType } from "../../database/schema/Transaction/TransactionItems";

export enum transactionStatus {
  PAID = "paid",
  PREPARING = "preparing",
  SERVED = "served",
}

export enum paymentMethod {
  CASH = "cash",
  QRIS = "qris",
}

export enum transactionType {
  DINE_IN = "dine in",
  TAKE_AWAY = "take_away",
}

export interface ITransactionCashierDocument {
  _id: ObjectId;
  username: string;
}

export interface ITransactionCreate {
  cashier: ObjectId;
  invoiceNumber: string;
  type: transactionType;
  items: TransactionItemType[];
  paymentMethod: paymentMethod;
  amountPaid: number;
  changeAmount: number;
  subtotal: number;
  discount: TransactionDiscountType;
  status: transactionStatus;
}

export interface ITransactionDocument extends ITransactionCreate, ITimestamps {
  _id: ObjectId;
}
