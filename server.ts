import "dotenv/config";
import http from "http";
import { createApp } from "./src/app";
import { dbconnect } from "./src/database/client";
import { redisService } from "./src/infrastructure/services/RedisService";
import { socketService } from "./src/infrastructure/socket/SocketService";
import { registerSocketGateway } from "./src/infrastructure/socket/SocketGateway";
import { logger } from "./src/utils/logger";
import { env } from "./src/config/env";

const startServer = async () => {
  try {
    // 1. Database
    await dbconnect(env.MONGO_URI);

    // 2. Redis
    await redisService.connect();

    // 3. Express
    const app = createApp();
    const httpServer = http.createServer(app);

    // 4. Socket.IO
    socketService.initialize(httpServer, env.ALLOWED_ORIGINS);
    registerSocketGateway();

    // 5. Listen
    httpServer.listen(env.PORT, () => {
      logger.info(`Server listening on http://localhost:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      httpServer.close(() => logger.info("HTTP server closed"));
      await socketService.close();
      await redisService.disconnect();

      process.exit(0);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason) => {
      logger.error(reason, "Unhandled Rejection");
    });

    process.on("uncaughtException", (error) => {
      logger.error(error, "Uncaught Exception");
      process.exit(1);
    });
  } catch (error) {
    logger.error(error, "Server failed to start");
    process.exit(1);
  }
};

startServer();
