import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPosts, deletePost, editPost } from "../../actions/PostAction";
import "./MyPostsList.css";

const MyPostsList = () => {
  const dispatch = useDispatch();
  const { userPosts: myPosts } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editedCaption, setEditedCaption] = useState("");
  const [editedImage, setEditedImage] = useState(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserPosts(user._id));
    }
  }, [dispatch, user]);

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedCaption(post.caption);
    setEditedImage(null); 
  };

  const handleSave = (e, postId) => {
    e.preventDefault; 

    const formData = new FormData();
    formData.append("caption", editedCaption);
    if (editedImage) {
      formData.append("image", editedImage);
    }

    dispatch(editPost(postId, formData));
    setEditingPostId(null);
  };

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  return (
    <div className="my-posts-list">
      <h3>My Posts</h3>
      {myPosts && myPosts.length > 0 ? (
        myPosts.map((post) => (
          <div key={post._id} className="my-post-card">
            <img src={post.image?.url} alt="post" className="my-post-image" />

            {editingPostId === post._id ? (
              <>
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  rows={3}
                  className="my-post-caption"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditedImage(e.target.files[0])}
                />
                <button onClick={(e) => handleSave(e, post._id)} className="btn-save">
                  Save
                </button>
                <button
                  onClick={() => setEditingPostId(null)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="my-post-caption">{post.caption}</p>
                <div className="post-actions">
                  <button onClick={() => handleEdit(post)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post._id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
};

export default MyPostsList;
