const axios = require("axios");

const fetchInternships = async () => {
  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: {
      query: "internship",
      page: "1",
      num_pages: "1"
    },
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
  };

  const response = await axios.request(options);
  return response.data.data;
};

module.exports = { fetchInternships };
