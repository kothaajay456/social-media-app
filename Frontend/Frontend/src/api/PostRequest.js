import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1/posts",
  withCredentials: true,
});

// Automatically attach the token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


export const createPost = (formData) =>
  API.post("/create-post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllPosts = () => API.get("/all");

export const getUserPosts = (userId) => API.get(`/user-post/${userId}`);

export const toggleSavePost = (postId) =>
  API.post(`/save-unsave-post/${postId}`);

export const deletePost = (postId) => API.delete(`/delete-post/${postId}`);

export const likeOrDislikePost = (postId) =>
  API.post(`/like-dislike/${postId}`);

export const addComment = (postId, text) =>
  API.post(`/comment/${postId}`, { text });

export const editPost = (postId, formData) =>
  API.put(`/edit-post/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });