import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  getRandomRecommendations,
  getAIRecommendations,
} from "../controllers/recommendation.controller.js";

const router = Router();


// =====================================
// ⚡ RANDOM RECOMMENDATIONS
// GET /api/recommendations
// =====================================
router.get(
  "/",
  authMiddleware,
  getRandomRecommendations
);


// =====================================
// 🤖 AI RECOMMENDATIONS
// POST /api/recommendations/ai
// =====================================
router.post(
  "/ai",
  authMiddleware,
  getAIRecommendations
);

export default router;