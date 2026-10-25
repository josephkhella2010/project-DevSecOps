import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { createUserSchema } from "../../validators/userValidator.js";

const router = express.Router();

router.post("/register-user", async (req, res) => {
  try {
    // 1. Validate the request body
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // Use the validated and normalized data
    const { username, firstName, lastName, email, password } = result.data;

    // 2. Check for an existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Username or email already exists",
      });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Save the user to MongoDB
    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // 5. Return safe user data
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Failed to create user:", error);

    return res.status(500).json({
      error: "Failed to create user",
    });
  }
});

export default router;
