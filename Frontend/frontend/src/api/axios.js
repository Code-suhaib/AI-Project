import axios from "axios";

// 🔹 Create axios instance
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ FIXED (root API only)
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


// ==============================
// 🔐 REQUEST INTERCEPTOR
// ==============================

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ==============================
// ⚠️ RESPONSE INTERCEPTOR
// ==============================

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("⚠️ Session expired. Logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      console.error("API Error:", error.response.data);
    } 
    else if (error.request) {
      console.error("🚫 No response from server:", error.request);
    } 
    else {
      console.error("Axios Error:", error.message);
    }

    return Promise.reject(error);
  }
);


// 🔓 OPTIONAL HELPER
export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};


// 🔹 Export instance
export default instance;