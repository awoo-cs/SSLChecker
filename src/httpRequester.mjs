const axios = require("axios");

async function fetchUrl(url) {
  try {
    const response = await axios.get(url);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = fetchUrl;
