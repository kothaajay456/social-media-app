import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPosts,
  likeOrDislikePost,
  toggleSavePost,
  addComment,
} from "../../actions/PostAction";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import "./PostsList.css";

const PostsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allPosts: posts } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(likeOrDislikePost(postId));
  };

  const handleSave = (postId) => {
    dispatch(toggleSavePost(postId));
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (commentText.trim()) {
      dispatch(addComment(postId, commentText));
      setCommentText("");
      setSelectedPostId(null);
    }
  };

  const viewProfile = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  if (!posts || posts.length === 0) {
    return <p>No posts available</p>;
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          {post?.user ? (
            <div
              className="post-user"
              onClick={() => viewProfile(post.user._id)}
            >
              <img
                src={
                  post.user.profilePicture ||
                  post.user.profilePic ||
                  "/defaultAvatar.png"
                }
                alt="user"
                className="user-avatar"
              />
              <span>{post.user.username}</span>
            </div>
          ) : (
            <div className="post-user">
              <img
                src="/defaultAvatar.png"
                alt="unknown user"
                className="user-avatar"
              />
              <span>Unknown</span>
            </div>
          )}

          <img className="post-image" src={post.image?.url} alt="post" />

          <p className="post-caption">{post.caption}</p>

          {user && (
            <>
              <div className="post-actions">
                <button
                  onClick={() => handleLike(post._id)}
                  className="btn-like"
                >
                  {post.likes && post.likes.includes(user._id) ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>

                <button
                  onClick={() => setSelectedPostId(post._id)}
                  className="btn-comment"
                >
                  <FaRegCommentDots />
                </button>

                <button
                  onClick={() => handleSave(post._id)}
                  className={`btn-save ${
                    post.saved && post.saved.includes(user._id) ? "saved" : ""
                  }`}
                >
                  {post.saved && post.saved.includes(user._id) ? (
                    <FaBookmark />
                  ) : (
                    <FaRegBookmark />
                  )}
                </button>
              </div>

              {selectedPostId === post._id && (
                <form
                  className="comment-form"
                  onSubmit={(e) => handleCommentSubmit(e, post._id)}
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit">Post</button>
                </form>
              )}
            </>
          )}

          {post.comments && post.comments.length > 0 && (
            <div className="comments-section">
              {post.comments.map((c, index) => (
                <p key={index} className="comment-text">
                  <strong>{c.username || "User"}:</strong> {c.text}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsList;
