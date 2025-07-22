import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword, resendresetOtp } from '../../actions/AuthAction';
import './Signup.css';
import Logo from '../../Img/bird_21.png';
import { Center, Flex } from '@mantine/core';
const ResetPassword = () => {
  const dispatch = useDispatch();
  const email = localStorage.getItem("resetEmail");

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword(otp, password, passwordConfirm));
  };

  const handleResend = () => {
    if (!email) return;
    dispatch(resendresetOtp());
    setTimer(15);
    setCanResend(false);
  };

  return (
    <div className="auth-container">
       <div className="auth-left">
              <img src={Logo} alt="Logo" />
              <div className="webname">
                <h2>Welcome Back!</h2>
                <h5>Login to connect and share your world.</h5>
              </div>
            </div>
      <div>
        <div className='auth-right'>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>

        <div style={{ marginTop: '10px' }}>
          <button style={{justifyContent:Center,alignItems:Center, display:Flex}} type="button" disabled={!canResend} onClick={handleResend}>
            {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
          </button>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
};

export default ResetPassword;
