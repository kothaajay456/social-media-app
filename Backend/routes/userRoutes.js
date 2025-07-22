const express=require("express");

const {signup, verifyAcoount, resendOtp, login, logout, resetPassword, forgetPassword, changePassword}=require("../controllers/authController");
const isAuthenticated = require("../middleware/isAuthenticated");
const { getProfile, editProfile, suggestedUser, followUnfollow, getMe } = require("../controllers/userController");
const upload = require("../middleware/multer");

//auth routes
const router =express.Router();

const { body } = require("express-validator");

router.post("/signup", [
  body("username").trim().isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
], signup);

router.post("/verify",isAuthenticated,verifyAcoount);

router.post("/resend-otp",isAuthenticated,resendOtp);

router.post("/login", login);


router.post("/logout",logout);

router.post("/forget-password",forgetPassword);

router.post("/reset-password",resetPassword);

router.post("/change-password",isAuthenticated,changePassword);





//user routes

router.get("/profile/:id",getProfile);


router.post("/edit-profile", isAuthenticated, upload.single("profilePicture"), editProfile);

router.get("/suggested-user",isAuthenticated,suggestedUser);

router.post("/follow-unfollow/:id",isAuthenticated,followUnfollow);

router.get("/me",isAuthenticated,getMe);

module.exports=router;