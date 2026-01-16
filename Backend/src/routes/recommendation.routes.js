import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { recommendInternships } from "../controllers/recommendation.controller.js";

const router = Router();

router.get("/", recommendInternships);

// 🔮 AI Recommendation – placeholder
router.post("/ai", authMiddleware, async (req, res) => {
  try {
    res.json({
      message: "AI recommendation pipeline ready ✅",
      userId: req.user.id
    });
  } catch (err) {
    console.error("AI route error:", err);
    res.status(500).json({ message: "AI route failed" });
  }
});


export default router;
