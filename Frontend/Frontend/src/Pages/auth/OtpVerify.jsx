import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verify, resendOtp } from '../../actions/AuthAction';
import './OtpVerify.css';
import Logo from '../../Img/bird_21.png';
import { toast } from 'react-toastify';

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();

 const user = JSON.parse(localStorage.getItem("user"));
const email = user?.email;
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verify(otp));
  };

  const handleResend = () => {
    if (!email) {
      toast.error("Email not found. Please log in again.");
      return;
    }
    dispatch(resendOtp(email));
  };

  return (
    <div className="otp-container">
      <div className="otp-left">
        <img src={Logo} alt="Logo" />
        <div className="otp-webname">
          <h2>Verify Your Account</h2>
          <p>Enter the OTP sent to your email</p>
        </div>
      </div>

      <div className="otp-right">
        <form className="otp-form" onSubmit={handleSubmit}>
          <h2>OTP Verification</h2>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit">Verify</button>
            <button type="button" onClick={handleResend}>
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
