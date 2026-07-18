import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { QueryOptions } from "../../database/BaseRepository";
import { ITransactionDocument } from "./transaction.types";
import { ApiResponse } from "../../utils/ApiResponse";

export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filter, lean, limit, page, populate, projection, sort } =
        req.body as QueryOptions<ITransactionDocument>;
      const result = await this.service.getAllTransaction(req.body);
      return ApiResponse.success(
        res,
        result,
        "Success Fetch all data Transaction",
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getDetailTransaction(req.params.id);
      if (!result) {
        return ApiResponse.error(res, "Transaction not found", 404);
      }
      return ApiResponse.success(res, result, "Success Fetch Detail Transaction");
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      if ((req as any).user && (req as any).user.userId) {
        payload.cashier = (req as any).user.userId;
      }
      const result = await this.service.create(payload);
      return ApiResponse.created(res, result, "Successfully created transaction");
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return ApiResponse.badRequest(res, "Status is required");
      }
      const result = await this.service.changeStatus(id, status);
      if (!result) {
        return ApiResponse.notFound(res, "Transaction not found");
      }
      return ApiResponse.success(res, result, "Successfully updated status");
    } catch (error) {
      next(error);
    }
  };
}
