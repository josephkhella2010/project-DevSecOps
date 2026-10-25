import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    imgs: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: undefined,
      validate: {
        validator: (urls) => urls.length > 0,
        message: "URLs array cannot be empty",
      },
    },
  },

  {
    timestamps: true,
  },
);

const Product = mongoose.model("Products", productSchema);

export default Product;
