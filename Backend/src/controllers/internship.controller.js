const Internship = require("../models/Internship.model");
const { fetchFromRapidAPI } = require("../services/job.service");

const searchInternships = async (req, res) => {
  try {
    let { role, skills, location } = req.body;

    if (!role || !skills) {
      return res.status(400).json({ message: "Role and skills required" });
    }

    // ✅ Normalize skills (string → array)
    if (typeof skills === "string") {
      skills = skills.split(",").map(s => s.trim());
    }

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be array or string" });
    }

    const jobs = await fetchFromRapidAPI({
      query: `${role} ${skills.join(" ")}`,
      location,
    });

    if (!Array.isArray(jobs)) {
      return res.json({ jobs: [] });
    }

    const internships = jobs.map((job) => ({
      title: job.job_title || "Internship",
      company: job.company_name || "Unknown",
      location: job.job_location || "Remote",
      url: job.job_apply_link || "#",
      source: "RapidAPI",
    }));

    try {
      await Internship.insertMany(internships, { ordered: false });
    } catch (dbErr) {
      console.log("DB insert skipped:", dbErr.message);
    }

    res.json({ jobs: internships });
  } catch (error) {
    console.error("Search error FULL:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchInternships };
