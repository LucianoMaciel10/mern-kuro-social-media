import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { CirclePlus } from "lucide-react";

const CreatePostBtn = () => {
  const { theme } = useTheme();
  const mediaQuery1280 = useMediaQuery(1280);

  return (
    <Link
      to={"/create-post"}
      className={`flex items-center justify-center gap-2 bg-linear-to-r  active:scale-95 transition cursor-pointer text-white ${
        theme === "dark"
          ? "from-blue-500 to-blue-900 hover:from-blue-400 hover:to-blue-800"
          : "from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600"
      } 
          ${mediaQuery1280 ? "py-2.5 rounded-lg" : "rounded-full p-1"}`}
    >
      {mediaQuery1280 ? (
        <>
          <CirclePlus className="w-5 h-5" />
          Create Post
        </>
      ) : (
        <CirclePlus className="w-7 h-7" />
      )}
    </Link>
  );
};

export default CreatePostBtn;
