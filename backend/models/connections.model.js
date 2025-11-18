import mongoose, { Schema } from "mongoose";

const connectionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: false,
  },
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);

export default ConnectionRequest;
