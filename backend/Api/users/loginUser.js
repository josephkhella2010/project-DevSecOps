/* import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import generateToken from "../../jwt/generateToken.js";
import loginSchema from "../../validators/loginValidator.js";
import { z } from "zod";
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    // 1. Validate input
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { login, password } = result.data;

    // 2. Determine whether the input is an email or username
    const identifier = login.trim();
    const isEmail = zodEmailCheck(identifier);

    // 3. Find user by email or username
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { username: identifier },
    ).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid email/username or password",
      });
    }

    // 4. Compare password
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email/username or password",
      });
    }

    // 5. Generate JWT
    const token = generateToken(user);

    // 6. Return safe user data
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      error: "Login failed due to a server error",
    });
  }
});

// Basic email format check
function zodEmailCheck(value) {
  return z.string().email().safeParse(value).success;
}

export default router;
 */

import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import generateToken from "../../jwt/generateToken.js";
import loginSchema from "../../validators/loginValidator.js";
import { z } from "zod";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    // 1. Validate input
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { login, password } = result.data;

    // 2. Check whether login is email or username
    const identifier = login.trim();
    const isEmail = zodEmailCheck(identifier);

    // 3. Find user
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { username: identifier },
    ).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid email/username or password",
      });
    }

    // 4. Verify password
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email/username or password",
      });
    }

    // 5. Generate token
    const token = generateToken(user);

    // 6. Fetch user with populated products
    const userWithProducts = await User.findById(user._id)
      .populate("products")
      .select("-password");

    if (!userWithProducts) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // 7. Return user and products
    return res.status(200).json({
      message: "Login successful",
      token,
      user: userWithProducts,
    });
  } catch (error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      error: "Login failed due to a server error",
    });
  }
});

function zodEmailCheck(value) {
  return z.string().email().safeParse(value).success;
}

export default router;
