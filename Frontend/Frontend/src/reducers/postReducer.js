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

const initialState = {
  allPosts: [],
  userPosts: [],
  savedPosts: [],
  loading: false,
  error: null,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_POST:
      return {
        ...state,
        allPosts: [action.payload, ...state.allPosts],
        userPosts: [action.payload, ...state.userPosts],
        error: null,
      };

    case GET_ALL_POSTS:
      return {
        ...state,
        allPosts: action.payload.data.posts,
        error: null,
      };

    case GET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload,
        error: null,
      };

    case DELETE_POST:
      return {
        ...state,
        allPosts: state.allPosts.filter((p) => p._id !== action.payload),
        userPosts: state.userPosts.filter((p) => p._id !== action.payload),
        savedPosts: state.savedPosts.filter((p) => p._id !== action.payload),
        error: null,
      };

    case SAVE_UNSAVE_POST:
      const post = action.payload.post;
      const isSaved = action.payload.saved;

      return {
        ...state,
        savedPosts: isSaved
          ? [...state.savedPosts, post]
          : state.savedPosts.filter((p) => p._id !== post._id),
        error: null,
      };

    case LIKE_DISLIKE_POST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LIKE_DISLIKE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        allPosts: state.allPosts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
        userPosts: state.userPosts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
        savedPosts: state.savedPosts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
        error: null,
      };

    case LIKE_DISLIKE_POST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_COMMENT:
    case EDIT_POST:
      return {
        ...state,
        allPosts: state.allPosts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
        userPosts: state.userPosts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
        savedPosts: state.savedPosts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
        error: null,
      };

    case POST_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default postReducer;
