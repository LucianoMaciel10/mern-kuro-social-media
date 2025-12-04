import Message from "../models/Message.js";
import User from "../models/User.js";

// Enviar mensaje
export const sendMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and content are required",
      });
    }

    if (userId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Cannot send message to yourself",
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const message = await Message.create({
      sender: userId,
      receiver: receiverId,
      content: content.trim(),
    });

    res.json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Obtener conversaciones (Inbox + Pending)
export const getConversations = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Obtener todos los mensajes donde el usuario es receptor
    const messages = await Message.find({
      receiver: userId,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username profile_picture full_name");

    // Agrupar por sender y separar en inbox y pending
    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const senderId = msg.sender._id;
      if (!conversationsMap.has(senderId)) {
        conversationsMap.set(senderId, {
          userId: senderId,
          username: msg.sender.username,
          profile_picture: msg.sender.profile_picture,
          full_name: msg.sender.full_name,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
          isMutualFollow: false,
        });
      }

      if (!msg.isRead) {
        conversationsMap.get(senderId).unreadCount += 1;
      }
    });

    // Verificar si son mutuals (se siguen ambos)
    const conversations = Array.from(conversationsMap.values());
    conversations.forEach((conv) => {
      const isSenderFollowingUser = currentUser.followers.includes(conv.userId);
      const isUserFollowingSender = currentUser.following.includes(conv.userId);
      conv.isMutualFollow = isSenderFollowingUser && isUserFollowingSender;
    });

    // Separar en inbox y pending
    const inbox = conversations.filter((c) => c.isMutualFollow);
    const pending = conversations.filter((c) => !c.isMutualFollow);

    res.json({
      success: true,
      data: {
        inbox,
        pending,
        inboxCount: inbox.length,
        pendingCount: pending.length,
      },
    });
  } catch (error) {
    console.error("getConversations error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Obtener mensajes de una conversación
export const getConversationMessages = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { otherUserId } = req.params;

    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: "Other user ID is required",
      });
    }

    // Obtener todos los mensajes entre los dos usuarios
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    // Marcar como leídos los mensajes recibidos
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("getConversationMessages error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Aceptar mensaje (pasar de pending a inbox siguiendo)
export const acceptMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { senderId } = req.body;

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: "Sender ID is required",
      });
    }

    // Seguir al usuario que mandó el mensaje
    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!user || !sender) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Añadir a followers y following
    if (!user.followers.includes(senderId)) {
      user.followers.push(senderId);
    }
    if (!sender.following.includes(userId)) {
      sender.following.push(userId);
    }

    await user.save();
    await sender.save();

    res.json({
      success: true,
      message: "Message accepted and user followed",
    });
  } catch (error) {
    console.error("acceptMessage error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Rechazar/borrar mensaje
export const deleteMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.receiver !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message",
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("deleteMessage error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};