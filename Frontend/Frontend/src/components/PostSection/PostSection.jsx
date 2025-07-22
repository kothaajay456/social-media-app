import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PostNavbar from '../PostNavbar/PostNavbar';
import PostForm from '../PostForm/PostForm';
import PostsList from '../PostsList/PostsList';
import MyPostsList from '../MyPostsList/MyPostsList';
import SavedPostsList from '../SavedPostsList/SavedPostsList';
import './PostSection.css';

const PostSection = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const { user } = useSelector((state) => state.auth);

  const renderContent = () => {
    if (!user) return <PostsList />;

    switch (activeTab) {
      case 'Posts':
        return <PostsList />;
      case 'MyPosts':
        return <MyPostsList />;
      case 'Saved':
        return <SavedPostsList />;
      case 'New':
        return <PostForm />;
      default:
        return <PostsList />;
    }
  };

  return (
    <div className="post-section">
      {user && <PostNavbar activeTab={activeTab} setActiveTab={setActiveTab} />}
      <div className="post-content">{renderContent()}</div>
    </div>
  );
};

export default PostSection;
