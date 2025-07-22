import React, { useEffect, useState } from "react";
import "./Home.css";
import ProfileSide from "../../components/ProfileSide/ProfileSide";
import PostSection from "../../components/PostSection/PostSection";
import RightSide from "../../components/RightSide/RightSide";
import { useDispatch } from "react-redux";
import { getAllPosts } from "../../actions/PostAction";
import { fetchSuggestedUsers } from "../../actions/UserAction";
import { FiMenu } from "react-icons/fi";

const Home = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [showMenu, setShowMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("posts");

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(fetchSuggestedUsers());

    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const renderMobileContent = () => {
    switch (activeSection) {
      case "profile":
        return <div className="MobileSection"><ProfileSide /></div>;
      case "trends":
        return <div className="MobileSection"><RightSide /></div>;
      default:
        return <PostSection />;
    }
  };

  return (
    <>
      {isMobile && (
        <>
          <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            <FiMenu size={24} />
          </div>
          {showMenu && (
            <div className="mobile-menu">
              <button onClick={() => { setActiveSection("profile"); setShowMenu(false); }}>Profile</button>
              <button onClick={() => { setActiveSection("posts"); setShowMenu(false); }}>Posts</button>
              <button onClick={() => { setActiveSection("trends"); setShowMenu(false); }}>Trends</button>
            </div>
          )}
        </>
      )}

      <div className="Home">
        {isMobile ? (
          renderMobileContent()
        ) : (
          <>
            <div className="ProfileSide">
              <ProfileSide />
            </div>
            <PostSection />
            <div className="RightSide">
              <RightSide />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
