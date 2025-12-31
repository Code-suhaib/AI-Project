import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./config/db.js";

console.log("🔥 ENV CHECK:", {
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY ? "✅ Loaded" : "❌ Missing",
  RAPIDAPI_HOST: process.env.RAPIDAPI_HOST,
  RAPIDAPI_URL: process.env.RAPIDAPI_URL
});

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
