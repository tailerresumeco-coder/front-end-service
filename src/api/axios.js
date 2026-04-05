import axios from "axios";

const API = axios.create({
  baseURL: "https://api.tailerresume.com",
});


// ✅ REQUEST INTERCEPTOR
// Attach access token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ✅ RESPONSE INTERCEPTOR
// Handle token expiry (NO refresh yet)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired or unauthorized");

      // clear token
      localStorage.removeItem("access_token");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;