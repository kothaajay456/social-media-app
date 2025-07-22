import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {followUser } from "../../actions/UserAction";
import "./UserFollow.css";

const UserFollow = ({ person }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isFollowing = user?.following?.includes(person._id);

  const handleFollow = () => {
    if (isFollowing) {
      dispatch(followUser(person._id));
    } else {
      dispatch(followUser(person._id));
    }
  };

  return (
    <div className="user-follow-card">
      <div className="user-info">
        <img
          src={person.profilePicture|| "/defaultProfile.png"}
          alt={person.username}
          className="user-avatar"
        />
        <div>
          <h5>{person.username}</h5>
          <p>{person.bio || "No bio available"}</p>
        </div>
      </div>
      <button
        className={`follow-btn  follow`}
        onClick={handleFollow}
      >
        Follow
      </button>
    </div>
  );
};

export default UserFollow;
