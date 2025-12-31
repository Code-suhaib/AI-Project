import { Router } from "express";
import { recommendInternships } from "../controllers/recommendation.controller.js";

const router = Router();

router.get("/", recommendInternships);

export default router;
