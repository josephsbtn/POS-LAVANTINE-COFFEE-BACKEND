import { Router } from "express";
import { DiscountController } from "./discount.controller";
import { DiscountService } from "./discount.service";
import { DiscountRepo } from "./discount.repo";
import { validateRequest } from "../../../middleware/validate.middleware";
import { createDiscountSchema, updateDiscountSchema } from "./discount.validation";

const discountRoutes = Router();

const repo = new DiscountRepo();
const service = new DiscountService(repo);
const controller = new DiscountController(service);

discountRoutes.get("/", controller.getAll);
discountRoutes.get("/:id", controller.getById);
discountRoutes.post("/", validateRequest(createDiscountSchema), controller.create);
discountRoutes.put("/:id", validateRequest(updateDiscountSchema), controller.update);
discountRoutes.delete("/:id", controller.delete);

export default discountRoutes;
