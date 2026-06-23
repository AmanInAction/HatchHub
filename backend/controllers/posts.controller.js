import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";

import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Active" });
};

export const createPost = async (req, res) => {
  try {
    // ✅ Get token from headers instead of body
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Save post
    const post = new Post({
      userID: user._id,
      body: req.body.body,
      media: req.file ? `uploads/${req.file.filename}` : "",
      fileType: req.file ? req.file.mimetype : "",
    });

    await post.save();

    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const currentUser = token
      ? await User.findOne({ token }).select("_id")
      : null;

    const posts = await Post.find()
      .populate("userID", "name username email profilePicture")
      .sort({ createdAt: -1 });

    const hydratedPosts = posts.map((post) => {
      const likedBy = post.likedBy || [];
      const normalizedLikeCount = Math.max(post.likes || 0, likedBy.length);
      const likedByCurrentUser = currentUser
        ? likedBy.some(
            (likedUserId) =>
              likedUserId.toString() === currentUser._id.toString()
          )
        : false;

      return {
        ...post.toObject(),
        likes: normalizedLikeCount,
        likedByCurrentUser,
      };
    });

    return res.status(200).json({ posts: hydratedPosts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.body;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: postId });

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post is not found" });
    }

    if (post.userID.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await post.deleteOne({ _id: postId });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { postId, commentBody } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      userID: user._id,
      postId,
      body: commentBody,
      createdAt: new Date(),
    });
    await newComment.save();

    return res
      .status(200)
      .json({ message: "Comment added successfully", newComment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    const comments = await Comment.find({ postId: post_id })
      .populate("userID", "name username email profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { postId, commentId } = req.body;

    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.findOne({ _id: commentId, postId });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userID.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Comment.deleteOne({ _id: commentId });

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { token, postId } = req.body;

    const user = await User.findOne({ token }).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedPost = await Post.findOneAndUpdate(
      {
        _id: postId,
        likedBy: { $ne: user._id },
      },
      {
        $addToSet: { likedBy: user._id },
        $inc: { likes: 1 },
        $set: { updatedAt: new Date() },
      },
      {
        new: true,
      }
    );

    if (!updatedPost) {
      const existingPost = await Post.findById(postId).select("likes likedBy");
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({
        message: "Post already liked",
        likesCount: Math.max(
          existingPost.likes || 0,
          existingPost.likedBy?.length || 0
        ),
        postId: existingPost._id,
        likedByCurrentUser: true,
      });
    }

    return res.status(200).json({
      message: "Post liked successfully",
      likesCount: updatedPost.likes,
      postId: updatedPost._id,
      likedByCurrentUser: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
