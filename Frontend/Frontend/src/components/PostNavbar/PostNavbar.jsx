import React from "react";
import "./PostNavbar.css";

const PostNavbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="post-navbar">
      <button
        className={activeTab === "Posts" ? "active" : ""}
        onClick={() => setActiveTab("Posts")}
      >
        Posts
      </button>
      <button
        className={activeTab === "MyPosts" ? "active" : ""}
        onClick={() => setActiveTab("MyPosts")}
      >
        My Posts
      </button>
      <button
        className={activeTab === "New" ? "active" : ""}
        onClick={() => setActiveTab("New")}
      >
        New
      </button>
      <button
        className={activeTab === "Saved" ? "active" : ""}
        onClick={() => setActiveTab("Saved")}
      >
        Saved
      </button>
    </div>
  );
};

export default PostNavbar;
