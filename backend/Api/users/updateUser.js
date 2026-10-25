import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import authenticateToken from "../../jwt/authenticateToken.js";

const router = express.Router();

const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .optional(),

    firstName: z.string().trim().min(1, "First name is required").optional(),

    lastName: z.string().trim().min(1, "Last name is required").optional(),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email")
      .transform((email) => email.toLowerCase())
      .optional(),

    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

router.put("/update-user/:id", authenticateToken, async (req, res) => {
  try {
    // 1. Validate MongoDB user ID
    const idResult = z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
      .safeParse(req.params.id);

    if (!idResult.success) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    // 2. Users can update only their own account
    if (req.user.id !== idResult.data) {
      return res.status(403).json({
        error: "You can only update your own account",
      });
    }

    // 3. Validate request body
    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const updates = { ...result.data };

    // 4. Check for duplicate username or email
    const duplicateConditions = [];

    if (updates.username) {
      duplicateConditions.push({ username: updates.username });
    }

    if (updates.email) {
      duplicateConditions.push({ email: updates.email });
    }

    if (duplicateConditions.length > 0) {
      const existingUser = await User.findOne({
        _id: { $ne: req.user.id },
        $or: duplicateConditions,
      });

      if (existingUser) {
        return res.status(409).json({
          error: "Username or email already exists",
        });
      }
    }

    // 5. Hash password if the request includes one
    if (updates.password !== undefined) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    // 6. Update MongoDB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Username or email already exists",
      });
    }

    console.error("Update user failed:", error.message);

    return res.status(500).json({
      error: "Failed to update user",
    });
  }
});

export default router;
