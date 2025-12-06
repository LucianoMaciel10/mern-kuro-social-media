import express from "express";
import {
  createComment,
  getPostComments,
  getComment,
  toggleCommentLike,
  deleteComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middlewares/auth.js";

const commentRouter = express.Router();

commentRouter.post("/create", protect, createComment);
commentRouter.get("/post/:postId", getPostComments);
commentRouter.get("/:commentId", getComment);
commentRouter.post("/:commentId/like", protect, toggleCommentLike);
commentRouter.delete("/:commentId", protect, deleteComment);

export default commentRouter;