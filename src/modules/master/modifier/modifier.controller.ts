import { NextFunction, Request, Response } from "express";
import { ModifierService } from "./modifier.service";
import { QueryOptions } from "../../../database/BaseRepository";
import { IModifierDocument } from "./modifier.types";
import { ApiResponse } from "../../../utils/ApiResponse";

export class ModifierController {
  constructor(private readonly service: ModifierService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = req.query as unknown as QueryOptions<IModifierDocument>;
      const result = await this.service.getAllModifiers(options);
      return ApiResponse.success(res, result, "Successfully fetched modifiers");
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getModifierById(id);
      if (!result) {
        return ApiResponse.notFound(res, "Modifier not found");
      }
      return ApiResponse.success(res, result, "Successfully fetched modifier");
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createModifier(req.body);
      return ApiResponse.created(res, result, "Successfully created modifier");
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.updateModifier(id, req.body);
      if (!result) {
        return ApiResponse.notFound(res, "Modifier not found");
      }
      return ApiResponse.success(res, result, "Successfully updated modifier");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = await this.service.deleteModifier(id);
      if (!result) {
        return ApiResponse.notFound(res, "Modifier not found");
      }
      return ApiResponse.success(res, null, "Successfully deleted modifier");
    } catch (error) {
      next(error);
    }
  };
}
