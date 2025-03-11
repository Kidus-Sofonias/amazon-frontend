import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000"
  baseUrl: "https://amazon-api-deploy-i6xq.onrender.com",
});

export { axiosInstance };