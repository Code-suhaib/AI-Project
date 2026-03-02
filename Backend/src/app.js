import express from "express";
import cors from "cors";
import multer from "multer";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import internshipRoutes from "./routes/internship.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/internships", internshipRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Multer + global error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message?.includes("PDF and DOCX")) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "Something went wrong ❌" });
});

export default app;
