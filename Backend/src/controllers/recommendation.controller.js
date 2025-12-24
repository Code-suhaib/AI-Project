const { fetchInternships } = require("../services/job.service");

const recommendInternships = async (req, res) => {
  try {
    const user = req.user;
    const jobs = await fetchInternships();

    // 🔑 Build matching keywords
    const keywords = [
      ...(user.skills || []),
      ...(user.interests || []),
      "intern",
      "developer",
      "engineer",
      "cloud",
      "ai"
    ].map(k => k.toLowerCase());

    // 🧠 Rule-based AI matching
    const recommendations = jobs.filter(job => {
      const text = `
        ${job.job_title || ""}
        ${job.job_description || ""}
      `.toLowerCase();

      return keywords.some(keyword => text.includes(keyword));
    });

    res.json({
      total: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { recommendInternships };
