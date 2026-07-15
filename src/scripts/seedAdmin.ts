import mongoose from "mongoose";
import "dotenv/config";
import { dbconnect } from "../database/client";
import { env } from "../config/env";
import UserModel from "../database/schema/user/UserModel";
import { HashService } from "../infrastructure/services/HashService";
import { Role } from "../shared/types/Role";
import { logger } from "../utils/logger";

const seedAdmin = async () => {
  try {
    await dbconnect(env.MONGO_URI);
    
    const existingAdmin = await UserModel.findOne({ username: "admin" });
    if (existingAdmin) {
      logger.info("✅ Admin user already exists. Skipping seed.");
      process.exit(0);
    }

    const hashedPassword = await HashService.hash("admin123");

    await UserModel.create({
      username: "admin",
      password: hashedPassword,
      role: Role.MANAGER,
      fullname: "Super Administrator",
      isActive: true,
    });

    logger.info("✅ Admin user seeded successfully!");
    logger.info("👉 Username: admin");
    logger.info("👉 Password: admin123");
    
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "❌ Failed to seed admin");
    process.exit(1);
  }
};

seedAdmin();
