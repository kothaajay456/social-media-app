import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgetPassword } from "../../actions/AuthAction";
import logo from "../../Img/bird_21.png";
import "./Login.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgetPassword( email ));
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="logo" />
        <div className="webname">
          <h2>No Problem!</h2>
          <h5>Reset Your Password.</h5>
        </div>
      </div>
      <div className="auth-right">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>Forget Password</h3>
        <input
          type="email"
          placeholder="Enter your registered email"
          className="infoInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="button infoButton">Send OTP</button>
        <div className="auth-link-text">
          Remembered? <a href="/login">Login here</a>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
