export const getAIRecommendations = async (req, res) => {
  try {
    const {
      role = "",
      skills = [],
      experience = "",
      interests = "",
      goal = "",
    } = req.body;

    console.log("🤖 AI Request:");
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
    // SMART SCORING ENGINE
    // ==========================================

    const rankedJobs = limitedJobs
      .map((job) => {
        let score = 0;

        const text = JSON.stringify(job).toLowerCase();

        // Skills Match
        skills.forEach((skill) => {
          if (
            text.includes(
              skill.toLowerCase()
            )
          ) {
            score += 15;
          }
        });

        // Role Match
        if (
          role &&
          text.includes(role.toLowerCase())
        ) {
          score += 35;
        }

        // Interests Match
        if (
          interests &&
          text.includes(
            interests.toLowerCase()
          )
        ) {
          score += 20;
        }

        // Goal Match
        if (
          goal &&
          text.includes(goal.toLowerCase())
        ) {
          score += 20;
        }

        // Experience Bonus
        if (
          experience &&
          text.includes(
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