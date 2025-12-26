import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedVideoMimes = ["video/mp4", "video/quicktime", "video/webm"];
  const allowedImageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const allowedVideoExts = [".mp4", ".mov", ".webm"];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isAllowedImage = allowedImageMimes.includes(mime) && allowedImageExts.includes(ext);
  const isAllowedVideo = allowedVideoMimes.includes(mime) && allowedVideoExts.includes(ext);

  if (isAllowedImage || isAllowedVideo) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB para soportar videos
  },
});