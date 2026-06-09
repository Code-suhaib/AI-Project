import api from "./axios";

// ==============================
// 🔐 AUTH APIs
// ==============================

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  // Save token
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};


// ==============================
// 👤 USER APIs
// ==============================

export const getProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};


// ==============================
// 🤖 AI RECOMMENDATION API
// ==============================

export const getRecommendations = async (resumeText) => {
  const res = await api.post("/recommendations", {
    resumeText,
  });

  return res.data;
};


// ==============================
// 🔓 LOGOUT
// ==============================

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};