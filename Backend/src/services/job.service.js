import axios from "axios";

export const fetchInternships = async ({
  role = "intern",
  skills = [],
  location = "remote",
} = {}) => {
  try {

    // Only search using role
    const query = role?.trim() || "intern";

    console.log("=================================");
    console.log("🌐 RapidAPI REQUEST");
    console.log("=================================");
    console.log("QUERY:", query);
    console.log("LOCATION:", location);
    console.log("=================================");

    const response = await axios.get(
      process.env.RAPIDAPI_URL,
      {
        headers: {
          "X-RapidAPI-Key":
            process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host":
            process.env.RAPIDAPI_HOST,
        },

        params: {
          query,
          page: "1",
          num_pages: "1",
        },

        timeout: 15000,
      }
    );

    const jobs =
      response?.data?.data ||
      response?.data?.jobs ||
      [];

    console.log(
      `✅ RapidAPI Returned ${jobs.length} jobs`
    );

    if (jobs.length > 0) {
      console.log(
        "FIRST JOB SAMPLE:"
      );
      console.log(
        JSON.stringify(
          jobs[0],
          null,
          2
        )
      );
    }

    return jobs;

  } catch (error) {

    console.error("=================================");
    console.error("🔥 JOB FETCH ERROR");
    console.error("=================================");

    if (error.response) {
      console.error(
        error.response.status
      );
      console.error(
        JSON.stringify(
          error.response.data,
          null,
          2
        )
      );
    } else {
      console.error(error.message);
    }

    console.error("=================================");

    return [];
  }
};