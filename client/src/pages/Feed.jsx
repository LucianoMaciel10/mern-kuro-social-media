import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import { useTheme } from "next-themes";
import RecentMessages from "../components/RecentMessages";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { dark } from "@clerk/themes";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Feed = () => {
  const { getToken } = useAuth();
  const { theme, setTheme } = useTheme();
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
  const mediaQuery640 = useMediaQuery(640);

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handleLikeUpdate = (postId, updatedLikes) => {
    setPosts(
      posts.map((p) => (p._id === postId ? { ...p, likes: updatedLikes } : p))
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await getToken();
        const { data } = await api.get("/api/posts/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(data.posts);
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [getToken]);

  return !loading ? (
    <div
      className={`h-full overflow-y-scroll no-scrollbar xl:pr-5 flex items-start justify-center 2xl:gap-8 pb-27 pt-6 sm:pb-6 sm:pt-12`}
    >
      <div className="px-6 w-screen sm:w-lg md:w-2xl lg:w-3xl 2xl:w-4xl">
        {!mediaQuery640 && (
          <div className="flex justify-between mb-5">
            <img
              src={theme === "dark" ? assets.logoL : assets.logoD}
              className="w-35"
            />
            <UserButton
              appearance={{
                theme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: {
                    width: "40px",
                    height: "40px",
                  },
                  userButtonTrigger: {
                    "&:focus": {
                      boxShadow: "none",
                    },
                  },
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Change theme"
                  labelIcon={
                    theme === "dark" ? (
                      <Sun className="w-4 h-4 fill-[#ABABAC] text-[#ABABAC]" />
                    ) : (
                      <Moon stroke="none" fill="#616161" className="w-4 h-4" />
                    )
                  }
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        )}
        <StoriesBar />
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              handlePostUpdate={handlePostUpdate}
              onLikeUpdate={handleLikeUpdate}
              key={post._id}
              post={post}
              withShadow={true}
            />
          ))}
        </div>
      </div>

      <div className="pr-4 xl:p-0 hidden lg:block sticky top-0">
        <div
          className={`max-w-xs text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow ${
            theme === "dark"
              ? "bg-neutral-900 shadow-md shadow-neutral-800"
              : "bg-white"
          }`}
        >
          <h3
            className={`font-semibold ${
              theme === "dark" ? "text-neutral-400" : "text-slate-800"
            }`}
          >
            Sponsored
          </h3>
          <img
            src={assets.sponsored_img}
            className="rounded-md object-scale-down"
          />
          <p
            className={`${
              theme === "dark" ? "text-slate-500" : "text-slate-800"
            }`}
          >
            Email marketing
          </p>
          <p
            className={`${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Supercharge your marketing with a powerful, easy-to-use platform
            built for results
          </p>
        </div>
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
