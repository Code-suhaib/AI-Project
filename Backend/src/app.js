const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const recommendationRoutes = require("./routes/recommendation.routes");

const app = express();





app.use(cors());
app.use(express.json());



// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/recommendations", recommendationRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

module.exports = app;
