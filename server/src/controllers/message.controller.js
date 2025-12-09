import imagekit from "../configs/imagekit.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const connections = {};

// SSE Controller para conectar usuarios
export const sseController = async (req, res) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    console.log("New Client connected:", userId);

    // Headers SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Guardar la conexión
    connections[userId] = res;

    // Enviar mensaje de conexión
    res.write("data: Connected to messaging stream\n\n");

    // Heartbeat cada 30 segundos para mantener la conexión viva
    const heartbeatInterval = setInterval(() => {
      try {
        res.write(": heartbeat\n\n");
      } catch (error) {
        clearInterval(heartbeatInterval);
        delete connections[userId];
      }
    }, 30000);

    // Manejar desconexión
    req.on("close", () => {
      clearInterval(heartbeatInterval);
      delete connections[userId];
      console.log("Client disconnected:", userId);
    });

    req.on("error", () => {
      clearInterval(heartbeatInterval);
      delete connections[userId];
      console.log("Client error:", userId);
    });
  } catch (error) {
    console.error("sseController error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { receiver, content } = req.body;
    const image = req.file;

    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "Receiver is required",
      });
    }

    if (!content?.trim() && !image) {
      return res.status(400).json({
        success: false,
        message: "Content or media is required",
      });
    }

    if (userId === receiver) {
      return res.status(400).json({
        success: false,
        message: "Cannot send message to yourself",
      });
    }

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    let media_url = "";
    let message_type = image ? "image" : "text";

    if (message_type === "image") {
      try {
        const response = await imagekit.upload({
          file: image.buffer,
          fileName: `message-${userId}-${Date.now()}`,
          folder: "/messages",
        });

        media_url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1280" },
          ],
        });
      } catch (error) {
        console.error("ImageKit upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    const message = await Message.create({
      sender: userId,
      receiver,
      content: content?.trim() || "",
      message_type,
      media_url,
    });

    await message.populate("sender", "username profile_picture full_name");

    res.json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });

    if (connections[receiver]) {
      try {
        connections[receiver].write(`data: ${JSON.stringify(message)}\n\n`);
      } catch (error) {
        console.error("Error writing to SSE connection:", error);
        delete connections[receiver];
      }
    } else {
      console.log(`Receiver ${receiver} is not connected to SSE`);
    }
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
    }).sort({ createdAt: -1 });

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

export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Obtener mensajes recibidos Y enviados
    const messages = await Message.find({
      $or: [{ receiver: userId }, { sender: userId }],
    })
      .populate(
        "sender receiver",
        "username profile_picture full_name"
      )
      .sort({ createdAt: -1 })
      .limit(80); // Obtener suficientes para agrupar en ~8 conversaciones

    // Agrupar por conversación (sender/receiver)
    const conversations = {};

    messages.forEach((msg) => {
      const otherUserId =
        msg.sender._id === userId ? msg.receiver._id : msg.sender._id;

      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          otherUser: msg.sender._id === userId ? msg.receiver : msg.sender,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: msg.receiver._id === userId && !msg.isRead ? 1 : 0,
        };
      } else if (msg.receiver._id === userId && !msg.isRead) {
        conversations[otherUserId].unreadCount += 1;
      }
    });

    // Limitar a 8 conversaciones
    const recentConversations = Object.values(conversations).slice(0, 8);

    res.json({
      success: true,
      data: recentConversations,
    });
  } catch (error) {
    console.error("getUserRecentMessages error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
