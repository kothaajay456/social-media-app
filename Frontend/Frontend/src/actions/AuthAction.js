import * as AuthApi from "../api/AuthRequest";
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
} from "../constants/AuthConstants";
import { toast } from 'react-toastify';

// Signup
export const signup = (formData) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    const { data } = await AuthApi.signup(formData);
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        user: data.data.user,
        token: data.token,
      },
    });
    toast.success("Signup successful! Please verify OTP.");
    window.location.href = "/verify";
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
      payload: error.response?.data?.message || "Signup Failed",
    });
    toast.error(error.response?.data?.message || "Signup Failed");
  }
};

// Login
export const login = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START });
    const { data } = await AuthApi.login(formData);
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        user: data.data.user,
        token: data.token,
      },
    });
    navigate("/home");
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
      payload: error.response?.data?.message || "Login Failed",
    });
    toast.error(error.response?.data?.message || "Login Failed");
  }
};

// OTP Verify
export const verify = (otp) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    const { data } = await AuthApi.verify(otp);
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        user: data.data.user,
        token: data.token,
      },
    });
    toast.success("Account Verified!");
    window.location.href = "/home";
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
      payload: error.response?.data?.message || "OTP Verification Failed",
    });
    toast.error(error.response?.data?.message || "OTP Verification Failed");
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch({ type: "LOG_OUT" });
    dispatch({ type: "RESET_PROFILE" });
    window.location.href = "/home";
  } catch (error) {
    console.log(error);
  }
};

// Forget Password
export const forgetPassword = (email) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    await AuthApi.forgetPassword(email);
    localStorage.setItem("resetEmail", email);
    toast.success("OTP sent to your email");
    window.location.href = "/reset-password";
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
      payload: error.response?.data?.message || "Error sending OTP",
    });
    toast.error(error.response?.data?.message || "Error sending OTP");
  }
};

// Reset Password
export const resetPassword = (otp, password, passwordConfirm) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  const email = localStorage.getItem("resetEmail");
  try {
    await AuthApi.resetPassword({ email, otp, password, passwordConfirm });
    localStorage.removeItem("resetEmail");
    toast.success("Password reset successful. Please login.");
    window.location.href = "/login";
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
      payload: error.response?.data?.message || "Failed to reset password",
    });
    toast.error(error.response?.data?.message || "Failed to reset password");
  }
};

// Resend OTP for password reset
export const resendresetOtp = () => async () => {
  const email = localStorage.getItem("resetEmail");
  try {
    const res = await AuthApi.resendresetOtp(email);
    toast.success(res.data.message || "OTP resent successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to resend OTP");
  }
};

// Resend OTP for signup
export const resendOtp = (email) => async (dispatch) => {
  try {
    const res = await AuthApi.resendOtp(email);
    dispatch({ type: 'OTP_RESENT_SUCCESS', payload: res.data });
    toast.success(res.data.message || "OTP sent successfully");
  } catch (error) {
    dispatch({
      type: 'OTP_RESENT_FAIL',
      payload: error.response?.data?.message || "Resend failed",
    });
    toast.error(error.response?.data?.message || "Failed to resend OTP");
  }
};

// Change Password
export const changePassword = (currentPassword, newPassword, newPasswordConfirm) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    await AuthApi.changePassword(currentPassword, newPassword, newPasswordConfirm);
    toast.success("Password changed successfully");
    window.location.href = "/home";
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
      payload: error.response?.data?.message || "Change password failed",
    });
    toast.error(error.response?.data?.message || "Change password failed");
  }
};
