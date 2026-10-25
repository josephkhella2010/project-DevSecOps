import express from "express";
import { z } from "zod";
import User from "../../models/User.js";
import authenticateToken from "../../jwt/authenticateToken.js";
//
const router = express.Router();

router.delete("/delete-user/:id", authenticateToken, async (req, res) => {
  try {
    // 1. Validate the user ID with Zod
    const schema = z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
    });

    const result = schema.safeParse({
      id: req.params.id,
    });

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // 2. Allow users to delete only their own account
    if (req.user.id !== result.data.id) {
      return res.status(403).json({
        error: "You can only delete your own account",
      });
    }

    // 3. Delete the user from MongoDB
    const deletedUser = await User.findByIdAndDelete(result.data.id);

    if (!deletedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user failed:", error.message);

    return res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

export default router;
