import { redisService } from "../services/RedisService";

export class CacheHelper {
  static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300,
  ): Promise<T> {
    const cached = await redisService.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    await redisService.set(key, data, ttl);
    return data;
  }

  static async invalidate(key: string | string[]): Promise<number> {
    return redisService.delete(key);
  }

  static async invalidateByPattern(pattern: string): Promise<number> {
    try {
      const keys = await redisService.getClient().keys(pattern);

      if (keys.length === 0) return 0;

      return await redisService.delete(keys);
    } catch (error) {
      console.error("Error invalidating cache by pattern:", error);
      return 0;
    }
  }
}
