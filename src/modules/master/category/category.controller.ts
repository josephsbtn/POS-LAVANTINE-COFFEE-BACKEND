import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";
import { QueryOptions } from "../../../database/BaseRepository";
import { ICategoryDocument } from "./category.types";
import { ApiResponse } from "../../../utils/ApiResponse";

export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = req.query as unknown as QueryOptions<ICategoryDocument>;
      const result = await this.service.getAllCategories(options);
      return ApiResponse.success(
        res,
        result,
        "Successfully fetched categories",
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getCategoryById(id);
      if (!result) {
        return ApiResponse.notFound(res, "Category not found");
      }
      return ApiResponse.success(res, result, "Successfully fetched category");
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createCategory(req.body);
      return ApiResponse.created(res, result, "Successfully created category");
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.updateCategory(id, req.body);
      if (!result) {
        return ApiResponse.notFound(res, "Category not found");
      }
      return ApiResponse.success(res, result, "Successfully updated category");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.deleteCategory(id);
      if (!result) {
        return ApiResponse.notFound(res, "Category not found");
      }
      return ApiResponse.success(res, null, "Successfully deleted category");
    } catch (error) {
      next(error);
    }
  };
}
