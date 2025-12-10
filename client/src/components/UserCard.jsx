import { useTheme } from "next-themes";
import { MapPin, MessageCircle, UserCheck, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserCard = ({ user }) => {
  const { theme } = useTheme();
  const currentUser = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const handleFollow = async () => {};

  return (
    <div
      className={`p-4 pt-6 flex flex-col justify-between w-72 hover:shadow-lg border shadow rounded-md ${
        theme === "dark"
          ? "bg-neutral-900 border-neutral-700 shadow-md shadow-neutral-800"
          : "border-neutral-400/60 bg-neutral-50"
      }`}
    >
      <div className="text-center">
        <img
          onClick={() => navigate(`/profile/${user._id}`)}
          src={user.profile_picture}
          className="rounded-full w-16 shadow-md mx-auto cursor-pointer"
        />
        <p
          onClick={() => navigate(`/profile/${user._id}`)}
          className="mt-4 font-semibold cursor-pointer mx-auto w-fit"
        >
          {user.full_name}
        </p>
        {user.username && (
          <p
            className={`font-light ${
              theme === "dark" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            @{user.username}
          </p>
        )}
        {user.bio && (
          <p
            className={`mt-2 text-center text-sm px-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {user.bio}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-2 text-xs">
        <div
          className={`flex items-center gap-1 border rounded-full px-3 py-1 ${
            theme === "dark"
              ? "border-neutral-700 text-neutral-400"
              : "border-neutral-300 text-neutral-700"
          }`}
        >
          <MapPin className="w-4 h-4" /> {user.location}
        </div>
        <div
          className={`flex items-center gap-1 border rounded-full px-3 py-1 ${
            theme === "dark"
              ? "border-neutral-700 text-neutral-400"
              : "border-neutral-300 text-neutral-700"
          }`}
        >
          <span>{user.followers.length}</span> Followers
        </div>
      </div>

      <div className="flex mt-4 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFollow();
          }}
          style={{
            outline: currentUser?.following.includes(user._id)
              ? theme === "dark"
                ? "1px solid gray"
                : "1px solid white"
              : "none",
            outlineOffset: "-5px",
          }}
          className={`flex items-center w-full py-2 justify-center gap-2 rounded-full active:scale-95 transition text-white cursor-pointer bg-linear-to-r
          ${
            theme === "dark"
              ? currentUser?.following.includes(user._id)
                ? "from-neutral-700/80 to-neutral-950 hover:from-neutral-700 hover:to-neutral-900"
                : "from-blue-500/80 to-blue-800/80 hover:from-blue-500 hover:to-blue-800"
              : currentUser?.following.includes(user._id)
              ? "from-neutral-400/40 to-neutral-500/60 hover:from-neutral-400/60 hover:to-neutral-500/80"
              : "from-sky-400/80 to-sky-600/80 hover:from-sky-400 hover:to-sky-600"
          }`}
        >
          {currentUser?.following.includes(user._id) ? (
            <>
              <UserCheck className="w-4.5 h-4.5" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="w-4.5 h-4.5" />
              Follow
            </>
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/messages/${user._id}`)
          }}
          className={`flex items-center p-2 rounded-full justify-center border-2 group cursor-pointer active:scale-95 transition  ${
            theme === "dark"
              ? "text-neutral-500 border-neutral-500/40 bg-neutral-500/50 hover:bg-neutral-500/65"
              : "text-neutral-500/60 border-neutral-500/30 bg-neutral-300/90 hover:bg-neutral-400/50"
          }`}
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-105 transition" />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
