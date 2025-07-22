import {
  CREATE_POST,
  GET_ALL_POSTS,
  GET_USER_POSTS,
  DELETE_POST,
  SAVE_UNSAVE_POST,
  LIKE_DISLIKE_POST_REQUEST,
  LIKE_DISLIKE_POST_SUCCESS,
  LIKE_DISLIKE_POST_FAIL,
  ADD_COMMENT,
  EDIT_POST,
  POST_ERROR,
} from "../constants/PostConstants";

import * as api from "../api/PostRequest";

// Create a new post
export const createPost = (formData) => async (dispatch) => {
  try {
    const { data } = await api.createPost(formData);
    console.log(data)
    dispatch({ type: CREATE_POST, payload: data.post });
  } catch (error) {
    dispatch({ type: POST_ERROR, payload: error.response?.data?.message });
  }
};

// Get all posts
export const getAllPosts = () => async (dispatch) => {
  try {
    const { data } = await api.getAllPosts(); 

    console.log("API response (all posts):", data); 

    dispatch({
      type: GET_ALL_POSTS,
      payload: data, 
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    dispatch({
      type: POST_ERROR,
      payload: error.message,
    });
  }
};

// Get posts by user
export const getUserPosts = (userId) => async (dispatch) => {
  try {
    const { data } = await api.getUserPosts(userId);
    dispatch({ type: GET_USER_POSTS, payload: data.posts }); 
  } catch (error) {
    dispatch({ type: POST_ERROR, payload: error.message });
  }
};
// Delete a post
export const deletePost = (postId) => async (dispatch) => {
  try {
    await api.deletePost(postId);
    dispatch({ type: DELETE_POST, payload: postId });
  } catch (error) {
    dispatch({ type: POST_ERROR, payload: error.response?.data?.message });
  }
};

// Save or Unsave a post
export const toggleSavePost = (postId) => async (dispatch) => {
  try {
    const { data } = await api.toggleSavePost(postId);
    dispatch({ type: SAVE_UNSAVE_POST, payload: data });
  } catch (error) {
    dispatch({ type: POST_ERROR, payload: error.response?.data?.message });
  }
};

// Like or Dislike a post
export const likeOrDislikePost = (postId) => async (dispatch) => {
  try {
    const { data } = await api.likeOrDislikePost(postId);
    console.log("Like response data:", data);
    dispatch({ type: LIKE_DISLIKE_POST_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error liking post:", error);
    dispatch({ type: POST_ERROR, payload: error.response?.data?.message });
  }
};


// Add comment
export const addComment = (postId, text) => async (dispatch) => {
  try {
    const { data } = await api.addComment(postId, text);
    dispatch({ type: ADD_COMMENT, payload: data });
  } catch (error) {
    dispatch({ type: POST_ERROR, payload: error.response?.data?.message });
  }
};

// Edit a post
export const editPost = (postId, formData) => async (dispatch) => {
  try {
    const { data } = await api.editPost(postId, formData);
    dispatch({ type: EDIT_POST, payload: data.updatedPost });
  } catch (err) {
    dispatch({ type: POST_ERROR, payload: err.response.data.message });
  }
};
