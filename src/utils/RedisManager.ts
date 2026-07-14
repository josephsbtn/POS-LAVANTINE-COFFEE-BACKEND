import { RedisClientType, SetOptions } from "redis";
import { redisClient } from "../config/redis";
import { logger } from "./logger";

export class RedisManager {
  private static instance: RedisClientType;

  static async getInstance(): Promise<RedisClientType> {
    if (!this.instance) {
      this.instance = await redisClient;
    }
    return this.instance;
  }

  static async set<T>(
    key: string,
    Value: T,
    TTL: number = 300,
    tag: string | string[],
  ) {
    try {
      const serialized = JSON.stringify(Value);
      await this.instance?.set(key, serialized, {
        EX: TTL,
      });
      return true;
    } catch (error) {
      logger.error("Failed to set data on redis", error);
      return false;
    }
  }

  static async get<T>(key: string) {
    try {
      const data = await this.instance?.get(key);
      if (!data) return null;
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      logger.error("Failed to get data from redis", error);
      return null;
    }
  }

  static async delete<T>(key: string | string[]): Promise<number> {
    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length == 0) return 0;
      return await this.instance.del(keys);
    } catch (error) {
      logger.error("Failed to delete cache", error);
      return 0;
    }
  }

  static invalidatedPrefix(keys: string) {
    // try {
    //   const key;
    // } catch (error) {}
  }
}
