import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    author: { type: String, required: true, ref: "User" }, 
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" }, 
    likes: [{ type: String, ref: "User" }], 
    replies: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        author: { type: String, ref: "User" },
        content: { type: String, required: true },
        likes: [{ type: String, ref: "User" }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
