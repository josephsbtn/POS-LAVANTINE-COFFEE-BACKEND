import { PipelineStage } from "mongoose";
import { DashboardFilterQuery } from "../interfaces/dashboard.interface";
import { buildDateMatchStage } from "./utils";

export const buildPaymentPipeline = (query: DashboardFilterQuery): PipelineStage[] => {
  return [
    buildDateMatchStage(query),
    {
      $group: {
        _id: { $toLower: "$paymentMethod" },
        total: { $sum: "$total" },
      },
    },
    {
      $setWindowFields: {
        output: {
          grandTotal: {
            $sum: "$total",
            window: { documents: ["unbounded", "unbounded"] },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        method: {
          $concat: [
            { $toUpper: { $substrCP: ["$_id", 0, 1] } },
            { $substrCP: ["$_id", 1, { $strLenCP: "$_id" }] }
          ]
        },
        total: 1,
        percentage: {
          $cond: [
            { $eq: ["$grandTotal", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$total", "$grandTotal"] }, 100] }, 2] },
          ],
        },
      },
    },
  ];
};
