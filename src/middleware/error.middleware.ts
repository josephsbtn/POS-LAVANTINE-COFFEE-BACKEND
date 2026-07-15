import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return ApiResponse.validationError(res, errors);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiResponse.validationError(res, errors);
  }

  if (err instanceof mongoose.Error.CastError) {
    return ApiResponse.badRequest(res, `Invalid ${err.path}: ${err.value}`);
  }

  if (err instanceof Error && "code" in err && (err as any).code === 11000) {
    const keyValue = (err as any).keyValue ?? {};
    const field = Object.keys(keyValue)[0] ?? "field";
    return ApiResponse.conflict(res, `Duplicate value for '${field}'`);
  }

  if (err instanceof Error) {
    if (err.name === "TokenExpiredError") {
      return ApiResponse.unauthorized(res, "Token has expired");
    }
    if (err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
      return ApiResponse.unauthorized(res, "Invalid token");
    }
  }

  logger.error(err, "Unhandled error");

  const message =
    env.NODE_ENV === "PROD"
      ? "Internal Server Error"
      : ((err as Error)?.message ?? "Unknown error");

  return ApiResponse.serverError(res, message);
};
