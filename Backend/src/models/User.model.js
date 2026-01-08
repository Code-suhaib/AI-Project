import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.model.js";

const router = express.Router();

/**
 * GET /users/me
 * Get logged-in user's profile
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role skills interests"
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

/**
 * PUT /users/me
 * Update logged-in user's profile
 */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { role, skills, interests } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        role,
        skills,
        interests
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error("Profile save error:", error);
    res.status(500).json({ message: "Failed to save profile" });
  }
});

export default router;
