import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();

/**
 * GET /activity/my
 * Get logged-in user's search history
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const history = await SearchHistory.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select("role skills location createdAt results");

    res.json({ history });
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({ message: "Failed to load activity" });
  }
});

export default router;
