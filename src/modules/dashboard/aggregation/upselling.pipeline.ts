import { PipelineStage } from "mongoose";
import { DashboardFilterQuery } from "../interfaces/dashboard.interface";
import { buildDateMatchStage } from "./utils";

export const buildUpsellingPipeline = (query: DashboardFilterQuery): PipelineStage[] => {
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
        isAvailable: "$itemDetails.isAvailable",
        quantitySold: 1,
        revenue: 1,
        price: "$itemDetails.price",
      },
    },
    // We want low quantitySold and high price (as a margin proxy)
    { $sort: { quantitySold: 1, price: -1 } },
    { $limit: 5 },
  ];
};
