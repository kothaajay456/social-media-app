import {
  USER_LOAD,
  USER_LOAD_SUCCESS,
  USER_LOAD_FAIL,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  FOLLOW_USER,
  FOLLOW_USER_FAIL,
  SUGGESTED_USERS_SUCCESS,
  SUGGESTED_USERS_FAIL,
  SET_SUGGESTED_USERS
} from "../constants/userConstants";

const initialState = {
  loading: false,
  user: null,            
  profile: null,         
  suggestedUsers: [],
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOAD:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case USER_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user || state.user,
        profile: action.payload.profile || state.profile,
      };

    case USER_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
     case USER_LOAD_SUCCESS:
     return {
       ...state,
      loading: false,
        user: action.payload,
       };
    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };

    case USER_UPDATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case SET_SUGGESTED_USERS:
      return { 
        ...state,
         suggestedUsers: action.payload 
        };
    case SUGGESTED_USERS_SUCCESS:
      return {
        ...state,
        suggestedUsers: action.payload,
      };

    case SUGGESTED_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case FOLLOW_USER:
  return {
    ...state,
    user: action.payload.updatedUser,
    suggestedUsers: state.suggestedUsers.map((u) =>
      u._id === action.payload.updatedTargetUser._id
        ? action.payload.updatedTargetUser
        : u
    ),
  };

    case FOLLOW_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
