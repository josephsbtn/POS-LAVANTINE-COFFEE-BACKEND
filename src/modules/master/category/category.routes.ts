import { Router } from "express";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepo } from "./category.repo";
import { validateRequest } from "../../../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "./category.validation";
import { authenticate } from "../../../middleware/auth.middleware";

const categoryRoutes = Router();

const repo = new CategoryRepo();
const service = new CategoryService(repo);
const controller = new CategoryController(service);

// Protected routes
categoryRoutes.use(authenticate());

/**
 * @swagger
 * /api/master/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
categoryRoutes.get("/", controller.getAll);

/**
 * @swagger
 * /api/master/categories/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Category]
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
 *         description: Category details
 */
categoryRoutes.get("/:id", controller.getById);

/**
 * @swagger
 * /api/master/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
categoryRoutes.post("/", validateRequest(createCategorySchema), controller.create);

/**
 * @swagger
 * /api/master/categories/{id}:
 *   put:
 *     summary: Update category by id
 *     tags: [Category]
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
 *     responses:
 *       200:
 *         description: Category updated
 */
categoryRoutes.put("/:id", validateRequest(updateCategorySchema), controller.update);

/**
 * @swagger
 * /api/master/categories/{id}:
 *   delete:
 *     summary: Delete category by id
 *     tags: [Category]
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
 *         description: Category deleted
 */
categoryRoutes.delete("/:id", controller.delete);

export default categoryRoutes;
