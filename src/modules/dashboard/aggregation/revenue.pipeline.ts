import { PipelineStage } from "mongoose";
import { DashboardFilterQuery } from "../interfaces/dashboard.interface";
import { buildDateMatchStage } from "./utils";

export const buildRevenuePipeline = (
  query: DashboardFilterQuery,
  groupBy: "Hour" | "Day" | "Week" | "Month"
): PipelineStage[] => {
  const match = buildDateMatchStage(query);

  let dateStringFormat = "%Y-%m-%d"; // Day
  if (groupBy === "Hour") dateStringFormat = "%Y-%m-%d %H:00";
  else if (groupBy === "Week") dateStringFormat = "%Y-%U";
  else if (groupBy === "Month") dateStringFormat = "%Y-%m";

  return [
    match,
    {
      $group: {
        _id: {
          $dateToString: { format: dateStringFormat, date: "$createdAt" },
        },
        revenue: { $sum: "$total" },
        transaction: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
        transaction: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ];
};
