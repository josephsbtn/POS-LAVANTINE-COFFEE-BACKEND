import { QueryOptions } from "../../database/BaseRepository";
import { CacheHelper } from "../../infrastructure/cache/CacheHelper";
import { TransactionCacheKeys } from "../../infrastructure/cache/KeyManager/Transaction.Key";
import { TransactionRepo } from "./transactions.repo";
import {
  ITransactionCreate,
  ITransactionDocument,
  transactionStatus,
} from "./transaction.types";
import { errorLogger, logger } from "../../utils/logger";
import { randomInt } from "crypto";

export class TransactionService {
  constructor(private readonly repo: TransactionRepo) {}

  async getAllTransaction(options: QueryOptions<ITransactionDocument> = {}) {
    try {
      const data = await CacheHelper.getOrSet(
        TransactionCacheKeys.ALL(options),
        async () => {
          return await this.repo.findAll(options);
        },
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getDetailTransaction(id: string) {
    try {
      const data = await CacheHelper.getOrSet(
        TransactionCacheKeys.detail(id),
        async () => await this.repo.findById(id, {
          populate: [
            { path: "cashier", select: "username" },
            { path: "items.itemId", select: "name price imageUrl" }
          ]
        }),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async changeStatus(id: string, status: transactionStatus) {
    try {
      const [invalidate, result] = await Promise.all([
        CacheHelper.invalidateByPattern(TransactionCacheKeys.PATTERN_ALL),
        this.repo.changeStatus(id, status),
      ]);
      logger.info(invalidate, "Invalidate Key");
      return result;
    } catch (error) {
      throw error;
    }
  }

  async create(payload: ITransactionCreate) {
    try {
      let grandTotal = 0;
      let totalItems = 0;

      const mappedItems = payload.items.map((item) => {
        const addonPrice =
          item.addon?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;
        const modPrice =
          item.mod?.reduce((sum, m) => sum + (m.options?.price || 0), 0) || 0;

        item.subtotal = (item.price + addonPrice + modPrice) * item.quantity;

        grandTotal += item.subtotal;
        totalItems += item.quantity;
        return item;
      });

      payload.items = mappedItems;
      payload.subtotal = grandTotal;
      payload.invoiceNumber = "#LVC-" + randomInt(100, 999) + "-" + Date.now();

      const discountAmount = payload.discount?.value || 0;
      const tax = (grandTotal - discountAmount) * 0.12;
      const total = Math.max(0, grandTotal - discountAmount + tax);

      const payloadToSave = {
        ...payload,
        totalItems,
        tax,
        total,
      } as unknown as ITransactionCreate;

      const [invalidate, result] = await Promise.all([
        CacheHelper.invalidateByPattern(TransactionCacheKeys.PATTERN_ALL),
        this.repo.create(payloadToSave),
      ]);
      logger.info(invalidate, "Invalidate Key");
      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, payload: Partial<ITransactionCreate>) {
    try {
      const [invalidate, result] = await Promise.all([
        CacheHelper.invalidateByPattern(TransactionCacheKeys.PATTERN_ALL),
        this.repo.update(id, payload),
      ]);
      logger.info(invalidate, "Invalidate Key");
      return result;
    } catch (error) {
      throw error;
    }
  }
}
