import { useState } from "react";
import { dummyUserData } from "../assets/assets.js";
import { useTheme } from "next-themes";
import { ImagePlus, X } from "lucide-react";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const user = dummyUserData;

  const handleSubmit = async () => {};

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-screen sm:w-lg md:w-2xl lg:w-3xl 2xl:w-5xl p-6">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 mt-3 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-900"
            }`}
          >
            Create Post
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Share your thoughts with the world
          </p>
        </div>

        <div
          className={`w-full p-4 sm:p-8 sm:pb-3 rounded-xl shadow space-y-2 ${
            theme === "dark"
              ? "bg-neutral-900 shadow-md shadow-neutral-800"
              : "bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={user.profile_picture}
              className="w-12 h-12 rounded-full shadow"
            />
            <div>
              <h2 className="font-semibold">{user.full_name}</h2>
              <p className="text-sm text-neutral-500">@{user.username}</p>
            </div>
          </div>

          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            className="w-full resize-none max-h-20 mt-2 h-20 text-sm outline-none placeholder-neutral-400"
            placeholder="What's happening?"
          />

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {images.map((image, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    className="h-20 rounded-md"
                  />
                  <div
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
                  >
                    <X className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`flex items-center justify-between pt-3 border-t ${theme === 'dark' ? 'border-neutral-500' : 'border-neutral-300'}`}>
            <label
              htmlFor="images"
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition cursor-pointer"
            >
              <ImagePlus className="size-6" />
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              className="hidden"
              multiple
              onChange={(e) => setImages([...images, ...e.target.files])}
            />
            <button
              disabled={loading}
              onClick={() =>
                toast.promise(handleSubmit(), {
                  loading: "Uploading...",
                  success: "Post Added!",
                  error: "Post Not Added",
                })
              }
              className={`text-sm bg-linear-to-r text-white px-8 py-2 active:scale-95 transition font-medium rounded-md cursor-pointer ${
                theme === "dark"
                  ? "from-blue-500 to-blue-900 hover:from-blue-400 hover:to-blue-800"
                  : "from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600"
              }`}
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
