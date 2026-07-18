import { PipelineStage } from "mongoose";
import { DashboardFilterQuery } from "../interfaces/dashboard.interface";
import { buildDateMatchStage } from "./utils";

export const buildCategoryPipeline = (query: DashboardFilterQuery): PipelineStage[] => {
  return [
    buildDateMatchStage(query),
    { $unwind: "$items" },
    {
      $lookup: {
        from: "items",
        localField: "items.itemId",
        foreignField: "_id",
        as: "itemDetails",
      },
    },
    { $unwind: "$itemDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "itemDetails.categoryId",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ["$categoryDetails.name", "Uncategorized"] },
        total: { $sum: "$items.subtotal" },
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
        category: "$_id",
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
    { $sort: { total: -1 } },
  ];
};
