import { Router } from "express";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { ItemRepo } from "./item.repo";
import { uploadItemImage } from "../../../middleware/upload.middleware";

const itemRoutes = Router();

const repo = new ItemRepo();
const service = new ItemService(repo);
const controller = new ItemController(service);

itemRoutes.get("/", controller.getAll);
itemRoutes.get("/:id", controller.getById);

// uploadItemImage.single("image") accepts form-data with the file in the "image" field
itemRoutes.post("/", uploadItemImage.single("image"), controller.create);
itemRoutes.put("/:id", uploadItemImage.single("image"), controller.update);

itemRoutes.delete("/:id", controller.delete);

itemRoutes.patch("/:id/availability", controller.changeAvailability);

export default itemRoutes;
