import axios from "axios";
import * as actionTypes from "./ActionTypes";
import api, { API_BASE_URL } from "@/Api/api";
import { toast } from "react-toastify";

// ===============================
// REGISTER
// ===============================
export const register = (userData) => async (dispatch) => {
  dispatch({ type: actionTypes.REGISTER_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;

    if (user.jwt) localStorage.setItem("jwt", user.jwt);

    toast.success("Account created successfully!");
    userData.navigate("/");

    dispatch({ type: actionTypes.REGISTER_SUCCESS, payload: user.jwt });
  } catch (error) {
    const errMsg = error.response?.data?.message || "Something went wrong!";
    console.error("Register error:", errMsg);

    toast.error(
      errMsg.toLowerCase().includes("exists")
        ? "Account already exists!"
        : "Registration failed!"
    );

    dispatch({
      type: actionTypes.REGISTER_FAILURE,
      payload: errMsg,
    });
  }
};

// ===============================
// LOGIN
// ===============================
export const login = (userData) => async (dispatch) => {
  dispatch({ type: actionTypes.LOGIN_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const user = response.data;

    // Store JWT if present (even for 2FA)
    if (user.jwt) {
      localStorage.setItem("jwt", user.jwt);
    }

    if (user.twoFactorAuthEnabled) {
      // Navigate to 2FA page
      userData.navigate(`/two-factor-auth/${user.session}`);
      return;
    }

    toast.success("Login successful!");
    userData.navigate("/");

    dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: user.jwt });
  } catch (error) {
    const errMsg = error.response?.data?.message || "Invalid credentials!";
    console.error("Login error:", errMsg);
    toast.error("Incorrect email or password!");
    dispatch({
      type: actionTypes.LOGIN_FAILURE,
      payload: errMsg,
    });
  }
};


// ===============================
// TWO-STEP VERIFICATION
// ===============================
export const twoStepVerification =
  ({ otp, session, navigate }) =>
  async (dispatch) => {
    dispatch({ type: actionTypes.LOGIN_TWO_STEP_REQUEST });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/two-factor/otp/${otp}`,
        {},
        { params: { id: session } }
      );
      const user = response.data;

      if (user.jwt) {
        localStorage.setItem("jwt", user.jwt);
        toast.success("Login successful!");
        navigate("/");
      }

      dispatch({ type: actionTypes.LOGIN_TWO_STEP_SUCCESS, payload: user.jwt });
    } catch (error) {
      console.error("Two-step verification error:", error);
      dispatch({
        type: actionTypes.LOGIN_TWO_STEP_FAILURE,
        payload: error.response?.data || error,
      });
    }
  };

// ===============================
// GET USER FROM TOKEN
// ===============================
export const getUser = (token) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_USER_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = response.data;
    console.log("Fetched user:", user);
    dispatch({ type: actionTypes.GET_USER_SUCCESS, payload: user });
  } catch (error) {
    console.error("Get user error:", error);
    dispatch({ type: actionTypes.GET_USER_FAILURE, payload: null });
  }
};

// ===============================
// SEND VERIFICATION OTP
// ===============================
export const sendVerificationOtp =
  ({ jwt, verificationType }) =>
  async (dispatch) => {
    dispatch({ type: actionTypes.SEND_VERIFICATION_OTP_REQUEST });
    try {
      const response = await api.post(
        `/api/users/verification/${verificationType}/send-otp`,
        {},
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      const user = response.data;
      console.log("OTP sent:", user);
      toast.success("OTP sent successfully!");
      dispatch({
        type: actionTypes.SEND_VERIFICATION_OTP_SUCCESS,
        payload: user,
      });
    } catch (error) {
      console.error("Send verification OTP error:", error);
      toast.error("Failed to send OTP!");
      dispatch({
        type: actionTypes.SEND_VERIFICATION_OTP_FAILURE,
        payload: error.message,
      });
    }
  };

// ===============================
// VERIFY OTP
// ===============================
export const verifyOtp =
  ({ jwt, otp }) =>
  async (dispatch) => {
    dispatch({ type: actionTypes.VERIFY_OTP_REQUEST });
    try {
      const response = await api.patch(
        `/api/users/verification/verify-otp/${otp}`,
        {},
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      const user = response.data;
      console.log("OTP verified:", user);
      toast.success("OTP verified successfully!");
      dispatch({ type: actionTypes.VERIFY_OTP_SUCCESS, payload: user });
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Invalid OTP!");
      dispatch({
        type: actionTypes.VERIFY_OTP_FAILURE,
        payload: error.message,
      });
    }
  };

// ===============================
// ENABLE TWO-STEP AUTHENTICATION
// ===============================
export const enableTwoStepAuthentication =
  ({ jwt, otp }) =>
  async (dispatch) => {
    dispatch({ type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_REQUEST });
    try {
      const response = await api.patch(
        `/api/users/enable-two-factor/verify-otp/${otp}`,
        {},
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      const user = response.data;
      console.log("Two-step authentication enabled:", user);
      toast.success("Two-step authentication enabled!");
      dispatch({
        type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
        payload: user,
      });
    } catch (error) {
      console.error("Enable 2FA error:", error);
      toast.error("Failed to enable 2FA!");
      dispatch({
        type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
        payload: error.message,
      });
    }
  };

// ===============================
// SEND RESET PASSWORD OTP
// ===============================
export const sendResetPassowrdOTP =
  ({ sendTo, verificationType, navigate }) =>
  async (dispatch) => {
    dispatch({ type: actionTypes.SEND_RESET_PASSWORD_OTP_REQUEST });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/users/reset-password/send-otp`,
        { sendTo, verificationType }
      );

      const user = response.data;
      console.log("Reset password OTP sent:", user);
      toast.success("OTP sent successfully!");
      navigate(`/reset-password/${user.session}`);

      dispatch({
        type: actionTypes.SEND_RESET_PASSWORD_OTP_SUCCESS,
        payload: user,
      });
    } catch (error) {
      console.error("Send reset OTP error:", error);
      toast.error("Failed to send reset OTP!");
      dispatch({
        type: actionTypes.SEND_RESET_PASSWORD_OTP_FAILURE,
        payload: error.message,
      });
    }
  };

// ===============================
// VERIFY RESET PASSWORD OTP
// ===============================
export const verifyResetPassowrdOTP =
  ({ otp, password, session, navigate }) =>
  async (dispatch) => {
    dispatch({ type: actionTypes.VERIFY_RESET_PASSWORD_OTP_REQUEST });
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/auth/users/reset-password/verify-otp`,
        { otp, password },
        { params: { id: session } }
      );

      const user = response.data;
      console.log("Password reset success:", user);
      toast.success("Password updated successfully!");
      navigate("/password-update-successfully");

      dispatch({
        type: actionTypes.VERIFY_RESET_PASSWORD_OTP_SUCCESS,
        payload: user,
      });
    } catch (error) {
      console.error("Verify reset OTP error:", error);
      toast.error("OTP verification failed!");
      dispatch({
        type: actionTypes.VERIFY_RESET_PASSWORD_OTP_FAILURE,
        payload: error.message,
      });
    }
  };

// ===============================
// LOGOUT
// ===============================
export const logout = () => async (dispatch) => {
  localStorage.clear();
  toast.info("Logged out successfully!");
  dispatch({ type: actionTypes.LOGOUT });
};
