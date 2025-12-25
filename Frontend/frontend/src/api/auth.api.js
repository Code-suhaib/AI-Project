import api from "./axios";

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/users/me");

export const updateProfile = (data) =>
  api.put("/users/profile", data);

export const getRecommendations = () =>
  api.get("/recommendations");
