import { Router } from "express";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { ItemRepo } from "./item.repo";
import { handleSingleUpload } from "../../../middleware/upload.middleware";
import { validateRequest } from "../../../middleware/validate.middleware";
import { createItemSchema, updateItemSchema } from "./item.validation";

const itemRoutes = Router();

const repo = new ItemRepo();
const service = new ItemService(repo);
const controller = new ItemController(service);

import { authenticate } from "../../../middleware/auth.middleware";

itemRoutes.use(authenticate());

/**
 * @swagger
 * /api/master/items:
 *   get:
 *     summary: Get all items
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of items
 */
itemRoutes.get("/", controller.getAll);

/**
 * @swagger
 * /api/master/items/{id}:
 *   get:
 *     summary: Get item by id
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item details
 */
itemRoutes.get("/:id", controller.getById);

/**
 * @swagger
 * /api/master/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Item created
 */
itemRoutes.post(
  "/",
  handleSingleUpload("image"),
  validateRequest(createItemSchema),
  controller.create,
);

/**
 * @swagger
 * /api/master/items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Item updated
 */
itemRoutes.put(
  "/:id",
  handleSingleUpload("image"),
  validateRequest(updateItemSchema),
  controller.update,
);

/**
 * @swagger
 * /api/master/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 */
itemRoutes.delete("/:id", controller.delete);

/**
 * @swagger
 * /api/master/items/{id}/availability:
 *   patch:
 *     summary: Toggle item availability
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Availability toggled
 */
itemRoutes.patch("/:id/availability", controller.changeAvailability);

export default itemRoutes;
