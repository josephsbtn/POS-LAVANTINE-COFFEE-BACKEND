import { QueryOptions } from "../../../database/BaseRepository";
import { IItemDocument } from "../../../modules/master/items/item.types";

export const ItemCacheKeys = {
  ALL: (options: QueryOptions<IItemDocument> = {}) => {
    const { page = 1, limit = 10, sort, filter } = options;
    const queryHash = JSON.stringify({ page, limit, sort, filter });
    return `items:all:${queryHash}`;
  },

  detail: (id: string) => `items:detail:${id}`,

  PATTERN_ALL: "items:*",
};
