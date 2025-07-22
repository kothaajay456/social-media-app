import * as UploadApi from '../api/UploadRequest';
import { POST_UPLOAD_SUCCESS } from './ActionTypes';

export const uploadImage = (formData) => async () => {
  try {
    const { data } = await UploadApi.uploadImage(formData);
    return data;
  } catch (error) {
    console.log('Image Upload Error:', error);
  }
};

export const uploadPost = (postData) => async (dispatch) => {
  try {
    const { data } = await UploadApi.uploadPost(postData);
    dispatch({ type: POST_UPLOAD_SUCCESS, data });
  } catch (error) {
    console.log('Post Upload Error:', error);
  }
};
