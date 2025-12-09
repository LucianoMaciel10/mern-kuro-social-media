import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import { addUserStory, deleteStory, getStories } from "../controllers/story.controller.js";

const storyRouter = express.Router();

storyRouter.post("/create", upload.single("media"), protect, addUserStory);
storyRouter.get("/get", protect, getStories);
storyRouter.delete("/:storyId", protect, deleteStory);

export default storyRouter;
