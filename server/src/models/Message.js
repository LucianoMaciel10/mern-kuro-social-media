import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true, ref: "User" },
    receiver: { type: String, required: true, ref: "User" },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ createdAt: -1 });

const Message = mongoose.model("Message", MessageSchema);

export default Message;