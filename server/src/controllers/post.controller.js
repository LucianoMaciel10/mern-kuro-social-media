import imagekit from "../configs/imagekit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const addPost = async (req, res) => {
  try {
    const { userId } = await await req.auth();
    const { content, post_type } = req.body;
    const images = req.files;

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    let image_urls = [];

    if (images && images.length > 0) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          try {
            const response = await imagekit.upload({
              file: image.buffer,
              fileName: `post-${userId}-${Date.now()}-${Math.random()}`,
              folder: "/posts",
            });

            const url = imagekit.url({
              path: response.filePath,
              transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "1280" },
              ],
            });
            return url;
          } catch (error) {
            console.error("Image upload error:", error);
            throw new Error("Failed to upload image");
          }
        })
      );
    }

    const post = await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });

    res.json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("addPost error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);

    const userIds = [userId, ...user.following];
    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((user) => user !== userId);
      await post.save();
      res.json({ success: true, message: "Post unliked" });
    } else {
      post.likes.push(userId);
      await post.save();
      res.json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
