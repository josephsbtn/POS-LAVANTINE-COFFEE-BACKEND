import type { Request, Response, NextFunction } from "express";
import { JwtService } from "../infrastructure/services/JwtService";
import { ApiResponse } from "../utils/ApiResponse";
import { AppError } from "../utils/AppError";

export const authenticate = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return ApiResponse.unauthorized(res, "Missing authorization header");
      }

      const parts = authHeader.split(" ");

      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return ApiResponse.unauthorized(res, "Invalid authorization format");
      }

      const token = parts[1];
      const decoded = JwtService.verifyToken(token);

      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return ApiResponse.unauthorized(res, "Token has expired");
      }
      if (error.name === "JsonWebTokenError") {
        return ApiResponse.unauthorized(res, "Invalid token");
      }
      return ApiResponse.unauthorized(res, "Unauthorized");
    }
  };
};
