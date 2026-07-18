import { PipelineStage } from "mongoose";
import { DashboardFilterQuery } from "../interfaces/dashboard.interface";
import { buildDateMatchStage } from "./utils";

export const buildBestSellerPipeline = (query: DashboardFilterQuery): PipelineStage[] => {
  return [
    buildDateMatchStage(query),
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.itemId",
        quantitySold: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.subtotal" },
      },
    },
    {
      $lookup: {
        from: "items",
        localField: "_id",
        foreignField: "_id",
        as: "itemDetails",
      },
    },
    { $unwind: "$itemDetails" },
    {
      $project: {
        _id: 0,
        itemId: "$_id",
        name: "$itemDetails.name",
        image: "$itemDetails.imageUrl",
        quantitySold: 1,
        revenue: 1,
      },
    },
    { $sort: { quantitySold: -1, revenue: -1 } },
    { $limit: 5 },
  ];
};
