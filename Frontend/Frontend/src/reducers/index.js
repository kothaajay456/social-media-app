import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import postReducer from './postReducer';

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  post: postReducer,
});
