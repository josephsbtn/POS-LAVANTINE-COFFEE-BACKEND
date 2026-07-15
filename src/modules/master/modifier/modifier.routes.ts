import { Router } from "express";
import { ModifierController } from "./modifier.controller";
import { ModifierService } from "./modifier.service";
import { ModifierRepo } from "./modifier.repo";

const modifierRoutes = Router();

const repo = new ModifierRepo();
const service = new ModifierService(repo);
const controller = new ModifierController(service);

modifierRoutes.get("/", controller.getAll);
modifierRoutes.get("/:id", controller.getById);
modifierRoutes.post("/", controller.create);
modifierRoutes.put("/:id", controller.update);
modifierRoutes.delete("/:id", controller.delete);

export default modifierRoutes;
