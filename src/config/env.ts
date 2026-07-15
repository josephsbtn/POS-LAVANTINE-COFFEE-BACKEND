import { z } from "zod";

const nodeEnum = z.enum(["DEV", "PROD"]);

const envSchema = z.object({
  NODE_ENV: nodeEnum,

  ALLOWED_ORIGINS: z.string(),

  PORT: z.coerce.number().default(5000),

  MONGO_URI: z.string(),
  REDIS_URL: z.string(),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
