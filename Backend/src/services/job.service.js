import axios from "axios";

console.log("RAPID KEY =>", process.env.RAPIDAPI_KEY);

export const fetchInternships = async ({ role, skills, location } = {}) => {
  try {
    const query = `${role || ""} ${(skills || []).join(" ")}`.trim();

    console.log("🌐 RapidAPI ENV CHECK:", {
      key: !!process.env.RAPIDAPI_KEY,
      host: process.env.RAPID_API_HOST,
      url: process.env.RAPID_API_URL,
      query,
    });

    const response = await axios.get(process.env.RAPID_API_URL, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      },
      params: {
        query,
        experienceLevels: "intern;entry;associate;midSenior;director",
        workplaceTypes: "remote;hybrid;onSite",
        location: location || "remote",
        datePosted: "month",
        employmentTypes: "contractor;fulltime;parttime;intern;temporary",
      },
    });

    return response.data?.data || [];
  } catch (error) {
    console.error(
      "🔥 RapidAPI FAILED:",
      error.response?.data || error.message
    );
    throw error;
  }
};
