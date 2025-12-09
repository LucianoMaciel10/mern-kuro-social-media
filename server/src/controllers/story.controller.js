import imagekit from "../configs/imagekit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";

export const addUserStory = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;

    if (!media_type) {
      return res.status(400).json({
        success: false,
        message: "media_type is required",
      });
    }

    if (media_type !== "text" && !media) {
      return res.status(400).json({
        success: false,
        message: "Media file is required for image or video",
      });
    }

    let media_url = "";

    if (media_type === "image" || media_type === "video") {
      try {
        const response = await imagekit.upload({
          file: media.buffer,
          fileName: `story-${userId}-${Date.now()}`,
          folder: "/stories",
        });

        media_urls = response.url;
      } catch (error) {
        console.error("ImageKit upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload media",
        });
      }
    }

    const story = await Story.create({
      user: userId,
      content: content || "",
      media_url,
      media_type,
      background_color: background_color || "#000000",
    });

    res.json({ success: true, data: story });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userIds = [userId, ...user.following];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stories = await Story.find({
      user: { $in: userIds },
      createdAt: { $gte: oneDayAgo },
    })
      .populate("user", "username profile_picture full_name")
      .sort({ createdAt: -1 });

    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user._id;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(groupedStories),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { storyId } = req.body;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    if (story.user !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this story",
      });
    }

    await Story.findByIdAndDelete(storyId);

    res.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error("deleteStory error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};