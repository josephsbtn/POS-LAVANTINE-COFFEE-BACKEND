import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import {
  loginSchema,
  createUserSchema,
  updateUserSchema,
} from "./auth.validation";
import { ApiResponse } from "../../utils/ApiResponse";
import { AppError } from "../../utils/AppError";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await this.authService.login(
        validated.username,
        validated.password,
      );
      
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge
      });

      return ApiResponse.success(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('token');
      return ApiResponse.success(res, null, "Logout successful");
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = createUserSchema.parse(req.body);
      await this.authService.register(validated as any);
      return ApiResponse.created(res, null, "User created successfully");
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = updateUserSchema.parse(req.body);
      await this.authService.updateUser(
        req.params.id as string,
        validated as any,
      );
      return ApiResponse.success(res, null, "User updated successfully");
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.");
      }
      const userId = req.user.userId;
      const user = await this.authService.getMe(userId);
      return ApiResponse.success(res, { user }, "User profile retrieved");
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.getUsers();
      return ApiResponse.success(
        res,
        result.data,
        "Users retrieved successfully",
        {
          pagination: result.pagination,
        },
      );
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.deleteUser(req.params.id as string);
      return ApiResponse.success(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  toggleActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newStatus = await this.authService.toggleActive(
        req.params.id as string,
      );
      return ApiResponse.success(
        res,
        { isActive: newStatus },
        "User status updated successfully",
      );
    } catch (error) {
      next(error);
    }
  };
}
