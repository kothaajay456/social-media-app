const mongoose = require("mongoose");
const User = require("./userModel");
const Comment = require("./commentModel");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      maxlength: [2200, "Caption must be less than 2200 characters"],
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.index({ user: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
