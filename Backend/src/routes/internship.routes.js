import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/auth.middleware.js";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();

router.post("/search", authMiddleware, async (req, res) => {
  const { role, skills, location } = req.body;

  try {
    const rapidRes = await axios.get(process.env.RAPIDAPI_URL, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
      params: {
        query: `${role} ${skills.join(" ")}`,
        location: location || "remote",
      },
    });

    const rawJobs = rapidRes.data?.data || [];

    // ✅ NORMALIZE DATA (VERY IMPORTANT)
    const jobs = rawJobs.map((job) => ({
      title: job.job_title || "Internship",
      company: job.employer_name || "Unknown Company",
      location:
        `${job.job_city || ""} ${job.job_country || ""}`.trim() || "Remote",
      url: job.job_apply_link || null,
    }));

    // Save search history
    await SearchHistory.create({
      userId: req.user.id,
      role,
      skills,
      location,
      results: jobs,
    });

    res.json({ jobs });
  } catch (error) {
    console.error("Internship search error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to fetch internships" });
  }
});

export default router;
