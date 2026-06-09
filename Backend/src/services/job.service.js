import axios from "axios";

export const fetchInternships = async ({
  role = "intern",
  skills = [],
  location = "remote",
} = {}) => {
  try {
    const query = `${role} ${skills.join(" ")}`.trim();

    console.log("=================================");
    console.log("🌐 RapidAPI ENV CHECK");
    console.log("=================================");
    console.log("KEY:", process.env.RAPIDAPI_KEY ? "✅ Loaded" : "❌ Missing");
    console.log("HOST:", process.env.RAPIDAPI_HOST);
    console.log("URL:", process.env.RAPIDAPI_URL);
    console.log("QUERY:", query);
    console.log("LOCATION:", location);
    console.log("=================================");

    if (!process.env.RAPIDAPI_URL) {
      throw new Error("RAPIDAPI_URL is missing in .env");
    }

    if (!process.env.RAPIDAPI_HOST) {
      throw new Error("RAPIDAPI_HOST is missing in .env");
    }

    if (!process.env.RAPIDAPI_KEY) {
      throw new Error("RAPIDAPI_KEY is missing in .env");
    }

    const response = await axios.get(process.env.RAPIDAPI_URL, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
      params: {
        query,
        page: "1",
        num_pages: "1",
        location,
      },
      timeout: 15000,
    });

    const jobs = response.data?.data || [];

    console.log(`✅ Found ${jobs.length} jobs`);

    return jobs;
  } catch (error) {
    console.error("=================================");
    console.error("🔥 RapidAPI FAILED");
    console.error("=================================");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    console.error("=================================");

    return [];
  }
};