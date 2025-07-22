import React, { useState, useEffect } from 'react';
import './Login.css';
import Logo from '../../Img/bird_21.png';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/AuthAction';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData,navigate)); 
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={Logo} alt="Logo" />
        <div className="webname">
          <h2>Welcome Back!</h2>
          <h5>Login to connect and share your world.</h5>
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <p className="auth-link-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p className="auth-link-text">
            <Link to="/forget-password">Forgot Password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
