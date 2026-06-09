import express from "express";
import cors from "cors";
import multer from "multer";

// 🔹 Existing routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import internshipRoutes from "./routes/internship.routes.js";

// 🔹 NEW: Recommendation routes (AI + Random)
import recommendationRoutes from "./routes/recommendation.routes.js";

// 🔹 AI services (for test route)
import { extractSkillsAI, cleanSkills } from "./services/aiService.js";

const app = express();


// ==============================
// 🔧 MIDDLEWARE
// ==============================

app.use(cors());
app.use(express.json());


// ==============================
// 🔹 ROUTES
// ==============================

// Auth & user
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Internship search
app.use("/api/internships", internshipRoutes);

// 🤖 AI + Random Recommendations (MAIN FIX)
app.use("/api/recommendations", recommendationRoutes);


// ==============================
// 🧪 TEST ROUTES
// ==============================

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// AI test
app.get("/test-ai", async (req, res) => {
  try {
    const raw = await extractSkillsAI(
      "I have experience in React, Node.js, MongoDB, AWS, and Docker"
    );

    const skills = cleanSkills(raw);

    res.json({
      success: true,
      raw,
      skills,
    });

  } catch (err) {
    console.error("AI Test Error:", err.message);

    res.status(500).json({
      success: false,
      message: "AI test failed ❌",
    });
  }
});


// ==============================
// ⚠️ GLOBAL ERROR HANDLER
// ==============================

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message?.includes("PDF and DOCX")) {
    return res.status(400).json({ message: err.message });
  }

  console.error("❌ Server Error:", err.message);

  res.status(500).json({
    message: "Something went wrong ❌",
  });
});


// ==============================
// 🚀 EXPORT
// ==============================

export default app;