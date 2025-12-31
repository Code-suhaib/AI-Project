import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import internshipRoutes from "./routes/internship.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/internships", internshipRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

export default app;
