import axios from "axios";
import SearchHistory from "../models/SearchHistory.js";

export const searchInternships = async (req, res) => {
  const { role, skills, location } = req.body;

  try {
    // 🔹 Call RapidAPI
    const rapidRes = await axios.get(
      "https://internships-api.p.rapidapi.com/search",
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "internships-api.p.rapidapi.com",
        },
        params: {
          role,
          skills: skills?.join(","),
          location,
        },
      }
    );

    const jobs = rapidRes.data.jobs || [];

    // 🔹 Save search history (AI-ready)
    await SearchHistory.create({
      userId: req.user.id,
      role,
      skills,
      location,
      results: jobs,
    });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Internship search failed:", error);
    res.status(500).json({ message: "Failed to fetch internships" });
  }
};
