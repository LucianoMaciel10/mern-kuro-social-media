import { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import { useTheme } from "next-themes";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
  const { theme } = useTheme();
  const [feeds, setFeeds] = useState(dummyPostsData);
  const [loading, setLoading] = useState(false);

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData);
  };

  useEffect(() => {
    (() => {
      fetchFeeds();
      setLoading(false);
    })();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center 2xl:gap-8">
      <div className="px-4 w-screen sm:w-lg md:w-2xl lg:w-3xl 2xl:w-4xl">
        <StoriesBar />
        <div className="space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
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
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-800'}`}>Sponsored</h3>
          <img src={assets.sponsored_img} className="rounded-md object-scale-down" />  
          <p className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-800'}`}>Email marketing</p>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Supercharge your marketing with a powerful, easy-to-use platform built for results</p>
        </div>
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
