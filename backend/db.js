import mongoose from "mongoose";

const connectDB = () => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing from environment variables.");
    return;
  }

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB Atlas connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
};

export default connectDB;
