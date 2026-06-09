import { fetchInternships } from "../services/job.service.js";

// ==========================================
// RANDOM RECOMMENDATIONS
// ==========================================
export const getRandomRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const jobs = await fetchInternships();

    const keywords = [
      ...(user?.skills || []),
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

    const limitedJobs = filteredJobs.slice(0, 20);

    res.json({
      type: "random",
      total: limitedJobs.length,
      recommendations: limitedJobs,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// AI RECOMMENDATIONS (OLLAMA PHI3)
// ==========================================
export const getAIRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const jobs = await fetchInternships();

    const profile = `
Skills: ${(user?.skills || []).join(", ")}
Interests: ${(user?.interests || []).join(", ")}
Education: ${user?.education || ""}
    `;

    // For now return jobs.
    // Next step: send profile + jobs to Ollama Phi3
    res.json({
      type: "ai",
      userProfile: profile,
      total: jobs.length,
      recommendations: jobs.slice(0, 20),
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};