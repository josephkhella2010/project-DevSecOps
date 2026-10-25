import express from "express";
import User from "../../models/User.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("products").select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      error: "Error while getting all users",
    });
  }
});

export default router;
