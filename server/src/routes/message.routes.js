import express from "express";
import {
  sendMessage,
  getConversations,
  getConversationMessages,
  acceptMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.post("/send", protect, sendMessage);
messageRouter.get("/conversations", protect, getConversations);
messageRouter.get("/conversation/:otherUserId", protect, getConversationMessages);
messageRouter.post("/accept", protect, acceptMessage);
messageRouter.delete("/:messageId", protect, deleteMessage);

export default messageRouter;