import React from "react";
import "./ProfileSide.css";
import LogoSearch from "../LogoSearch/LogoSearch";
import ProfileCard from "../ProfileCard/ProfileCard";
import FollowersCard from "../FollowersCard/FollowersCard";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileSide = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="ProfileSide">
      {user ? (
        <>
          <ProfileCard />
          <FollowersCard />
        </>
      ) : (
        <div className="login-message">
          <h2>Please <Link to="/login">Login</Link> to view your profile</h2>
        </div>
      )}
    </div>
  );
};

export default ProfileSide;
