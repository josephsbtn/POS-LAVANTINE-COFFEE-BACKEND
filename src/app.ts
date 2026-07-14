import express from "express";
import cors from "cors";
import { requestLogger, errorLogger, logger } from "./utils/logger";
import { dbconnect } from "./database/client";
import { env } from "./config/env";
import { corsConfig } from "./config/CorsConfig";

export const createApp = async () => {
  const app = express();
  await dbconnect(env.MONGO_URI);
  app.use(express.json({ limit: "5mb" }));
  app.use(cors(corsConfig));
  app.use(requestLogger);

  app.use("/health", (req, res) => {
    const message = {
      status: "ok",
      database: "ok",
      webSocket: "ok",
    };
    logger.info("Health check endpoint called", message);
    res.status(200).json(message);
  });

  app.use(errorLogger);

  return app;
};
