import express from "express";
import mongoose from "mongoose";
import User from "../../models/User.js";
import Product from "../../models/Proudct.js";
import authenticateToken from "../../jwt/authenticateToken.js";

const router = express.Router();

// Add a product to the logged-in user's products
router.post(
  "/add-user-product/:productId",
  authenticateToken,
  async (req, res) => {
    try {
      const { productId } = req.params;
      const quantity = Number(req.body?.quantity ?? 1);

      // 1. Validate product ID
      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({
          error: "Invalid product ID",
        });
      }

      // 2. Validate quantity
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          error: "Quantity must be a positive integer",
        });
      }

      // 3. Find the product
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // 4. Find the logged-in user
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // 5. Check whether the user already has this product
      const productExists = user.products.some(
        (id) => id.toString() === product._id.toString(),
      );

      if (productExists) {
        return res.status(409).json({
          message: "Product already exists in your products",
        });
      }

      // 6. Update quantity directly on the product document
      product.quantity = quantity;
      await product.save();

      // 7. Add the product ID to the user's products array
      user.products.push(product._id);
      await user.save();

      // 8. Populate product details for the response
      await user.populate("products");

      return res.status(200).json({
        message: "Product added to user successfully",
        products: user.products,
      });
    } catch (error) {
      console.error("Add product to user failed:", error);

      return res.status(500).json({
        error: "Failed to add product to user",
      });
    }
  },
);

export default router;
