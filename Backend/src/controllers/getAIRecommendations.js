import { fetchInternships } from "../services/job.service.js";
import {
  extractSkillsAI,
  cleanSkills,
  rankInternshipsAI,
  cleanRecommendations,
} from "../services/aiService.js";


// ==============================
// 🤖 AI BASED RECOMMENDATIONS
// ==============================

export const getAIRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const jobs = await fetchInternships();

    // ==============================
    // 🔹 STEP 1: Get Skills
    // ==============================

    let skills = user?.skills || [];

    // If resume text exists → use AI
    if (user?.resumeText) {
      const rawSkills = await extractSkillsAI(user.resumeText);
      const aiSkills = cleanSkills(rawSkills);

      // fallback safety
      if (aiSkills.length > 0) {
        skills = aiSkills;
      }
    }

    // ==============================
    // 🔹 STEP 2: Keyword Filtering (FAST)
    // ==============================

    const keywords = [
      ...skills,
      ...(user?.interests || []),
      "intern",
      "developer",
      "engineer",
      "cloud",
      "ai",
    ]
      .filter(Boolean)
      .map((k) => k.toLowerCase());

    const filteredJobs = jobs.filter((job) => {
      const text = `
        ${job.job_title || ""}
        ${job.job_description || ""}
      `.toLowerCase();

      return keywords.some((keyword) => text.includes(keyword));
    });

    // ==============================
    // 🔥 STEP 3: LIMIT BEFORE AI
    // ==============================

    const limitedJobs = filteredJobs.slice(0, 5);

    // ==============================
    // 🧠 STEP 4: AI RANKING
    // ==============================

    const rawRank = await rankInternshipsAI(skills, limitedJobs);
    const recommendations = cleanRecommendations(rawRank);

    // ==============================
    // 📤 FINAL RESPONSE
    // ==============================

    res.json({
      type: "ai",
      skills,
      total: recommendations.length,
      recommendations,
    });

  } catch (error) {
    console.error("❌ AI Recommendation error:", error);
    res.status(500).json({
      message: "AI recommendation failed",
    });
  }
};