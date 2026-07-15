import { ObjectId, Types } from "mongoose";
import { BaseRepository, QueryOptions } from "../../database/BaseRepository";
import TransactionsModel, {
  TypeTransactionSchema,
} from "../../database/schema/Transaction/TransactionModel";
import {
  ITransactionCreate,
  ITransactionDocument,
  transactionStatus,
  transactionType,
} from "./transaction.types";

export class TransactionRepo extends BaseRepository<
  ITransactionDocument,
  ITransactionCreate
> {
  constructor() {
    super(TransactionsModel as any);
  }

  async getByStatus(
    status: transactionStatus,
    options?: QueryOptions<ITransactionDocument>,
  ) {
    return this.findAll({
      ...options,
      filter: { ...options?.filter, status: status },
    });
  }

  async changeStatus(id: string, status: transactionStatus) {
    const _id = new Types.ObjectId(id);
    return this.model.findByIdAndUpdate(_id, { status: status });
  }

  async getByType(
    type: transactionType,
    options?: QueryOptions<ITransactionDocument>,
  ) {
    return this.findAll({
      ...options,
      filter: { ...options?.filter, type: type },
    });
  }
}
