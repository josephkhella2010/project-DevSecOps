import express from "express";
import mongoose from "mongoose";
import User from "../../models/User.js";
import authenticateToken from "../../jwt/authenticateToken.js";

const router = express.Router();

// Remove a product from the logged-in user's products array
router.delete(
  "/delete-user-product/:productId",
  authenticateToken,
  async (req, res) => {
    try {
      const { productId } = req.params;

      // 1. Validate product ID
      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({
          error: "Invalid product ID",
        });
      }

      // 2. Find the logged-in user
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // 3. Check whether the product belongs to the user's selection
      const productExists = user.products.some(
        (id) => id.toString() === productId,
      );

      if (!productExists) {
        return res.status(404).json({
          message: "Product not found in your products",
        });
      }

      // 4. Remove the product ID from the user's array
      user.products = user.products.filter((id) => id.toString() !== productId);

      await user.save();

      // 5. Return the remaining products with full details
      await user.populate("products");

      return res.status(200).json({
        message: "Product removed from your products successfully",
        products: user.products,
      });
    } catch (error) {
      console.error("Delete user product failed:", error);

      return res.status(500).json({
        error: "Failed to remove product from user",
      });
    }
  },
);

export default router;
