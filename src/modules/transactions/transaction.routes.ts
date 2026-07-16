import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TransactionRepo } from "./transactions.repo";

const transactionRoutes = Router();

const repo = new TransactionRepo();
const service = new TransactionService(repo);
const controller = new TransactionController(service);

// Current controller only exposes getAll
transactionRoutes.post("/get-all", controller.getAll); // Note: getAll in controller expects req.body for filter options

export default transactionRoutes;
