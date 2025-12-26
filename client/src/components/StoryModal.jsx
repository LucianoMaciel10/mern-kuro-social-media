import { useState } from "react";
import { ArrowLeft, Sparkle, TextIcon, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";

const StoryModal = ({ setShowModal, fetchStories }) => {
  const { theme } = useTheme();
  const bgColors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488",
  ];
  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { getToken } = useAuth();
  const MAX_VIDEO_DURATION = 60; // seconds
  const MAX_VIDEO_SIZE_MB = 10;

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video")) {
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(`Video must be smaller than ${MAX_VIDEO_SIZE_MB}MB`);
          return;
        }

        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          if (video.duration > MAX_VIDEO_DURATION) {
            toast.error("Video duration cannot exceed 1 minute");
            return;
          }

          setMedia(file);
          setPreviewUrl(URL.createObjectURL(file));
          setText("");
          setMode("media");
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
        setText("");
        setMode("media");
      }
    }
  };

  const handleCreateStory = async () => {
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";

    if (media_type === "text" && !text) {
      throw new Error("Please enter some text");
    }

    const formData = new FormData();
    formData.append("content", text);
    formData.append("media_type", media_type);

    if (media) {
      formData.append("media", media);
    }

    formData.append("background_color", background);

    // ✅ DEBUG
    console.log("📤 Enviando:", {
      content: text,
      media_type,
      mediaSize: media?.size,
      mediaType: media?.type,
      backgroundColor: background,
    });

    const token = await getToken();
    try {
      const { data } = await api.post("/api/stories/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setShowModal(false);
        toast.success("Story created successfully");
        fetchStories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Story creation error:", error);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return createPortal(
    <div
      style={{ pointerEvents: "auto" }}
      className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md relative">
        <div className="absolute -top-12 w-full text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>
        <div
          style={{ backgroundColor: background }}
          className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden"
        >
          {mode === "text" && (
            <div className="relative w-full h-full">
              <textarea
                placeholder="What's on your mind?"
                className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
              <div
                style={{
                  borderBottom: "350px solid",
                  borderBottomColor: "neutral",
                  borderLeft: "450px solid transparent",
                }}
                className={`opacity-5 absolute bottom-0 -right-20 w-full h-full rounded pointer-events-none`}
              />
            </div>
          )}
          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img src={previewUrl} className="object-contain max-h-full" />
            ) : (
              <video src={previewUrl} className="object-contain max-h-full" />
            ))}
        </div>
        <div className="flex mt-4 gap-2">
          {bgColors.map((color) => (
            <button
              onClick={() => setBackground(color)}
              key={color}
              className="w-6 h-6 rounded-full ring cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 p-2 rounded ${
              mode === "text" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <TextIcon size={18} /> Text
          </button>
          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "media" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <input
              type="file"
              accept="image/*, video/*"
              className="hidden"
              onChange={(e) => handleMediaUpload(e)}
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>
        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Saving...",
            })
          }
          className={`flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded-lg bg-linear-to-r active:scale-95 transition cursor-pointer ${
            theme === "dark"
              ? "from-blue-500 to-blue-900 hover:from-blue-400 hover:to-blue-800"
              : "from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600"
          }`}
        >
          <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>,
    document.body
  );
};

export default StoryModal;
