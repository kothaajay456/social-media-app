const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError =require("../utils/appError");
const getDataUri = require("../utils/datauri");
const { cloudinary, uploadtoCloudinary } = require("../utils/cloudinary");
const upload = require("../middleware/multer");
const mongoose = require("mongoose");

exports.getProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid user ID", 400));
  }

  const user = await User.findById(id)
    .select("-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires -passwordConfirm")
    .populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "user",
          select: "username profilePicture bio",
        },
        {
          path: "comments",
          select: "text user createdAt",
          populate: {
            path: "user",
            select: "username profilePicture",
          },
        },
      ],
    })
    .populate({
      path: "savePosts",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "user",
          select: "username profilePicture bio",
        },
        {
          path: "comments",
          select: "text user createdAt",
          populate: {
            path: "user",
            select: "username profilePicture",
          },
        },
      ],
    });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
});



exports.editProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { bio } = req.body;
  const profilePicture = req.file;

  console.log("[EDIT PROFILE] Request body:", req.body);
  console.log("[EDIT PROFILE] File:", profilePicture?.originalname);

  let cloudResponse;
  if (profilePicture) {
    const fileUri = getDataUri(profilePicture);
    cloudResponse = await uploadtoCloudinary(fileUri.content);
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  if (bio) user.bio = bio;
  if (cloudResponse?.secure_url) user.profilePicture = cloudResponse.secure_url;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    message: "Profile Updated",
    status: "success",
    data: {
      user,
    },
  });
});



exports.suggestedUser=catchAsync(async(req,res,next)=>{
   try {
    const allUsers = await User.find({ _id: { $ne: req.user._id } });

    const suggested = allUsers.filter(user => {
      return !user.followers.includes(req.user._id);
    });

    res.status(200).json({
      success: true,
      users: suggested,
    });
  } catch (error) {
    next(error);
  }
});

exports.followUnfollow=catchAsync(async(req,res,next)=>{
    const loginUserId=req.user._id;
    const targetUserId=req.params.id;

    if(loginUserId.toString()===targetUserId)
    {
        return next(new AppError("YOu cant foolow or unfollow yourself",400));
    }

    const targetUser=await User.findById(targetUserId);
    if(!targetUser)
    {
        return next(new AppError("User not found",404));
    }

    const isfollowing=targetUser.followers.includes(loginUserId);
    
    if(isfollowing)
    {
        await Promise.all([
            User.updateOne({_id:loginUserId},{$pull:{following:targetUserId}}),
             User.updateOne({_id:targetUserId},{$pull:{followers:loginUserId}}),
        ]);

    }
    else{
         await Promise.all([
            User.updateOne({_id:loginUserId},{$addToSet:{following:targetUserId}}),
             User.updateOne({_id:targetUserId},{$addToSet:{followers:loginUserId}}),
        ]);
    }

 const updatedLoggedInUser = await User.findById(loginUserId).select("-password");
const updatedTargetUser = await User.findById(targetUserId).select("-password");

res.status(200).json({
  message: isfollowing ? "Unfollowed successfully" : "Followed successfully",
  status: "success",
  data: {
    user: updatedLoggedInUser,
    targetUser: updatedTargetUser,
  },
});
});

exports.getMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .select("-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires -passwordConfirm")
    .populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "user",
          select: "username profilePicture bio",
        },
        {
          path: "comments",
          select: "text user createdAt",
          populate: {
            path: "user",
            select: "username profilePicture",
          },
        },
      ],
    })
    .populate({
      path: "savePosts",
  options: { sort: { createdAt: -1 } },
  populate: [
    {
      path: "user",
      select: "username profilePicture bio",
    },
    {
      path: "comments",
      select: "text user createdAt",
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    },
  ],
    });

  if (!user) {
    return next(new AppError("User not authenticated", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Authenticated User",
    data: {
      user,
    },
  });
});
