import multer from "multer";
import path from "path";

// Usar memory storage en lugar de disk storage
const storage = multer.memoryStorage();

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedMimes.includes(mime) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, png, webp, gif)"));
  }
};

// Configuración de multer
export const upload = multer({
  storage, // ✅ memory storage, no disk
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});
