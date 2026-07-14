import { z, ZodEnum } from "zod";
import { logger } from "../utils/logger";

const nodeEnum = z.enum(["DEV", "PROD"]);

const envSchema = z.object({
  NODE_ENV: nodeEnum,

  ALLOWED_ORIGINS: z.string(),

  PORT: z.coerce.number().default(5000),

  MONGO_URI: z.string(),
  REDIS_URL: z.string(),

  JWT_SECRET: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("Invalid environment variables", parsed.error.format());
  logger.error(
    "Please check your .env file and ensure all required variables are set.",
  );
  process.exit(1);
}

export const env = parsed.data;
