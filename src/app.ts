import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger, errorLogger } from "./utils/logger";
import { corsConfig } from "./config/CorsConfig";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import masterRoutes from "./modules/master/master.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

export const createApp = () => {
  const app = express();

  app.use(express.json({ limit: "5mb" }));
  app.use(cookieParser());
  app.use(cors(corsConfig));
  app.use(requestLogger);

  // Static files for uploads (bisa diakses frontend via /uploads/items/namafile.jpg)
  app.use("/uploads", express.static("public/uploads"));

  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/master", masterRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/dashboard", dashboardRoutes);

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
