import express from "express";
import mongoose from "mongoose";
import Product from "../../models/Proudct.js";

const router = express.Router();

// 1. Get product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const product = await Product.findById(id);

    // If product doesn't exist, return 404 Not Found
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      error: "Error while getting the product",
    });
  }
});

export default router;
