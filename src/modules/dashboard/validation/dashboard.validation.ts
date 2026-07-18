import { z } from "zod";

export const dashboardFilterSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const dashboardChartFilterSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    groupBy: z.enum(["Hour", "Day", "Week", "Month"]).optional().default("Day"),
  }),
});

export const transactionHistoryFilterSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    search: z.string().optional(),
    paymentMethod: z.string().optional(),
    cashierId: z.string().optional(),
  }),
});
