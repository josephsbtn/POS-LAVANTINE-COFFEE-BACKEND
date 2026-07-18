import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { DashboardRepository } from "./dashboard.repository";
import { authenticate } from "../../middleware/auth.middleware";
import { validateQuery } from "../../middleware/validate.middleware";
import {
  dashboardFilterSchema,
  dashboardChartFilterSchema,
  transactionHistoryFilterSchema,
} from "./validation/dashboard.validation";

const dashboardRoutes = Router();
const repository = new DashboardRepository();
const service = new DashboardService(repository);
const controller = new DashboardController(service);

// Authenticate all dashboard endpoints
dashboardRoutes.use(authenticate());

dashboardRoutes.get(
  "/summary",
  validateQuery(dashboardFilterSchema.shape.query),
  controller.getSummary
);

dashboardRoutes.get(
  "/revenue-chart",
  validateQuery(dashboardChartFilterSchema.shape.query),
  controller.getRevenueChart
);

dashboardRoutes.get(
  "/weekly-sales",
  validateQuery(dashboardFilterSchema.shape.query),
  controller.getWeeklySales
);

dashboardRoutes.get(
  "/payment-method",
  validateQuery(dashboardFilterSchema.shape.query),
  controller.getPaymentMethod
);

dashboardRoutes.get(
  "/category-sales",
  validateQuery(dashboardFilterSchema.shape.query),
  controller.getCategorySales
);

dashboardRoutes.get(
  "/best-seller",
  validateQuery(dashboardFilterSchema.shape.query),
  controller.getBestSeller
);

dashboardRoutes.get(
  "/need-upselling",
  validateQuery(dashboardFilterSchema.shape.query),
  controller.getNeedUpselling
);

dashboardRoutes.get(
  "/transaction-history",
  validateQuery(transactionHistoryFilterSchema.shape.query),
  controller.getTransactionHistory
);

dashboardRoutes.get(
  "/mobile",
  validateQuery(dashboardFilterSchema.shape.query),
  controller.getMobileDashboard
);

export default dashboardRoutes;
