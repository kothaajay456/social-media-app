import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const uploadImage = (formData) => API.post('/upload', formData);
export const uploadPost = (postData) => API.post('/posts', postData);
