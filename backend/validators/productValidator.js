import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .default(""),
  quantity: z
    .number({
      error: "Quantity is required and must be a number",
    })
    .finite("Quantity must be a finite number")
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),

  price: z
    .number({
      error: "Price is required and must be a number",
    })
    .finite("Price must be a finite number")
    .min(0, "Price cannot be negative"),

  imgs: z
    .array(z.string().url("Please enter a valid image URL"))
    .min(1, "At least one image URL is required")
    .optional(),
});
