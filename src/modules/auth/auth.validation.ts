import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  username: z.string().min(3, "Username minimum 3 characters"),
  password: z.string().min(6, "Password minimum 6 characters"),
  fullname: z.string().optional(),
  role: z.enum(["MANAGER", "STAFF"]),
});

export const updateUserSchema = z.object({
  username: z.string().min(3, "Username minimum 3 characters").optional(),
  fullname: z.string().optional(),
  role: z.enum(["MANAGER", "STAFF"]).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
