import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/auth.middleware.js";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();

router.post("/search", authMiddleware, async (req, res) => {
  console.log("search route hit");
  try {
    const { role, skills, location } = req.body;

    console.log("🔍 Internship Search Request");
    console.log("Role:", role);
    console.log("Skills:", skills);
    console.log("Location:", location);

    console.log("API KEY:", process.env.RAPIDAPI_KEY ? "✅ Loaded" : "❌ Missing");

    const rapidRes = await axios.get(process.env.RAPIDAPI_URL, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
      params: {
        query: `${role || "intern"} ${(skills || []).join(" ")}`,
        page: "1",
        num_pages: "1",
      },
      timeout: 15000,
    });

    const rawJobs = rapidRes.data?.data || [];

    console.log(`✅ Found ${rawJobs.length} jobs`);

    const jobs = rawJobs.map((job) => ({
      title: job.job_title || "Internship",
      company: job.employer_name || "Unknown Company",
      location:
        `${job.job_city || ""} ${job.job_country || ""}`.trim() || "Remote",
      url: job.job_apply_link || "",
    }));

    await SearchHistory.create({
      userId: req.user.id,
      role,
      skills,
      location,
      results: jobs,
    });

    return res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.error("❌ Internship Search Error");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch internships",
    });
  }
});

export default router;