import { Verified } from "lucide-react";
import { useTheme } from "next-themes";

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
        <div className={`w-32 h-32 border-4 shadow-lg absolute -top-16 rounded-full ${theme === 'dark' ? 'border-neutral-700' : 'border-white'}`}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
