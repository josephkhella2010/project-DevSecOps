import express from "express";
import { z } from "zod";
import User from "../../models/User.js";
import authenticateToken from "../../jwt/authenticateToken.js";

const router = express.Router();

router.get("/user/:id", authenticateToken, async (req, res) => {
  try {
    // 1. Validate the user ID
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

    // 2. Allow users to access only their own account
    if (String(req.user.id) !== result.data.id) {
      return res.status(403).json({
        error: "You can only view your own account",
      });
    }

    // 3. Find the user, populate products, and exclude password
    const user = await User.findById(result.data.id)
      .select("-password")
      .populate("products");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // 4. Return the user with full product objects
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error.message);

    return res.status(500).json({
      error: "Error while getting user",
    });
  }
});

export default router;
