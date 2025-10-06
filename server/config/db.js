require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    if (!MONGO_URL) throw new Error("MONGO_URL is not defined");
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB Atlas is connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
