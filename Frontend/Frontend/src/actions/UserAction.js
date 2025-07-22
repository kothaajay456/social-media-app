import {
  getMe,
  getProfile,
  editProfile as editProfileAPI,
  getSuggestedUsers,
  followUnfollowUser,
} from "../api/UserRequest";

import {
  USER_LOAD,
  USER_LOAD_FAIL,
  USER_LOAD_SUCCESS,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  FOLLOW_USER,
  FOLLOW_USER_FAIL,
  SUGGESTED_USERS_SUCCESS,
  SUGGESTED_USERS_FAIL,
} from "../constants/userConstants";

import { toast } from "react-toastify";

//  Load current logged-in user
export const loadUser = () => async (dispatch) => {
  dispatch({ type: USER_LOAD });
  try {
    const { data } = await getMe();
    dispatch({ type: USER_LOAD_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_LOAD_FAIL,
      payload: error.response?.data?.message || "Failed to load user",
    });
  }
};

//  Get profile of another user
export const getprofile = (id) => async (dispatch) => {
  dispatch({ type: USER_LOAD });
  try {
    const { data } = await getProfile(id);
    dispatch({ type: USER_LOAD_SUCCESS, payload: data.data.user });
  } catch (error) {
    dispatch({
      type: USER_LOAD_FAIL,
      payload: error.response?.data?.message || "Failed to fetch profile",
    });
  }
};

//  Edit current user profile
export const editProfile= (formData) => async (dispatch) => {
  try {
    const { data } = await editProfileAPI(formData); 
    await dispatch(loadUser());
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data.user });
    toast.success("Profile updated");
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.message || "Update failed",
    });
    toast.error("Failed to update profile");
  }
};

// Follow / Unfollow user
export const followUser = (id) => async (dispatch) => {
  try {
    const { data } = await followUnfollowUser(id);

    const updatedUser = data.data.user;
    const updatedTargetUser = data.data.targetUser;

    dispatch({ type: FOLLOW_USER, payload: { updatedUser, updatedTargetUser } });
    toast.success(data.message || "Follow/Unfollow success");
  } catch (error) {
    dispatch({
      type: FOLLOW_USER_FAIL,
      payload: error.response?.data?.message || "Follow/Unfollow failed",
    });
    toast.error(error.response?.data?.message || "Follow failed");
  }
};

// Fetch suggested users
export const fetchSuggestedUsers = () => async (dispatch) => {
  try {
    const { data } = await getSuggestedUsers();
    dispatch({ type: "SET_SUGGESTED_USERS", payload: data.users });
  } catch (error) {
    dispatch({
      type: "USER_ERROR",
      payload: error.response?.data?.message || "Failed to load suggestions",
    });
  }
};
