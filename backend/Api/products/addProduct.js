import express from "express";
import Product from "../../models/Proudct.js";
import { createProductSchema } from "../../validators/productValidator.js";

const router = express.Router();

router.post("/add-product", async (req, res) => {
  try {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const product = await Product.create(result.data);

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product failed:", error.message);

    return res.status(500).json({
      error: "Failed to add product",
    });
  }
});

export default router;
