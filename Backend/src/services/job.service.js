const axios = require("axios");

const fetchFromRapidAPI = async ({ query, location }) => {
  try {
    const response = await axios.get(process.env.RAPIDAPI_URL, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
      params: {
        query,
        page: 1,
        num_pages: 1,
        country: location || "in",
        date_posted: "month",
      },
    });

    return response.data?.data || [];
  } catch (error) {
    console.error("🔥 RapidAPI FAILED:", error.response?.data || error.message);
    throw new Error("RapidAPI failed");
  }
};

module.exports = { fetchFromRapidAPI };
