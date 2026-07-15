import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export const dbconnect = async (uri: string) => {
  let connected: Boolean = false;

  if (connected) return;
  try {
    await mongoose.connect(uri, {
      dbName: "DB-Lavantine-Coffee",
      maxPoolSize: 50,
      autoCreate: env.NODE_ENV !== "PROD",
      autoIndex: env.NODE_ENV !== "PROD",
      family: 4, // Force IPv4 to bypass Windows/Node DNS SRV bugs
    });
    connected = true;

    mongoose.connection.on("connected", () =>
      logger.info("MongoDB Client Connected"),
    );

    mongoose.connection.on("disconnected", () =>
      logger.info("MongoDB Client Connection Failure"),
    );
    mongoose.connection.on("reconnected", () => logger.info("reconnected"));
    mongoose.connection.on("disconnecting", () => logger.info("disconnecting"));
    mongoose.connection.on("close", () => logger.info("close"));

    logger.info("Connected to database");
  } catch (error) {
    logger.error("Failed connection to database");
    throw error;
  }
};
