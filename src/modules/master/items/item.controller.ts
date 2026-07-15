import { NextFunction, Request, Response } from "express";
import { ItemService } from "./item.service";
import { QueryOptions } from "../../../database/BaseRepository";
import { IItemDocument } from "./item.types";
import { ApiResponse } from "../../../utils/ApiResponse";
import { createItemSchema, updateItemSchema } from "./item.validation";

export class ItemController {
  constructor(private readonly service: ItemService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = req.query as unknown as QueryOptions<IItemDocument>;
      const result = await this.service.getAllItems(options);
      return ApiResponse.success(res, result, "Successfully fetched items");
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getItemById(id);
      if (!result) {
        return ApiResponse.notFound(res, "Item not found");
      }
      return ApiResponse.success(res, result, "Successfully fetched item");
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = createItemSchema.parse(req.body);
      const payload = { ...parsedBody };

      if (req.file) {
        payload.imageUrl = `/uploads/items/${req.file.filename}`;
      }

      const result = await this.service.createItem(payload);
      return ApiResponse.created(res, result, "Successfully created item");
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const parsedBody = updateItemSchema.parse(req.body);
      const payload = { ...parsedBody };

      if (req.file) {
        payload.imageUrl = `/uploads/items/${req.file.filename}`;
      }

      const result = await this.service.updateItem(id, payload);
      if (!result) {
        return ApiResponse.notFound(res, "Item not found");
      }
      return ApiResponse.success(res, result, "Successfully updated item");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.deleteItem(id);
      if (!result) {
        return ApiResponse.notFound(res, "Item not found");
      }
      return ApiResponse.success(res, null, "Successfully deleted item");
    } catch (error) {
      next(error);
    }
  };

  changeAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const { isAvailable } = req.body;

      if (typeof isAvailable !== "boolean") {
        return ApiResponse.badRequest(res, "isAvailable must be a boolean");
      }

      const result = await this.service.changeAvailability(id, isAvailable);
      if (!result) {
        return ApiResponse.notFound(res, "Item not found");
      }
      return ApiResponse.success(res, result, "Successfully changed item availability");
    } catch (error) {
      next(error);
    }
  };
}
