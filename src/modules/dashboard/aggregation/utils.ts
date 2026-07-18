import { PipelineStage } from "mongoose";
import { DashboardFilterQuery } from "../interfaces/dashboard.interface";

export const buildDateMatchStage = (query: DashboardFilterQuery): PipelineStage.Match => {
  const match: any = {};
  if (query.startDate || query.endDate) {
    match.createdAt = {};
    if (query.startDate) match.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      match.createdAt.$lte = end;
    }
  }
  return { $match: match };
};
