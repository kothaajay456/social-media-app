import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSavePost } from "../../actions/PostAction";
import { getMe } from "../../api/UserRequest";
import "./SavedPostsList.css";

const SavedPostsList = () => {
  const dispatch = useDispatch();
  const [savedPosts, setSavedPosts] = useState([]);
  const [user, setUser] = useState(null);

  const allPosts = useSelector((state) => state.post.allPosts);

  useEffect(() => {
  const fetchUserAndSavedPosts = async () => {
    try {
      const res = await getMe();
      const fetchedUser = res.data?.data?.user;
      setUser(fetchedUser);
      setSavedPosts(fetchedUser?.savePosts || []);

      console.log("Saved Posts:", fetchedUser?.savePosts);
    } catch (error) {
      console.error("Failed to fetch saved posts:", error);
    }
  };

  fetchUserAndSavedPosts();
}, []);


  const handleUnsave = (postId) => {
    dispatch(toggleSavePost(postId));
  };

  return (
    <div className="saved-posts-list">
      <h3>Saved Posts</h3>
      {savedPosts.length > 0 ? (
        savedPosts.map((post) => (
          <div key={post._id} className="saved-post-card">
            <img
              src={post.image?.url}
              alt="Saved"
              className="saved-post-image"
            />
            <p className="saved-post-caption">{post.caption}</p>

            <div className="comments-section">
              <h5>Comments:</h5>
              {post.comments?.length > 0 ? (
                post.comments.map((c, i) => (
                  <p key={i} className="comment-text">
                    <strong>{c.user?.username || "User"}:</strong> {c.text}
                  </p>
                ))
              ) : (
                <p>No comments</p>
              )}
            </div>

            <button onClick={() => handleUnsave(post._id)}>Unsave</button>
          </div>
        ))
      ) : (
        <p>No saved posts</p>
      )}
    </div>
  );
};

export default SavedPostsList;
