import { QueryOptions } from "../../../database/BaseRepository";
import {
  transactionStatus,
  transactionType,
  ITransactionDocument,
} from "../../../modules/transactions/transaction.types";

export const TransactionCacheKeys = {
  ALL: (options: QueryOptions<ITransactionDocument> = {}) => {
    const { page = 1, limit = 10, sort, filter } = options;
    const queryHash = JSON.stringify({ page, limit, sort, filter });
    return `transactions:all:${queryHash}`;
  },

  detail: (id: string) => `transactions:detail:${id}`,

  byStatus: (status: transactionStatus) => `transactions:status:${status}`,

  byType: (type: transactionType) => `transactions:type:${type}`,

  PATTERN_ALL: "transactions:*",
};
