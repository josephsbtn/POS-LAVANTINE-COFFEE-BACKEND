import { Router } from "express";
import categoryRoutes from "./category/category.routes";
import itemRoutes from "./items/item.routes";
import modifierRoutes from "./modifier/modifier.routes";
import discountRoutes from "./discount/discount.routes";

const masterRoutes = Router();

masterRoutes.use("/categories", categoryRoutes);
masterRoutes.use("/items", itemRoutes);
masterRoutes.use("/modifiers", modifierRoutes);
masterRoutes.use("/discounts", discountRoutes);

export default masterRoutes;
