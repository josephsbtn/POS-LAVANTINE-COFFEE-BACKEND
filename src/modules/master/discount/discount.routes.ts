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

import { authenticate } from "../../../middleware/auth.middleware";

// Protected routes
discountRoutes.use(authenticate());

discountRoutes.post("/validate", controller.validate);

/**
 * @swagger
 * /api/master/discounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of discounts
 */
discountRoutes.get("/", controller.getAll);

/**
 * @swagger
 * /api/master/discounts/{id}:
 *   get:
 *     summary: Get discount by id
 *     tags: [Discount]
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
 *         description: Discount details
 */
discountRoutes.get("/:id", controller.getById);

/**
 * @swagger
 * /api/master/discounts:
 *   post:
 *     summary: Create a new discount
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *               minTransaction:
 *                 type: number
 *               limitUsage:
 *                 type: number
 *     responses:
 *       201:
 *         description: Discount created
 */
discountRoutes.post("/", validateRequest(createDiscountSchema), controller.create);

/**
 * @swagger
 * /api/master/discounts/{id}:
 *   put:
 *     summary: Update discount by id
 *     tags: [Discount]
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
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *               minTransaction:
 *                 type: number
 *               limitUsage:
 *                 type: number
 *     responses:
 *       200:
 *         description: Discount updated
 */
discountRoutes.put("/:id", validateRequest(updateDiscountSchema), controller.update);

/**
 * @swagger
 * /api/master/discounts/{id}:
 *   delete:
 *     summary: Delete discount by id
 *     tags: [Discount]
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
 *         description: Discount deleted
 */
discountRoutes.delete("/:id", controller.delete);

export default discountRoutes;
