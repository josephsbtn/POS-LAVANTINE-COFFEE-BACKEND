import { NextFunction, Request, Response } from "express";
import { DiscountService } from "./discount.service";
import { ApiResponse } from "../../../utils/ApiResponse";
import { createDiscountSchema, updateDiscountSchema } from "./discount.validation";

export class DiscountController {
  constructor(private readonly service: DiscountService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAllDiscounts();
      return ApiResponse.success(res, result, "Successfully fetched discounts");
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getDiscountById(id);
      if (!result) {
        return ApiResponse.notFound(res, "Discount not found");
      }
      return ApiResponse.success(res, result, "Successfully fetched discount");
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = createDiscountSchema.parse(req.body);
      const result = await this.service.createDiscount(parsedBody);
      return ApiResponse.created(res, result, "Successfully created discount");
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const parsedBody = updateDiscountSchema.parse(req.body);
      const result = await this.service.updateDiscount(id, parsedBody);
      if (!result) {
        return ApiResponse.notFound(res, "Discount not found");
      }
      return ApiResponse.success(res, result, "Successfully updated discount");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.deleteDiscount(id);
      if (!result) {
        return ApiResponse.notFound(res, "Discount not found");
      }
      return ApiResponse.success(res, null, "Successfully deleted discount");
    } catch (error) {
      next(error);
    }
  };
}
