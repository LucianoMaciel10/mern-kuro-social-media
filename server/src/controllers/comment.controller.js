import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Crear comentario
export const createComment = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { postId, content } = req.body;

    if (!postId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post ID and content are required",
      });
    }

    // Verificar que el post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: userId,
      post: postId,
    });

    // Populate para obtener datos del autor
    await comment.populate("author", "username profile_picture full_name");

    res.json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    console.error("createComment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Obtener comentarios de un post
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    // Verificar que el post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username profile_picture full_name")
      .populate("likes", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({ post: postId });

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("getPostComments error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Obtener un comentario específico
export const getComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)
      .populate("author", "username profile_picture full_name")
      .populate("likes", "username");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("getComment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Like/Unlike comentario
export const toggleCommentLike = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Verificar si el usuario ya le dio like
    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      // Remover like
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      // Añadir like
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      message: hasLiked ? "Like removed" : "Like added",
      data: {
        commentId: comment._id,
        likesCount: comment.likes.length,
        hasLiked: !hasLiked,
      },
    });
  } catch (error) {
    console.error("toggleCommentLike error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Eliminar comentario
export const deleteComment = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Verificar que el usuario es el autor o admin
    if (comment.author !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("deleteComment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};