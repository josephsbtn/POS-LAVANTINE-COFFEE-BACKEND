import { z } from "zod";

export const createDiscountSchema = z.object({
  code: z.string().min(1, "code is required"),
  name: z.string().min(1, "name is required"),
  value: z.coerce.number().min(0, "value must be non-negative"),
  minTransaction: z.coerce.number().min(0, "minTransaction must be non-negative"),
  limitUsage: z.coerce.number().min(1, "limitUsage must be at least 1"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateDiscountSchema = createDiscountSchema.partial();
