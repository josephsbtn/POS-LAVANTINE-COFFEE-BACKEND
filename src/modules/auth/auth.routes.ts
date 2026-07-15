import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/login", authController.login);

// Protected routes
router.use(authenticate());

router.post("/register", authController.register);
router.get("/me", authController.getMe);
router.get("/users", authController.getUsers);
router.patch("/:id", authController.updateUser);
router.delete("/:id", authController.deleteUser);
router.patch("/:id/toggle-active", authController.toggleActive);

export default router;
