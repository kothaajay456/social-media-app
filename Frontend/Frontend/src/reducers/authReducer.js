import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGOUT,
} from "../constants/AuthConstants";

// Load user from localStorage safely
let storedUser = null;
try {
  const userFromStorage = localStorage.getItem("user");
  if (userFromStorage && userFromStorage !== "undefined") {
    storedUser = JSON.parse(userFromStorage);
  } else {
    localStorage.removeItem("user");
  }
} catch (err) {
  localStorage.removeItem("user");
}

// Initial state
const initialState = {
  user: storedUser,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// Reducer function
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_SUCCESS:
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
