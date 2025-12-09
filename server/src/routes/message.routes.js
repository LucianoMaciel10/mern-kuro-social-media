import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import {
  sseController,
  sendMessage,
  getConversations,
  getConversationMessages,
  acceptMessage,
  deleteMessage,
  getUserRecentMessages,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/sse", sseController); // SSE - Conexión en tiempo real
messageRouter.post("/send", upload.single("image"), protect, sendMessage);
messageRouter.get("/conversations", protect, getConversations);
messageRouter.get("/conversation/:otherUserId", protect, getConversationMessages);
messageRouter.get("/recent", protect, getUserRecentMessages);
messageRouter.post("/accept", protect, acceptMessage);
messageRouter.delete("/:messageId", protect, deleteMessage);

export default messageRouter;