import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),

  firstName: z.string().trim().min(1, "First name is required"),

  lastName: z.string().trim().min(1, "Last name is required"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform((email) => email.toLowerCase()),

  password: z.string().min(4, "Password must be at least 4 characters"),
});
