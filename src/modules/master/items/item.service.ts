import { QueryOptions } from "../../../database/BaseRepository";
import { ItemRepo } from "./item.repo";
import {
  IItemCreate,
  IItemDocument,
  IItemUpdate,
} from "./item.types";
import { CacheHelper } from "../../../infrastructure/cache/CacheHelper";
import { ItemCacheKeys } from "../../../infrastructure/cache/KeyManager/Item.Key";
import { logger } from "../../../utils/logger";

export class ItemService {
  constructor(private readonly repo: ItemRepo) {}

  async getAllItems(options: QueryOptions<IItemDocument> = {}) {
    options.populate = [{ path: "modifier" }];
    return await CacheHelper.getOrSet(
      ItemCacheKeys.ALL(options),
      async () => await this.repo.findAll(options),
    );
  }

  async getItemById(id: string) {
    return await CacheHelper.getOrSet(
      ItemCacheKeys.detail(id),
      async () => await this.repo.findById(id, { populate: { path: "modifier" } }),
    );
  }

  async createItem(payload: IItemCreate) {
    const [invalidate, result] = await Promise.all([
      CacheHelper.invalidateByPattern(ItemCacheKeys.PATTERN_ALL),
      this.repo.create(payload),
    ]);
    logger.info(invalidate, "Invalidate Key");
    return result;
  }

  async updateItem(id: string, payload: IItemUpdate) {
    const [invalidate, result] = await Promise.all([
      CacheHelper.invalidateByPattern(ItemCacheKeys.PATTERN_ALL),
      this.repo.update(id, payload),
    ]);
    logger.info(invalidate, "Invalidate Key");
    return result;
  }

  async deleteItem(id: string) {
    const [invalidate, result] = await Promise.all([
      CacheHelper.invalidateByPattern(ItemCacheKeys.PATTERN_ALL),
      this.repo.delete(id),
    ]);
    logger.info(invalidate, "Invalidate Key");
    return result;
  }

  async changeAvailability(id: string, isAvailable: boolean) {
    const [invalidate, result] = await Promise.all([
      CacheHelper.invalidateByPattern(ItemCacheKeys.PATTERN_ALL),
      this.repo.update(id, { isAvailable }),
    ]);
    logger.info(invalidate, "Invalidate Key");
    return result;
  }
}
