import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../actions/AuthAction";
import "./Signup.css";
import Logo from "../../Img/bird_21.png";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changePassword(currentPassword, newPassword, newPasswordConfirm));
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
              <img src={Logo} alt="Logo" />
              <div className="webname">
                <h2>Hello!</h2>
                <h5>Change Your Password.</h5>
              </div>
            </div>
            <div className="auth-right">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={newPasswordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
      </form>
      </div>
    </div>
  );
};

export default ChangePassword;
