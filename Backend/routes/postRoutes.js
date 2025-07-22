const express=require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../middleware/multer");
const { createPost, getallPosts, getUserPosts, saveorunsavePost, deletePost, likeorDislikePost, addComment ,editPost} = require("../controllers/postController");
const router =express.Router();


router.post("/create-post",isAuthenticated,upload.single("image"),createPost);

router.get("/all",getallPosts);

router.get("/user-post/:id", getUserPosts);

router.post("/save-unsave-post/:postId",isAuthenticated,saveorunsavePost);

router.delete("/delete-post/:id",isAuthenticated,deletePost);

router.post("/like-dislike/:id",isAuthenticated,likeorDislikePost);

router.post("/comment/:id",isAuthenticated,addComment);

router.put("/edit-post/:id", isAuthenticated, upload.single("image"), editPost);



module.exports=router;