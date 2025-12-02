import imagekit from "../configs/imagekit.js";
import User from "../models/User.js";
import fs from "fs/promises";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
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
    const { userId } = await req.auth();
    const { username, bio, location, full_name } = req.body;
    const hasFiles = req.files?.profile || req.files?.cover;

    // Validar que al menos un campo sea proporcionado
    if (!username && !bio && !location && !full_name && !hasFiles) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided",
      });
    }

    // Obtener usuario actual
    const tempUser = await User.findById(userId);
    if (!tempUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updatedData = {};

    // Validar y usar username solo si fue proporcionado
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

    // Validar otros campos si existen
    if (bio !== undefined) {
      if (bio.length > 150) {
        return res.status(400).json({
          success: false,
          message: "Bio must be less than 150 characters",
        });
      }
      updatedData.bio = bio;
    }

    if (location !== undefined) {
      updatedData.location = location;
    }

    if (full_name !== undefined) {
      if (full_name.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Full name must be at least 2 characters",
        });
      }
      updatedData.full_name = full_name;
    }

    // Procesar imagen de perfil
    if (req.files?.profile) {
      const profile = req.files.profile[0];
      try {
        const buffer = await fs.readFile(profile.path);
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

        await fs.unlink(profile.path);
      } catch (error) {
        console.error("Profile upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture",
        });
      }
    }

    // Procesar imagen de portada
    if (req.files?.cover) {
      const cover = req.files.cover[0];
      try {
        const buffer = await fs.readFile(cover.path);
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

        await fs.unlink(cover.path);
      } catch (error) {
        console.error("Cover upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading cover photo",
        });
      }
    }

    // Actualizar usuario
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("updateUserData error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
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
    const { userId } = req.auth();
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
    const { userId } = req.auth();
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
      return res.status(404).json({ success: false, message: "User not found" });
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