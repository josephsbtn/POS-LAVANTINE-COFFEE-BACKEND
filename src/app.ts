import express from "express";
import cors from "cors";
import { requestLogger, errorLogger } from "./utils/logger";
import { corsConfig } from "./config/CorsConfig";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import masterRoutes from "./modules/master/master.routes";

export const createApp = () => {
  const app = express();

  app.use(express.json({ limit: "5mb" }));
  app.use(cors(corsConfig));
  app.use(requestLogger);

  // Static files for uploads (bisa diakses frontend via /uploads/items/namafile.jpg)
  app.use("/uploads", express.static("public/uploads"));

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/master", masterRoutes);

  app.use("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is healthy",
      data: {
        status: "ok",
        uptime: process.uptime(),
      },
    });
  });

  // Error logging then error handler (must be last)
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
};
