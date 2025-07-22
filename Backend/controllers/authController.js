const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");
const fs =require("fs");
const path=require("path");
const hbs=require("hbs");
const sendEmail = require("../utils/email");



const loadTemplate=(templateName,replacements)=>{
    const templatePath=path.join(__dirname,"../emailTemplate",templateName);
    const source =fs.readFileSync(templatePath,'utf8');
    const template =hbs.compile(source);
    return template(replacements);

}


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  res.cookie("token", token, cookieOptions);

  user.password = undefined;
  user.otp = undefined;
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};


const sanitizeEmail = (input) => String(input).replace(/\$/g, '');
const sanitize = (input) => String(input).replace(/\$|\./g, '');

exports.signup = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const passwordConfirm = req.body.passwordConfirm;
  const username = sanitize(req.body.username);

  const existuser = await User.findOne({ email });
  if (existuser) {
    return next(new AppError("Email already registered", 400));
  }

  const otp = generateOtp();
  const otpExpires = Date.now() + 24 * 60 * 60 * 1000;

  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    otp,
    otpExpires,
  });
  

  const htmlTemplate=loadTemplate('otpTemplate.hbs',{
    title:'Otp Verification',
    username:newUser.username,
    otp,
    message:"One Time Password for Verification",
  });

   try{
    await sendEmail({
        email:newUser.email,
        subject:"OTP verify",
        html:htmlTemplate
    });
    createSendToken(newUser, 200, res, "User created successfully");
   }
   catch(err)
   {
       await User.findByIdAndDelete(newUser.id);
       return next(new AppError("Please try again later",500));
   }

});



exports.verifyAcoount=catchAsync(async(req,res,net)=>{
  const {otp}=req.body;
  if(!otp)
  {
    return next(new AppError("Otp is reqyired for verification",400));
  }
  const user=req.user;

  if(user.otp!==otp)
  {
 return next(new AppError("Invalid otp",400));
  }

  if(Date.now()>user.otpExpires)
  {
    return next(new AppError("Otp has Expired",400));
  }


  user.isverified=true;
  user.otp=undefined;
  user.otpExpires=undefined;
  
  await user.save({validateBeforeSave:false});

  createSendToken(user,200,res,"Email has been verified");
});


exports.resendOtp=catchAsync(async(req,res,next)=>{
  const {email}=req.user;
  if(!email)
  {
    return (new AppError("Email is required",400));
  }

  const user =await User.findOne({email});

  if(!user)
  {
    return next(new AppError("User not found",400));
  }

  if(user.isverified)
  {
    return next(new AppError("This account is already verified",400));
  }

   const otp = generateOtp();
  const otpExpires = Date.now() + 24 * 60 * 60 * 1000;

  user.otp=otp;
  user.otpExpires=otpExpires;
  await user.save({validateBeforeSave:false});

  const htmlTemplate=loadTemplate('otpTemplate.hbs',{
    title:'Otp Verification',
    username:user.username,
    otp,
    message:"One Time Password for Verification",
  });

 try{
    await sendEmail({
        email:user.email,
        subject:"Resend otp for verification",
        html:htmlTemplate
    });
    res.status(200).json({
      status:"success",
      message:"A new otp sent",
    }
  );
}
   catch(err)
   {
    user.otp=undefined;
    user.otpExpires=undefined;
       await user.save({validateBeforeSave:false});
       return next(new AppError("Please try again later",500));
   };


});


exports.login = catchAsync(async (req, res, next) => {
  const email = sanitizeEmail(req.body.email);
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    console.log("User not found:", email);
    return next(new AppError("Incorrect email or password", 401));
  }

  const isMatch = await user.correctPassword(password);
  console.log("Password match:", isMatch);

  if (!isMatch) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res, "Login successful");
});




exports.logout=catchAsync(async(req,res,next)=>{
res.cookie('token',"loggedout",{
  expires:new Date(Date.now()+10*1000),
  httpOnly:true,
  secure:process.env.NODE_ENV === 'production',
});
res.status(200).json({
  status:"success",
  message:"Logged out successfully",
});
});


exports.forgetPassword=catchAsync(async(req,res,next)=>{
  const {email}=req.body;
  const user=await User.findOne({email});
  if(!user)
  {
    return next(new AppError("User not found",404));
  }

  const otp=generateOtp();
  const resetExpires=Date.now()+5*60*1000;
  user.resetPasswordOtp=otp;
  user.resetPasswordOtpExpires=resetExpires;
  await user.save({validateBeforeSave:false});
  const htmlTemplate=loadTemplate("otpTemplate.hbs",{
    title:"Reset Password otp",
    username:user.username,
    otp,
    message:"Your password reset otp is "
  });
  try{
await sendEmail({
  email:user.email,
  subject:"Password rest otp(valid for 5min)",
  html:htmlTemplate,
});

res.status(200).json({
  status:"success",
  message:"Password reset otp is send to your email",
});
  }
  catch(err)
  {
    user.resetPasswordOtp=undefined;
    user.resetPasswordOtpExpires=undefined;
    await user.save({validateBeforeSave:false})
    return next(new AppError("There was an error sending the email.Try again",500));
  }
});


exports.resetPassword=catchAsync(async(req,res,next)=>{
  const {email,otp,password,passwordConfirm}=req.body;
  const user=await User.findOne({email,resetPasswordOtp:otp,resetPasswordOtpExpires:{$gt:Date.now()},})

  if(!user)
  {
    return next(new AppError("NO User",400));
  }
  user.password=password;
  user.passwordConfirm=passwordConfirm;
  user.resetPasswordOtp=undefined;
  user.resetPasswordOtpExpires=undefined;
  await user.save();
  createSendToken(user,200,res,"Password reset successfully");
});



exports.changePassword=catchAsync(async(req,res,next)=>{
  const {currentPassword,newPassword,newPasswordConfirm}=req.body;
  const {email}=req.user;
  const user=await User.findOne({email}).select("+password");
  if(!user)
  {
    return next(new AppError("User not found",404));
  }
  if(!(await user.correctPassword(currentPassword)))
  {
    return next(new AppError("Incorrect password",400));
  }
  if(newPassword!==newPasswordConfirm)
  {
    return next(new AppError("New passwords are not same",400));
  }
  user.password=newPassword;
  user.passwordConfirm=newPasswordConfirm;

  await user.save();

  createSendToken(user,200,res,"Password change successfully");
})