import express from "express";
import {
  discoverUsers,
  followUser,
  getUserData,
  getUserLikedPosts,
  getUserProfiles,
  togglePrivacy,
  unfollowUser,
  updateUserData,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

const userRouter = express.Router();

userRouter.get("/data", protect, getUserData);
userRouter.post("/update", protect, upload.fields([{ name: "profile", maxCount: 1 }, { name: "cover", maxCount: 1 },]), updateUserData);
userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);
userRouter.post("/toggle-privacy", protect, togglePrivacy);
userRouter.post("/profiles", protect, getUserProfiles);
userRouter.get("/liked-posts", protect, getUserLikedPosts);

export default userRouter;