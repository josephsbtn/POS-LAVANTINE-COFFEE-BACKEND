import { Router } from "express";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepo } from "./category.repo";

const categoryRoutes = Router();

const repo = new CategoryRepo();
const service = new CategoryService(repo);
const controller = new CategoryController(service);

categoryRoutes.get("/", controller.getAll);
categoryRoutes.get("/:id", controller.getById);
categoryRoutes.post("/", controller.create);
categoryRoutes.put("/:id", controller.update);
categoryRoutes.delete("/:id", controller.delete);

export default categoryRoutes;
