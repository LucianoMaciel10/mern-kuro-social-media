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
    console.log("🔍 [updateUserData] Iniciando actualización de perfil");

    // 1. Obtener userId
    const authResult = await req.auth();
    if (!authResult?.userId) {
      console.log("❌ [updateUserData] No hay userId");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID found",
      });
    }

    const { userId } = authResult;
    console.log("✅ [updateUserData] userId:", userId);

    // 2. Obtener datos del body
    const { username, bio, location, full_name } = req.body;
    console.log("📦 [updateUserData] Body recibido:", {
      username,
      bio,
      location,
      full_name,
    });

    // 3. Verificar si hay archivos
    console.log("📁 [updateUserData] Files:", req.files ? Object.keys(req.files) : "none");

    const hasFiles = req.files?.profile || req.files?.cover;

    // 4. Validar que al menos un campo sea proporcionado
    if (!username && !bio && !location && !full_name && !hasFiles) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided",
      });
    }

    // 5. Obtener usuario actual
    const tempUser = await User.findById(userId);
    if (!tempUser) {
      console.log("❌ [updateUserData] Usuario no encontrado");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("✅ [updateUserData] Usuario encontrado:", tempUser._id);

    const updatedData = {};

    // 6. Validar username
    if (username) {
      console.log("🔄 [updateUserData] Validando username:", username);
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

    // 7. Validar bio
    if (bio !== undefined && bio !== null) {
      console.log("🔄 [updateUserData] Validando bio");
      if (bio.length > 150) {
        return res.status(400).json({
          success: false,
          message: "Bio must be less than 150 characters",
        });
      }
      updatedData.bio = bio;
    }

    // 8. Validar location
    if (location !== undefined && location !== null) {
      console.log("🔄 [updateUserData] Actualizando location:", location);
      updatedData.location = location;
    }

    // 9. Validar full_name
    if (full_name !== undefined && full_name !== null) {
      console.log("🔄 [updateUserData] Validando full_name:", full_name);
      if (full_name.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Full name must be at least 2 characters",
        });
      }
      updatedData.full_name = full_name;
    }

    // 10. Procesar imagen de perfil
    if (req.files?.profile) {
      console.log("📸 [updateUserData] Procesando imagen de perfil");
      const profile = req.files.profile[0];
      try {
        const buffer = profile.buffer;
        console.log("📤 [updateUserData] Subiendo a ImageKit, tamaño:", buffer.length);

        const response = await imagekit.upload({
          file: buffer,
          fileName: `profile-${userId}-${Date.now()}`,
          folder: "/profiles",
        });

        console.log("✅ [updateUserData] Imagen de perfil subida:", response.fileId);

        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "512" },
          ],
        });
        updatedData.profile_picture = url;
        console.log("✅ [updateUserData] URL de perfil generada");
      } catch (error) {
        console.error("❌ [updateUserData] Error en upload de perfil:", error.message);
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture: " + error.message,
        });
      }
    }

    // 11. Procesar imagen de portada
    if (req.files?.cover) {
      console.log("📸 [updateUserData] Procesando imagen de portada");
      const cover = req.files.cover[0];
      try {
        const buffer = cover.buffer;
        console.log("📤 [updateUserData] Subiendo cover a ImageKit, tamaño:", buffer.length);

        const response = await imagekit.upload({
          file: buffer,
          fileName: `cover-${userId}-${Date.now()}`,
          folder: "/covers",
        });

        console.log("✅ [updateUserData] Cover subido:", response.fileId);

        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1280" },
          ],
        });
        updatedData.cover_photo = url;
        console.log("✅ [updateUserData] URL de cover generada");
      } catch (error) {
        console.error("❌ [updateUserData] Error en upload de cover:", error.message);
        return res.status(500).json({
          success: false,
          message: "Error uploading cover photo: " + error.message,
        });
      }
    }

    // 12. Actualizar usuario en BD
    console.log("💾 [updateUserData] Actualizando usuario con datos:", Object.keys(updatedData));
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      console.log("❌ [updateUserData] Error al actualizar usuario");
      return res.status(500).json({
        success: false,
        message: "Error updating user",
      });
    }

    console.log("✅ [updateUserData] Perfil actualizado exitosamente");
    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ [updateUserData] ERROR GENERAL:", error.message);
    console.error("Stack:", error.stack);

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

    const posts = await Post.find({ user: profileId }).populate("user");

    res.json({ success: true, profile, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
