import { Calendar, MapPin, PenBox, Verified } from "lucide-react";
import { useTheme } from "next-themes";
import moment from "moment";
import { useMediaQuery } from "../hooks/useMediaQuery";

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  const { theme } = useTheme();
  const mediaQuery521 = useMediaQuery(521);
  const mediaQuery377 = useMediaQuery(377);

  return (
    <div
      className={`relative py-4 px-6 md:px-8 ${
        theme === "dark"
          ? "bg-neutral-900 shadow-md shadow-neutral-800"
          : "bg-white"
      }`}
    >
      <div className="flex items-start gap-6">
        <div
          className={`
            w-32 h-32 border-4 shadow-lg absolute rounded-full
            ${
              mediaQuery521
                ? "-top-16 left-8"
                : "-top-44 left-1/2 -translate-x-1/2"
            }
            ${theme === "dark" ? "border-neutral-700" : "border-white"}
          `}
        >
          <img
            src={user.profile_picture}
            className={`rounded-full w-full h-full object-cover`}
          />
        </div>
        <div className="w-full">
          <div className={`flex justify-between ${mediaQuery377 ? 'items-center' : 'flex-col gap-2'}`}>
            <div className={`${mediaQuery521 ? "pl-36" : "pl-0"}`}>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-neutral-200" : "text-neutral-900"
                  }`}
                >
                  {user.full_name}
                </h1>
                {user.isVerified && <Verified className="w-6 h-6 text-blue-500" />}
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
                className={`flex items-center gap-2 border px-4 rounded-lg font-medium transition-all cursor-pointer active:scale-95 w-fit ${
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
            className={`text-sm max-w-md mt-2 ${
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

          <div className={`flex flex-wrap items-center gap-6 mt-6 border-t pt-2 ${theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-neutral-500">
                Posts
              </span>
              <span
                className={`sm:text-xl font-bold ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-900"
                }`}
              >
                {posts?.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-neutral-500">
                Followers
              </span>
              <span
                className={`sm:text-xl font-bold ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-900"
                }`}
              >
                {user.followers.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-neutral-500">
                Following
              </span>
              <span
                className={`sm:text-xl font-bold ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-900"
                }`}
              >
                {user.following.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
