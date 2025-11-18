import mongoose, { Schema } from "mongoose";

//If your code works don't touch it,
//rather make new Schema for comments and connect it with existing model for User and Post to avoid any mishappenings
//this is what we are doing here.
const commentSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
