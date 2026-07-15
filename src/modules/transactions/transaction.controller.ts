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
}
