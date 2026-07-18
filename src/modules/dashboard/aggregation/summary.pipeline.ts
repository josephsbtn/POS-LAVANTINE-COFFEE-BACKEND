import { PipelineStage } from "mongoose";
import { DashboardFilterQuery } from "../interfaces/dashboard.interface";
import { buildDateMatchStage } from "./utils";

export const buildSummaryPipeline = (query: DashboardFilterQuery): PipelineStage[] => {
  const match = buildDateMatchStage(query).$match;

  const prevMatch: any = {};
  if (query.startDate && query.endDate) {
    const start = new Date(query.startDate);
    const end = new Date(query.endDate);
    end.setHours(23, 59, 59, 999);
    
    const diff = end.getTime() - start.getTime();
    
    const prevStart = new Date(start.getTime() - diff);
    const prevEnd = new Date(end.getTime() - diff);
    
    prevMatch.createdAt = {
      $gte: prevStart,
      $lte: prevEnd,
    };
  } else {
    // If no explicit dates, we assume full time vs nothing, so growth is 0
    prevMatch._id = null; // Impossible match
  }

  return [
    {
      $facet: {
        currentPeriod: [
          { $match: match },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total" },
              totalTransaction: { $sum: 1 },
            },
          },
        ],
        previousPeriod: [
          { $match: prevMatch },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total" },
              totalTransaction: { $sum: 1 },
            },
          },
        ],
      },
    },
  ];
};
