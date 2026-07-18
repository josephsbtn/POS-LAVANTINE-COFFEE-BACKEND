import { NextFunction, Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { DashboardFilterQuery, TransactionHistoryQuery } from "./interfaces/dashboard.interface";

export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  getSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as DashboardFilterQuery;
      const data = await this.service.getSummary(query);
      return ApiResponse.success(res, data, "Dashboard summary retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getRevenueChart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { groupBy, ...query } = req.query as any;
      const data = await this.service.getRevenueChart(query, groupBy);
      return ApiResponse.success(res, data, "Revenue chart retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getWeeklySales = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as DashboardFilterQuery;
      const data = await this.service.getWeeklySales(query);
      return ApiResponse.success(res, data, "Weekly sales retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getPaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as DashboardFilterQuery;
      const data = await this.service.getPaymentMethod(query);
      return ApiResponse.success(res, data, "Payment method stats retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getCategorySales = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as DashboardFilterQuery;
      const data = await this.service.getCategorySales(query);
      return ApiResponse.success(res, data, "Category sales retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getBestSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as DashboardFilterQuery;
      const data = await this.service.getBestSeller(query);
      return ApiResponse.success(res, data, "Best sellers retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getNeedUpselling = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as DashboardFilterQuery;
      const data = await this.service.getNeedUpselling(query);
      return ApiResponse.success(res, data, "Need upselling items retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getTransactionHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as TransactionHistoryQuery;
      const data = await this.service.getTransactionHistory(query);
      return ApiResponse.success(res, data, "Transaction history retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getMobileDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as DashboardFilterQuery;
      const data = await this.service.getMobileDashboard(query);
      return ApiResponse.success(res, data, "Mobile dashboard retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
}
