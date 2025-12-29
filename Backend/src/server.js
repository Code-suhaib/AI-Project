require("dotenv").config({ path: "./.env" });
require("dotenv").config();

console.log("🔥 ENV CHECK:", {
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  RAPIDAPI_HOST: process.env.RAPIDAPI_HOST,
  RAPIDAPI_URL: process.env.RAPIDAPI_URL
});


const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
