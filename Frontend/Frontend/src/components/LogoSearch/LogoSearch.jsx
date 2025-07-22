import React from "react";
import "./LogoSearch.css";
import { UilSearch } from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";

const LogoSearch = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className="LogoSearch">
      <div className="Search">
        <input type="text" placeholder="Search users..." />
        <div className="s-icon">
          <UilSearch />
        </div>
      </div>
    </div>
  );
};

export default LogoSearch;
