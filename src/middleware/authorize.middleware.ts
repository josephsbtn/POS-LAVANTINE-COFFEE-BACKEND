import type { Request, Response, NextFunction } from "express";
import { Role } from "../shared/types/Role";
import { ApiResponse } from "../utils/ApiResponse";

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        "You do not have permission to access this resource",
      );
    }
    next();
  };
};
