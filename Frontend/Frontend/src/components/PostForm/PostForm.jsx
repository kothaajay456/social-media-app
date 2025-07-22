import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../actions/PostAction";
import "./PostForm.css";

const PostForm = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    dispatch(createPost(formData));
    setCaption("");
    setImage(null);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={caption}
        placeholder="What's on your mind?"
        onChange={(e) => setCaption(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Share</button>
    </form>
  );
};

export default PostForm;
