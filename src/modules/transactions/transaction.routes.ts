import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TransactionRepo } from "./transactions.repo";

const transactionRoutes = Router();

const repo = new TransactionRepo();
const service = new TransactionService(repo);
const controller = new TransactionController(service);

import { authenticate } from "../../middleware/auth.middleware";

// Protected routes
transactionRoutes.use(authenticate());

// Current controller only exposes getAll
/**
 * @swagger
 * /api/transactions/get-all:
 *   post:
 *     summary: Get all transactions with filter
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: List of transactions
 */
transactionRoutes.post("/", controller.create);
transactionRoutes.post("/get-all", controller.getAll); // Note: getAll in controller expects req.body for filter options
transactionRoutes.get("/:id", controller.getById);
transactionRoutes.patch("/:id/status", controller.updateStatus);

export default transactionRoutes;
