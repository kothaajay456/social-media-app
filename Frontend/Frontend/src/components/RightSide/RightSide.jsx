import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestedUsers } from "../../actions/UserAction";
import UserFollow from "../UserFollow/UserFollow";
import "./RightSide.css";

const RightSide = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { suggestedUsers } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchSuggestedUsers());
    }
  }, [dispatch, user]);

  const trends = [
    "#ReactJS",
    "#WebDevelopment",
    "#100DaysOfCode",
    "#MERN",
    "#AI",
    "#OpenSource",
  ];

  return (
    <div className="suggested-card">
      <div className="trends-box">
        <h4>🔥 Trends for you</h4>
        <ul className="trend-list">
          {trends.map((trend, index) => (
            <li key={index} className="trend-item">
              {trend}
            </li>
          ))}
        </ul>
      </div>
      
      {user && (
        <div className="suggested-users-box">
          <h4>👥 Suggested for you</h4>
          <div className="scroll-box">
            {suggestedUsers.length === 0 ? (
              <p className="no-users">No suggestions</p>
            ) : (
              suggestedUsers.map((person) => (
                <div className="follow-card" key={person._id}>
                  <UserFollow person={person} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSide;
