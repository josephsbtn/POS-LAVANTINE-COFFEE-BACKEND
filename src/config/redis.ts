import { createClient, RedisClientType } from "redis";
import { env } from "./env";
import { logger } from "../utils/logger";

export const redisClient: RedisClientType = await createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error("Redis connection failed after 10 attempts");
        return new Error("Redis connection failed");
      }

      const delay = Math.min(retries * 200, 4000);

      return delay;
    },

    timeout: 5000,
  },
});
