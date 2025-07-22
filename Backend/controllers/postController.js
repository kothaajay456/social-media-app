const sharp = require("sharp");
const AppError = require("../utils/appError");
const catchAsync=require("../utils/catchAsync");
const upload = require("../middleware/multer");
const { uploadtoCloudinary, cloudinary } = require("../utils/cloudinary");
const Post=require("../models/PostModel");
const User = require("../models/userModel");
const Comment=require("../models/commentModel");
const getDataUri = require("../utils/datauri");

exports.createPost = catchAsync(async (req, res, next) => {
  try {
    const profilePicture = req.file;
    if (!profilePicture) return next(new AppError("No image provided", 400));

    const fileUri = getDataUri(profilePicture);
    const result = await uploadtoCloudinary(fileUri.content);

    const newPost = await Post.create({
      caption: req.body.caption,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
      user: req.user._id,
    });

    const populatedPost = await Post.findById(newPost._id).populate(
      "user",
      "username profilePicture"
    );

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: newPost._id },
    });

    return res.status(201).json({
      status: "success",
      post: populatedPost,
    });
  } catch (err) {
    console.error(" Post creation failed:", err);
    return next(new AppError("Post creation failed", 500));
  }
});



exports.getallPosts=catchAsync(async(req,res,next)=>{
    const posts= await Post.find().populate({
        path:"user",
        select:"username profilePicture bio",
    })
    .populate(
        {
            path:"comments",
            select:"text user",
            populate:{
                path:"user",
                select:"username profilePicture",
            },
        }
    )
    .sort({createdAt:-1});

    return res.status(200).json({
        status:"success",
        results:posts.length,
        data:{
            posts,
        },
    });
});


exports.getUserPosts = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const posts = await Post.find({ user: userId })
    .populate("user", "username profilePicture") 
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    posts,
  });
});



exports.saveorunsavePost=catchAsync(async(req,res,next)=>{
    const userId=req.user._id;
    const postId =req.params.postId;

    const user=await User.findById(userId);
    if(!user)
    {
        return next (new AppError("User not found",404));
    }
    const ispostsave =user.savePosts.includes(postId);

    if(ispostsave)
    {
        user.savePosts.pull(postId);
        await user.save({validateBeforeSave:false});
        return res.status(200).json({
            status:"sucess",
            message:"Post unsaved successfully",
            data:{
                user,
            },
        });
    }
    else
    {
                user.savePosts.push(postId);
                await user.save({validateBeforeSave:false});
        return res.status(200).json({
            status:"sucess",
            message:"Post saved successfully",
            data:{
                user,
            },
        });
    }
});


exports.deletePost=catchAsync(async(req,res,next)=>{
    const {id} =req.params;
    const userId=req.user._id;

    const post=await Post.findById(id).populate("user");
    if(!post)
    {
        return next(new AppError("Post not found",404));
    }

    if(post.user._id.toString()!==userId.toString())
    {
        return next(new AppError("Not authorized to delete ths post",404));
    }

    await User.updateOne({_id:userId},{$pull:{posts:id}});

    await User.updateMany({savePosts:id},{$pull:{savePosts:id}});

    await Comment.deleteMany({post:id});

    if(post.image.publicId)
    {
        await cloudinary.uploader.destroy(post.image.publicId);
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
            status:"success",
            message:"Post deleted successfully",
        });

});


exports.likeorDislikePost=catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    const userId=req.user._id;

   const post=await Post.findById(id);
    if(!post)
    {
        return next (new AppError("Post not found",404));
    }
    const isliked =post.likes.includes(userId);

    if(isliked)
    {

    await Post.findByIdAndUpdate(id,{$pull:{likes:userId}});
        return res.status(200).json({
            status:"success",
            message:"Post disliked successfully",
        });
    }
    else
    {
      await Post.findByIdAndUpdate(id,{$addToSet:{likes:userId}},{new:true});
        return res.status(200).json({
            status:"success",
            message:"Post liked successfully",
        });
    }
});

exports.addComment=catchAsync(async(req,res,next)=>{
    const postId=req.params.id;
    const userId=req.user._id;
    const {text}=req.body;

    const post = await Post.findById(postId);

    if(!post)
    {
        return next(new AppError("post not found",404));
    }
    
    if(!text)
    {
        return next(new AppError("Comment required",400));
    }

    const comment=await Comment.create({
        text,
        user:userId,
        createdAt:Date.now(),
    });

    post.comments.push(comment);
    await post.save({validateBeforeSave:false});

    await comment.populate({
        path:"user",
        select:"username profilePicture bio",
    });
     return res.status(200).json({
            status:"success",
            message:"Comment added successfully",
            data:{
                comment,
            }
        });
});


exports.editPost = async (req, res) => {
  try {
    const { caption } = req.body;
    console.log("Uploaded File:", req.file);

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (caption) post.caption = caption;

    if (req.file) 
      {
      const fileUri = getDataUri(req.file); 
      const result = await cloudinary.uploader.upload(fileUri.content);
      post.image = {
        publicId: result.public_id,
        url: result.secure_url,
      };
    }

    await post.save();
    res.status(200).json({ message: "Post updated", updatedPost: post });
  } catch (err) {
    console.error("Edit Post Error:", err);
    res.status(500).json({ message: err.message });
  }
};

