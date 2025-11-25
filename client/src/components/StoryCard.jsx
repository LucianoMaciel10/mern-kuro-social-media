import moment from "moment";
import { useTheme } from "next-themes";

const StoryCard = ({ story, setViewStory }) => {
  const { theme } = useTheme();

  return (
    <div
      onClick={() => setViewStory(story)}
      className={`relative rounded-lg shadow min-w-30 max-w-30 max-h-40 cursor-pointer hover:shadow-lg transition-all duration-200 bg-linear-to-b active:scale-95 ${
        theme === "dark"
          ? "from-neutral-900 to-gray-800 hover:from-neutral-800 hover:to-gray-700 shadow-neutral-700"
          : "from-blue-400 to-gray-400 hover:from-blue-500 hover:to-gray-500"
      }`}
    >
      <img
        src={story.user.profile_picture}
        className="absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow"
      />
      <p className="absolute top-18 left-3 text-sm truncate max-w-24">
        {story.content}
      </p>
      <p className="absolute bottom-1 right-2 z-10 text-xs text-white">
        {moment(story.createdAt).fromNow()}
      </p>
      {story.media_type !== "text" && (
        <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
          {story.media_type === "image" ? (
            <img
              src={story.media_url}
              className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
            />
          ) : (
            <video
              src={story.media_url}
              className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StoryCard;
