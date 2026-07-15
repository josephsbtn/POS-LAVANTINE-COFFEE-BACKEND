import { z } from "zod";

const stringToJSON = (schema: z.ZodType<any, any>) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
    return val;
  }, schema);

const addonSchema = z.object({
  name: z.string().min(1, "Addon name is required"),
  price: z.number().min(0, "Addon price must be non-negative"),
});

export const createItemSchema = z.object({
  categoryId: z.string().min(1, "categoryId is required"),
  name: z.string().min(1, "name is required"),
  price: z.coerce.number().min(0, "price must be non-negative"),
  isAvailable: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === "true")
    .optional(),
  imageUrl: z.string().optional(),
  modifier: stringToJSON(z.array(z.string())).optional(),
  addon: stringToJSON(z.array(addonSchema)).optional(),
});

export const updateItemSchema = createItemSchema.partial();
