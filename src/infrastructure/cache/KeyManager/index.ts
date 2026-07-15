import { TransactionCacheKeys } from "./Transaction.Key";
// import { UserCacheKeys } from './User.Key';
// import { ItemCacheKeys } from './Item.Key';

export const CacheKeys = {
  TRANSACTION: TransactionCacheKeys,
  // USER: UserCacheKeys,
  // ITEM: ItemCacheKeys,
};

// Penggunaannya nanti di Service:
// CacheKeys.TRANSACTION.ALL
// CacheKeys.TRANSACTION.detail('123')
