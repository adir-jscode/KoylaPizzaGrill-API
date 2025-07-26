import { z } from "zod";

export const createAdminZodSchema = z.object({
  username: z
    .string()
    .min(3, "Username is required and must be at least 3 characters"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z
    .string()
    .min(6, "Password is required and must be at least 6 characters"),
  isActive: z.boolean().optional(),
  last_login: z.date().optional(),
});

export const updateAdminZodSchema = z.object({
  username: z.string().min(3).optional(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  isActive: z.boolean().optional(),
  last_login: z.date().optional(),
});
