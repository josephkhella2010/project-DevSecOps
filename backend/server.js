import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";
import connectDB from "./db.js";
// // import user api

import getAllUsers from "./Api/users/getAllUsers.js";
import registerUser from "./Api/users/registerUser.js";
import loginUser from "./Api/users/loginUser.js";
import deleteUser from "./Api/users/deleteUser.js";
import updateUser from "./Api/users/updateUser.js";
import getUserById from "./Api/users/getUserById.js";
// import product api
import getAllProducts from "./Api/products/getAllProducts.js";
import addProduct from "./Api/products/addProduct.js";
import addProductToUser from "./Api/products/addProductToUser.js";
import deleteProductFromUser from "./Api/products/deleteProductForUser.js";
import getProductById from "./Api/products/getProductById.js";
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});
// api
app.use("/api", getAllUsers);
app.use("/api", registerUser);
app.use("/api", loginUser);
app.use("/api", deleteUser);
app.use("/api", updateUser);
app.use("/api", getUserById);
app.use("/api", getAllProducts);
app.use("/api", addProduct);
app.use("/api", addProductToUser);
app.use("/api", deleteProductFromUser);
app.use("/api", getProductById);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB();
