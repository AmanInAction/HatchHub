import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  media: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  fileType: {
    type: String,
    default: "",
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
