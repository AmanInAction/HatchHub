import mongoose, { Schema } from "mongoose";

const educationSchema = new Schema({
  school: {
    type: String,
    default: "",
  },
  degree: {
    type: String,
    default: "",
  },
  fieldofStudy: {
    type: String,
    default: "",
  },
});

const workSchema = new Schema({
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  years: {
    type: String,
    default: 0,
  },
});

const profileSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  currentPost: {
    type: String,
    default: "",
  },
  pastWork: {
    type: [workSchema],
    default: [],
  },
  education: {
    type: [educationSchema],
    default: [],
  },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
