import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const signup = (formData) => API.post("/users/signup", formData);
export const login = (formData) => API.post("/users/login", formData);
export const verify = (otp) => API.post("/users/verify", { otp });
export const resendOtp = () => API.post("/users/resend-otp");
export const resendresetOtp = (email) => API.post("/users/forget-password", { email });
export const forgetPassword = (email) => API.post("/users/forget-password", { email });
export const resetPassword = (formData) => API.post("/users/reset-password", formData);


export const changePassword = (currentPassword, newPassword, newPasswordConfirm) =>
  API.post("/users/change-password", {
    currentPassword,
    newPassword,
    newPasswordConfirm,
  });

export const logout = () => API.post("/users/logout");
