import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
  withCredentials: true,
});
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("🔐 Attaching token:", token); 
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
export const getMe = () => API.get("/me");
export const getProfile = (id) => API.get(`/profile/${id}`);
export const editProfile = (formData) =>
  API.post("/edit-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getSuggestedUsers = () => API.get("/suggested-user"); 
export const followUnfollowUser = (id) => API.post(`/follow-unfollow/${id}`);
