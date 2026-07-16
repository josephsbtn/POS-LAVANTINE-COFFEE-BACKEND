import { Router } from "express";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepo } from "./category.repo";
import { validateRequest } from "../../../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "./category.validation";

const categoryRoutes = Router();

const repo = new CategoryRepo();
const service = new CategoryService(repo);
const controller = new CategoryController(service);

categoryRoutes.get("/", controller.getAll);
categoryRoutes.get("/:id", controller.getById);
categoryRoutes.post("/", validateRequest(createCategorySchema), controller.create);
categoryRoutes.put("/:id", validateRequest(updateCategorySchema), controller.update);
categoryRoutes.delete("/:id", controller.delete);

export default categoryRoutes;
