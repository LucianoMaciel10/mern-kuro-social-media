import { Calendar, MapPin, PenBox, Verified } from "lucide-react";
import { useTheme } from "next-themes";
import moment from "moment";

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`relative py-4 px-6 md:px-8 ${
        theme === "dark"
          ? "bg-neutral-900 shadow-md shadow-neutral-800"
          : "bg-white"
      }`}
    >
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div
          className={`w-32 h-32 border-4 shadow-lg absolute -top-16 rounded-full ${
            theme === "dark" ? "border-neutral-700" : "border-white"
          }`}
        >
          <img
            src={user.profile_picture}
            className="absolute rounded-full z-2"
          />
        </div>
        <div className="w-full pt-16 md:pt-0 md:pl-36">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-neutral-200" : "text-neutral-900"
                  }`}
                >
                  {user.full_name}
                </h1>
                <Verified className="w-6 h-6 text-blue-500" />
              </div>
              <p
                className={`${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {user.username ? `@${user.username}` : "Add a username"}
              </p>
            </div>
            {!profileId && (
              <button
                onClick={() => setShowEdit(true)}
                className={`flex items-center gap-2 border px-4 rounded-lg font-medium transition-all mt-4 md:mt-0 cursor-pointer active:scale-95 ${
                  theme === "dark"
                    ? "border-neutral-700 bg-neutral-900 hover:bg-neutral-800/80"
                    : "border-neutral-300 bg-neutral-50 hover:bg-neutral-200/50"
                }`}
              >
                <PenBox className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
          <p
            className={`text-sm max-w-md mt-4 ${
              theme === "dark" ? "text-neutral-400/80" : "text-neutral-500"
            }`}
          >
            {user.bio}
          </p>

          <div
            className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mt-4 ${
              theme === "dark" ? "text-neutral-400/60" : "text-neutral-500/85"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-5 h-5" />
              {user.location ? user.location : "Add location"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-5 h-5" />
              Joined{" "}
              <span
                className={`font-semibold ${
                  theme === "dark" && "text-neutral-400/80"
                }`}
              >
                {moment(user.createdAt).fromNow()}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-6 mt-6 border-t border-neutral-200 pt-2">
            <div>
              <span
                className={`sm:text-xl font-bold ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-900"
                }`}
              >
                {posts.length}
              </span>
              <span className="text-xs sm:text-sm ml-1.5 text-neutral-500">
                Posts
              </span>
            </div>
            <div>
              <span
                className={`sm:text-xl font-bold ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-900"
                }`}
              >
                {user.followers.length}
              </span>
              <span className="text-xs sm:text-sm text-neutral-500 ml-1.5">
                Followers
              </span>
            </div>
            <div>
              <span
                className={`sm:text-xl font-bold ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-900"
                }`}
              >
                {user.following.length}
              </span>
              <span className="text-xs sm:text-sm text-neutral-500 ml-1.5">
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
