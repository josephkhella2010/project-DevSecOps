import express from "express";
import Product from "../../models/Proudct.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({ products: products });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: "Error while getting all products",
    });
  }
});

export default router;
