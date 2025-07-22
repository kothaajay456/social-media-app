import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/AuthAction';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../../Img/bird_21.png'; 
import LogoSearch from "../LogoSearch/LogoSearch";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
 console.log(user);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/home");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="logo">
          <img src={logo} alt="Birdie Logo" className="birdie-logo" />
          Birdie
        </div>
      </Link>
       
     <LogoSearch/>
      <div className="navbar-links">
     {user ? (
  <>
    <div className="navbar-user-info" onClick={toggleDropdown}>
  <FaUserCircle size={24} color="#333" style={{ marginRight: "8px" }} />
  <span className="username">{user?.username}</span>
</div>

    {dropdownOpen && (
      <div className="dropdown-menu" onMouseLeave={closeDropdown}>
        <Link to={`/profile/${user._id}`} className="dropdown-item">Profile</Link>
        <Link to="/change-password" className="dropdown-item">Change Password</Link>
        <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
      </div>
    )}
  </>
) : (
  <>
    <Link to="/login" className="button">Login</Link>
    <Link to="/signup" className="button">Signup</Link>
  </>
)}
       
      </div>
    </nav>
  );
};

export default Navbar;
