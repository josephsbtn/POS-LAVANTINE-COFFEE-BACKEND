import { AuthRepository, ICreateUserPayload } from "./auth.repository";
import { HashService } from "../../infrastructure/services/HashService";
import { JwtService } from "../../infrastructure/services/JwtService";
import { AppError } from "../../utils/AppError";
import type { Role } from "../../shared/types/Role";
import { logger } from "../../utils/logger";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(username: string, password: string) {
    try {
      const user = await this.authRepository.findByUsername(username);

      if (!user) {
        throw AppError.unauthorized("Invalid username or password");
      }

      const isPasswordValid = await HashService.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw AppError.unauthorized("Invalid username or password");
      }

      const token = JwtService.generateToken({
        userId: user._id.toString(),
        username: user.username,
        role: user.role as Role,
      });

      return {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          fullname: user.fullname,
        },
      };
    } catch (error) {
      logger.error("Server error when login" + error);
      throw error;
    }
  }

  async register(payload: ICreateUserPayload) {
    try {
      const exist = await this.authRepository.findByUsername(payload.username);
      if (exist) {
        throw AppError.conflict("Username was used");
      }

      const hashedPassword = await HashService.hash(payload.password);

      await this.authRepository.create({
        ...payload,
        password: hashedPassword,
      });
      return true;
    } catch (error) {
      logger.error("Server error when register" + error);
      throw error;
    }
  }

  async updateUser(id: string, payload: Partial<ICreateUserPayload>) {
    try {
      const user = await this.authRepository.findById(id);
      if (!user) throw AppError.notFound("User not found");

      if (payload.username && payload.username !== user.username) {
        const exist = await this.authRepository.findByUsername(
          payload.username,
        );
        if (exist) throw AppError.conflict("Username already exists");
      }

      await this.authRepository.update(id, payload);
      return true;
    } catch (error) {
      logger.error("Server error when updating user: " + error);
      throw error;
    }
  }

  async getMe(userId: string) {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) throw AppError.notFound("User not found");
    } catch (error) {
      logger.error("Server error when getMe: " + error);
      throw error;
    }
  }

  async getUsers() {
    try {
      return await this.authRepository.findAll({
        projection: { password: 0 },
      });
    } catch (error) {
      logger.error("Server error when getting users: " + error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.authRepository.findById(id);
      if (!user) throw AppError.notFound("User not found");

      await this.authRepository.delete(id);
      return true;
    } catch (error) {
      logger.error("Server error when deleting user: " + error);
      throw error;
    }
  }

  async toggleActive(id: string) {
    try {
      const user = await this.authRepository.findById(id);
      if (!user) throw AppError.notFound("User not found");

      const newStatus = !user.isActive;
      await this.authRepository.update(id, { isActive: newStatus });
      return newStatus;
    } catch (error) {
      logger.error("Server error when toggling user: " + error);
      throw error;
    }
  }
}
