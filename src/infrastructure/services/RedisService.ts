import { createClient, RedisClientType } from "redis";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType | null = null;

  private constructor() {}

  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async connect(): Promise<void> {
    if (this.client) return;

    this.client = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error("Redis connection failed after 10 attempts");
            return new Error("Redis max reconnect attempts reached");
          }
          const delay = Math.min(retries * 200, 4000);
          logger.warn(`Redis reconnecting attempt ${retries}, delay ${delay}ms`);
          return delay;
        },
        connectTimeout: 5000,
      },
    }) as RedisClientType;

    this.client.on("connect", () => logger.info("Redis client connecting"));
    this.client.on("ready", () => logger.info("Redis client connected"));
    this.client.on("error", (err) => logger.error(err, "Redis client error"));
    this.client.on("reconnecting", () => logger.info("Redis client reconnecting"));

    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      logger.info("Redis client disconnected");
    }
  }

  getClient(): RedisClientType {
    if (!this.client) {
      throw new Error("Redis client not initialized. Call connect() first.");
    }
    return this.client;
  }

  async set<T>(key: string, value: T, ttl: number = 300): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await this.getClient().set(key, serialized, { EX: ttl });
      return true;
    } catch (error) {
      logger.error(error, "Redis SET failed");
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.getClient().get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(error, "Redis GET failed");
      return null;
    }
  }

  async delete(key: string | string[]): Promise<number> {
    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length === 0) return 0;
      return await this.getClient().del(keys);
    } catch (error) {
      logger.error(error, "Redis DELETE failed");
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const count = await this.getClient().exists(key);
      return count > 0;
    } catch (error) {
      logger.error(error, "Redis EXISTS failed");
      return false;
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.getClient().expire(key, ttl);
      return result === 1;
    } catch (error) {
      logger.error(error, "Redis EXPIRE failed");
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.getClient().flushDb();
      logger.info("Redis cache cleared");
    } catch (error) {
      logger.error(error, "Redis CLEAR failed");
    }
  }
}

export const redisService = RedisService.getInstance();
