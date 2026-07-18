import type { Request, Response, NextFunction } from "express";
import { JwtService } from "../infrastructure/services/JwtService";
import { ApiResponse } from "../utils/ApiResponse";
import { AppError } from "../utils/AppError";

export const authenticate = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.cookies?.token;

      if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }

      if (!token) {
        return ApiResponse.unauthorized(res, "Missing authentication token");
      }
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
