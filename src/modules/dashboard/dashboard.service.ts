import { DashboardRepository } from "./dashboard.repository";
import {
  DashboardFilterQuery,
  TransactionHistoryQuery,
} from "./interfaces/dashboard.interface";
import { buildSummaryPipeline } from "./aggregation/summary.pipeline";
import { buildRevenuePipeline } from "./aggregation/revenue.pipeline";
import { buildPaymentPipeline } from "./aggregation/payment.pipeline";
import { buildCategoryPipeline } from "./aggregation/category.pipeline";
import { buildBestSellerPipeline } from "./aggregation/bestseller.pipeline";
import { buildUpsellingPipeline } from "./aggregation/upselling.pipeline";
import { CacheHelper } from "../../infrastructure/cache/CacheHelper";
import { buildDateMatchStage } from "./aggregation/utils";
import { DashboardCacheKeys } from "../../infrastructure/cache/KeyManager/Dashboard.Key";

export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  private async getCachedData(
    key: string,
    ttl: number,
    fetcher: () => Promise<any>,
  ) {
    return CacheHelper.getOrSet(key, fetcher, ttl);
  }

  async getSummary(query: DashboardFilterQuery) {
    const cacheKey = DashboardCacheKeys.dynamic("summary", query);
    return this.getCachedData(cacheKey, 60, async () => {
      const pipeline = buildSummaryPipeline(query);
      const [result] = await this.repository.aggregate(pipeline);

      const current = result?.currentPeriod?.[0] || {
        totalRevenue: 0,
        totalTransaction: 0,
      };
      const previous = result?.previousPeriod?.[0] || {
        totalRevenue: 0,
        totalTransaction: 0,
      };

      const currentAvg = current.totalTransaction
        ? current.totalRevenue / current.totalTransaction
        : 0;
      const previousAvg = previous.totalTransaction
        ? previous.totalRevenue / previous.totalTransaction
        : 0;

      const calcGrowth = (curr: number, prev: number) => {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return ((curr - prev) / prev) * 100;
      };

      return {
        totalRevenue: current.totalRevenue,
        totalTransaction: current.totalTransaction,
        averageTransaction: currentAvg,
        revenueGrowthPercentage: calcGrowth(
          current.totalRevenue,
          previous.totalRevenue,
        ),
        transactionGrowthPercentage: calcGrowth(
          current.totalTransaction,
          previous.totalTransaction,
        ),
        averageGrowthPercentage: calcGrowth(currentAvg, previousAvg),
      };
    });
  }

  async getRevenueChart(
    query: DashboardFilterQuery,
    groupBy: "Hour" | "Day" | "Week" | "Month",
  ) {
    const cacheKey = DashboardCacheKeys.dynamic("revenue", { ...query, groupBy });
    return this.getCachedData(cacheKey, 300, async () => {
      const pipeline = buildRevenuePipeline(query, groupBy);
      return await this.repository.aggregate(pipeline);
    });
  }

  async getWeeklySales(query: DashboardFilterQuery) {
    const cacheKey = DashboardCacheKeys.dynamic("weekly", query);
    return this.getCachedData(cacheKey, 300, async () => {
      const pipeline = buildRevenuePipeline(query, "Day");
      const data = await this.repository.aggregate(pipeline);

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return data.map((d: any) => ({
        label: days[new Date(d.date).getDay()],
        total: d.revenue,
      }));
    });
  }

  async getPaymentMethod(query: DashboardFilterQuery) {
    const cacheKey = DashboardCacheKeys.dynamic("payment", query);
    return this.getCachedData(cacheKey, 300, async () => {
      const pipeline = buildPaymentPipeline(query);
      return await this.repository.aggregate(pipeline);
    });
  }

  async getCategorySales(query: DashboardFilterQuery) {
    const cacheKey = DashboardCacheKeys.dynamic("category", query);
    return this.getCachedData(cacheKey, 300, async () => {
      const pipeline = buildCategoryPipeline(query);
      return await this.repository.aggregate(pipeline);
    });
  }

  async getBestSeller(query: DashboardFilterQuery) {
    const cacheKey = DashboardCacheKeys.dynamic("bestseller", query);
    return this.getCachedData(cacheKey, 600, async () => {
      const pipeline = buildBestSellerPipeline(query);
      return await this.repository.aggregate(pipeline);
    });
  }

  async getNeedUpselling(query: DashboardFilterQuery) {
    const cacheKey = DashboardCacheKeys.dynamic("upselling", query);
    return this.getCachedData(cacheKey, 600, async () => {
      const pipeline = buildUpsellingPipeline(query);
      return await this.repository.aggregate(pipeline);
    });
  }

  async getTransactionHistory(query: TransactionHistoryQuery) {
    const match = buildDateMatchStage(query).$match;
    if (query.search) {
      match.invoiceNumber = { $regex: query.search, $options: "i" };
    }
    if (query.paymentMethod) {
      match.paymentMethod = query.paymentMethod;
    }
    if (query.cashierId) {
      match.cashier = query.cashierId;
    }

    const page = query.page || 1;
    const limit = query.limit || 10;

    const data = await this.repository.findAll({
      filter: match,
      page,
      limit,
      sort: { createdAt: -1 } as any,
      populate: { path: "cashier", select: "username" },
    });

    const items = data.data.map((t: any) => ({
      _id: t._id,
      invoiceNumber: t.invoiceNumber,
      date: t.createdAt,
      cashier: t.cashier?.username || "Unknown",
      total: t.total,
      paymentMethod: t.paymentMethod,
    }));

    return {
      items,
      pagination: data.pagination,
    };
  }

  async getMobileDashboard(query: DashboardFilterQuery) {
    const [summary, weeklySales, categorySales] = await Promise.all([
      this.getSummary(query),
      this.getWeeklySales(query),
      this.getCategorySales(query),
    ]);

    return {
      todayRevenue: summary.totalRevenue,
      todayTransaction: summary.totalTransaction,
      averageOrder: summary.averageTransaction,
      weeklySales,
      categorySales,
    };
  }
}
