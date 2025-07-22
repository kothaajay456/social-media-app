// App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/auth/Login';
import Signup from './Pages/auth/Signup';
import Home from './Pages/home/Home';
import ForgetPassword from './Pages/auth/ForgetPassword';
import ChangePassword from './Pages/auth/ChangePassword';
import ResetPassword from './Pages/auth/ResetPassword';
import OtpVerify from "./Pages/auth/OtpVerify";
import Logout from './Pages/auth/Logout';
import Navbar from './components/Navbar/Navbar'; 
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<OtpVerify />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
