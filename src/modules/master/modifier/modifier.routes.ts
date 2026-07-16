import { Router } from "express";
import { ModifierController } from "./modifier.controller";
import { ModifierService } from "./modifier.service";
import { ModifierRepo } from "./modifier.repo";

const modifierRoutes = Router();

const repo = new ModifierRepo();
const service = new ModifierService(repo);
const controller = new ModifierController(service);

import { authenticate } from "../../../middleware/auth.middleware";

// Protected routes
modifierRoutes.use(authenticate());

/**
 * @swagger
 * /api/master/modifiers:
 *   get:
 *     summary: Get all modifiers
 *     tags: [Modifier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of modifiers
 */
modifierRoutes.get("/", controller.getAll);

/**
 * @swagger
 * /api/master/modifiers/{id}:
 *   get:
 *     summary: Get modifier by id
 *     tags: [Modifier]
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
 *         description: Modifier details
 */
modifierRoutes.get("/:id", controller.getById);

/**
 * @swagger
 * /api/master/modifiers:
 *   post:
 *     summary: Create a new modifier
 *     tags: [Modifier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupName:
 *                 type: string
 *               isRequired:
 *                 type: boolean
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Modifier created
 */
modifierRoutes.post("/", controller.create);

/**
 * @swagger
 * /api/master/modifiers/{id}:
 *   put:
 *     summary: Update modifier by id
 *     tags: [Modifier]
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
 *               groupName:
 *                 type: string
 *               isRequired:
 *                 type: boolean
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Modifier updated
 */
modifierRoutes.put("/:id", controller.update);

/**
 * @swagger
 * /api/master/modifiers/{id}:
 *   delete:
 *     summary: Delete modifier by id
 *     tags: [Modifier]
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
 *         description: Modifier deleted
 */
modifierRoutes.delete("/:id", controller.delete);

export default modifierRoutes;
