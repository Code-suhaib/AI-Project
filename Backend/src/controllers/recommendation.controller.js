import { fetchInternships } from "../services/job.service.js";

// ==========================================
// RANDOM RECOMMENDATIONS
// ==========================================
export const getRandomRecommendations = async (req, res) => {
  try {
    const jobs = await fetchInternships({
      role: "intern",
      skills: [],
      location: "remote",
    });

    return res.json({
      type: "random",
      total: jobs.length,
      recommendations: jobs.slice(0, 20),
    });

  } catch (error) {
    console.error("❌ Recommendation Error:");
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// AI RECOMMENDATIONS (HYBRID SCORING)
// ==========================================
export const getAIRecommendations = async (req, res) => {
  try {
    const {
      role = "",
      skills = [],
      experience = "",
      interests = "",
      goal = "",
    } = req.body;

    console.log("=================================");
    console.log("🤖 AI Recommendation Request");
    console.log("=================================");
    console.log(req.body);

    // ==========================================
    // FETCH INTERNSHIPS
    // ==========================================

    const jobs = await fetchInternships({
      role,
      skills,
      location: "remote",
    });

    console.log(`✅ Found ${jobs.length} jobs`);

    if (!jobs.length) {
      return res.json({
        type: "ai",
        total: 0,
        recommendations: [],
      });
    }

    // ==========================================
    // LIMIT RESULTS
    // ==========================================

    const limitedJobs = jobs.slice(0, 20);

    // ==========================================
    // PROFILE-BASED SCORING
    // ==========================================

    const rankedJobs = limitedJobs
      .map((job) => {
        let score = 0;

        const searchableText =
          JSON.stringify(job).toLowerCase();

        // Skills Match
        (skills || []).forEach((skill) => {
          if (
            searchableText.includes(
              skill.toLowerCase()
            )
          ) {
            score += 15;
          }
        });

        // Role Match
        if (
          role &&
          searchableText.includes(
            role.toLowerCase()
          )
        ) {
          score += 35;
        }

        // Interests Match
        if (
          interests &&
          searchableText.includes(
            interests.toLowerCase()
          )
        ) {
          score += 20;
        }

        // Goal Match
        if (
          goal &&
          searchableText.includes(
            goal.toLowerCase()
          )
        ) {
          score += 20;
        }

        // Experience Match
        if (
          experience &&
          searchableText.includes(
            experience.toLowerCase()
          )
        ) {
          score += 10;
        }

        return {
          ...job,

          score: Math.min(score, 100),

          reason:
            score >= 80
              ? "Excellent match for your profile and skills."
              : score >= 60
              ? "Strong match based on role and technical skills."
              : score >= 40
              ? "Moderate match with some relevant requirements."
              : "Potential opportunity worth exploring.",
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    console.log(
      `✅ Ranked Jobs: ${rankedJobs.length}`
    );

    return res.json({
      type: "ai",
      total: rankedJobs.length,
      recommendations: rankedJobs,
    });

  } catch (error) {
    console.error("❌ AI Recommendation Error:");
    console.error(error);

    return res.status(500).json({
      message: "AI recommendation failed",
    });
  }
};