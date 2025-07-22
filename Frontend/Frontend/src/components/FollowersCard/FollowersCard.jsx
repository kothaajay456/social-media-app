import React, { useEffect, useState } from "react";
import "./FollowersCard.css";
import { getMe, getProfile } from "../../api/UserRequest";
import { followUser } from "../../actions/UserAction";
import { useDispatch } from "react-redux";

const FollowersCard = () => {
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getMe();
      const user = res.data.data.user;
      setUserId(user._id);
      setMyFollowing(user.following || []);

      const followerUsers = await Promise.all(
        user.followers.map((id) => getProfile(id).then(res => res.data.data.user))
      );

      const followingUsers = await Promise.all(
        user.following.map((id) => getProfile(id).then(res => res.data.data.user))
      );

      setFollowers(followerUsers);
      setFollowing(followingUsers);
    } catch (err) {
      console.error("Error loading followers/following:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFollowToggle = async (id) => {
    await dispatch(followUser(id));
    fetchUsers();
  };

  const isFollowing = (id) => myFollowing.includes(id);

  return (
    <div className="FollowersCard">
      <h6>Following</h6>
      <div className="scrollSection">
        {loading ? (
          <p>Loading...</p>
        ) : following.length === 0 ? (
          <p>No users</p>
        ) : (
          following.map((user) => (
            <div key={user._id} className="userCard">
              <div className="userInfo">
                <img src={user.profilePicture || "/defaultProfile.png"} alt="profile" />
                <span>{user.username}</span>
              </div>
              {user._id !== userId && (
                <button onClick={() => handleFollowToggle(user._id)}>Unfollow</button>
              )}
            </div>
          ))
        )}
      </div>

      <h6>Followers</h6>
      <div className="scrollSection">
        {loading ? (
          <p>Loading...</p>
        ) : followers.length === 0 ? (
          <p>No users</p>
        ) : (
          followers.map((user) => (
            <div key={user._id} className="userCard">
              <div className="userInfo">
                <img src={user.profilePicture || "/defaultProfile.png"} alt="profile" />
                <span>{user.username}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowersCard;
