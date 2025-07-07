import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Adjust if you deploy

export const sentimentAPI = {
  predict: (tweet) => axios.post(`${BASE_URL}/predict`, { tweet }),
};

export const tweetAPI = {
  search: (query) => axios.get(`${BASE_URL}/tweets?q=${encodeURIComponent(query)}`),
};
