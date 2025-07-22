
import React, { useState } from 'react';
import './Signup.css';
import Logo from '../../Img/bird_21.png';
import { useDispatch } from 'react-redux';
import { signup } from '../../actions/AuthAction';
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', passwordConfirm: ''
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData));
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={Logo} alt="Logo" />
        <div className="webname">
          <h2>Create Account</h2>
          <h5>Join and share your thoughts.</h5>
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit} novalidate>
          <h2>Signup</h2>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required/>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
          <input type="password" name="passwordConfirm" placeholder="Confirm Password" onChange={handleChange} required />
          <button type="submit">Register</button>
          <p className="auth-link-text">
          Already registered? <Link to="/login">Login</Link>
        </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
