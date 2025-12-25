import imagekit from "../configs/imagekit.js";
import User from "../models/User.js";
import fs from "fs/promises";
import Post from "../models/Post.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateUserData = async (req, res) => {
  try {
    const authResult = await req.auth();
    if (!authResult?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID found",
      });
    }

    const { userId } = authResult;
    const { username, bio, location, full_name, privacy } = req.body;
    const hasFiles = req.files?.profile || req.files?.cover;

    if (!username && !bio && !location && !full_name && !hasFiles && !privacy) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided",
      });
    }

    const tempUser = await User.findById(userId);
    if (!tempUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedData = {};

    if (username) {
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters",
        });
      }

      if (tempUser.username !== username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Username already taken",
          });
        }
      }
      updatedData.username = username;
    }

    if (bio !== undefined && bio !== null) {
      if (bio.length > 150) {
        return res.status(400).json({
          success: false,
          message: "Bio must be less than 150 characters",
        });
      }
      updatedData.bio = bio;
    }

    if (location !== undefined && location !== null) {
      updatedData.location = location;
    }

    if (full_name !== undefined && full_name !== null) {
      if (full_name.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Full name must be at least 2 characters",
        });
      }
      updatedData.full_name = full_name;
    }

    if (req.files?.profile) {
      const profile = req.files.profile[0];
      try {
        const buffer = profile.buffer;
        const response = await imagekit.upload({
          file: buffer,
          fileName: `profile-${userId}-${Date.now()}`,
          folder: "/profiles",
        });

        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "512" },
          ],
        });
        updatedData.profile_picture = url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture: " + error.message,
        });
      }
    }

    if (req.files?.cover) {
      const cover = req.files.cover[0];
      try {
        const buffer = cover.buffer;
        const response = await imagekit.upload({
          file: buffer,
          fileName: `cover-${userId}-${Date.now()}`,
          folder: "/covers",
        });

        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1280" },
          ],
        });
        updatedData.cover_photo = url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error uploading cover photo: " + error.message,
        });
      }
    }

    updatedData.isPrivate = privacy;

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Error updating user",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const discoverUsers = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { fullname: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });
    const filterUsers = allUsers.filter((user) => user._id !== userId);
    res.json({ success: true, users: filterUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);

    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You are already following this user",
      });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    res.json({ success: true, message: "Now you are following this user" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);

    user.following = user.following.filter((user) => user !== id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter((user) => user !== userId);
    await toUser.save();

    res.json({
      success: true,
      message: "You are no longer following this user",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const togglePrivacy = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isPrivate = !user.isPrivate;
    await user.save();

    res.json({
      success: true,
      message: `Profile is now ${user.isPrivate ? "private" : "public"}`,
      isPrivate: user.isPrivate,
    });
  } catch (error) {
    console.error("togglePrivacy error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getUserProfiles = async (req, res) => {
  try {
    const { profileId } = req.body;
    const profile = await User.findById(profileId);

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const posts = await Post.find({ user: profileId })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, profile, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
