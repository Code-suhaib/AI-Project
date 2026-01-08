import express from "express";
import User from "../models/User.model.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET current user profile
 * GET /users/me
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE user profile
 * PUT /users/me
 */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to save profile" });
  }
});

export default router;
