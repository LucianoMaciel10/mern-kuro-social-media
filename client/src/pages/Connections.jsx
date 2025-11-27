import { useNavigate } from "react-router-dom";
import {
  dummyConnectionsData as connections,
  dummyFollowingData as following,
  dummyFollowersData as followers,
  dummyPendingConnectionsData as pendingConnections,
} from "../assets/assets";
import {
  MessageSquare,
  UserCheck,
  UserPlus,
  UserRoundPen,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

const Connections = () => {
  const [currentTab, setCurrentTab] = useState("Followers");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const mediaQuery392 = useMediaQuery(392);
  const mediaQuery640 = useMediaQuery(640);

  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Connections", value: connections, icon: UserPlus },
  ];

  return (
    <div className={`min-h-screen`}>
      <div className={`max-w-6xl mx-auto p-6`}>
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 mt-3 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-900"
            }`}
          >
            Connections
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Manage your network and discover new connections
          </p>
        </div>

        <div
          className={`mb-8 flex flex-wrap gap-6 ${
            !mediaQuery640 && "justify-center"
          }`}
        >
          {dataArray.map((item, index) => (
            <div
              className={`flex flex-col items-center justify-center rounded-md gap-1 border h-20 w-40 border-gray-200 ${
                theme === "dark"
                  ? "bg-neutral-900 shadow-md shadow-neutral-800"
                  : "bg-white"
              }`}
              key={index}
            >
              <b>{item.value.length}</b>
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        <div
          className={`inline-flex flex-wrap items-center border rounded-md p-1
            ${!mediaQuery640 && "w-full justify-center"} ${
            theme === "dark"
              ? "bg-neutral-900 shadow-md shadow-neutral-800"
              : "bg-white"
          }`}
        >
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                currentTab === tab.label
                  ? theme === "dark"
                    ? "text-neutral-50 font-medium"
                    : "text-neutral-900 font-medium"
                  : theme === "dark"
                  ? "text-neutral-500 hover:text-neutral-400"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
              key={tab.label}
            >
              <tab.icon className="w-5 h-5" />
              <span className="ml-1">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          className={`flex flex-wrap gap-6 mt-6 ${!mediaQuery640 && "pb-21 justify-center"}`}
        >
          {dataArray
            .find((item) => item.label === currentTab)
            .value.map((user) => (
              <div
                key={user._id}
                className={`w-fit flex gap-5 p-6 rounded-md ${
                  theme === "dark"
                    ? "bg-neutral-900 shadow-md shadow-neutral-800"
                    : "bg-white"
                }`}
              >
                <img
                  src={user.profile_picture}
                  className="rounded-full w-12 h-12 shadow-md mx-auto"
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-neutral-100" : "text-neutral-700"
                    }`}
                  >
                    {user.full_name}
                  </p>
                  <p
                    className={`${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    @{user.username}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-neutral-500" : "text-neutral-400"
                    }`}
                  >
                    {user.bio.slice(0, 30)}...
                  </p>
                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    {
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className={`w-full p-2 text-sm rounded active:scale-95 transition text-white cursor-pointer ${
                          theme === "dark"
                            ? " bg-sky-600/60 hover:bg-sky-700"
                            : "bg-sky-500/60  hover:bg-sky-500/80"
                        }`}
                      >
                        View Profile
                      </button>
                    }
                    {currentTab === "Following" && (
                      <button
                        className={`w-full text-white p-2 text-sm rounded active:scale-95 transition cursor-pointer ${
                          theme === "dark"
                            ? "bg-red-800/50 hover:bg-red-800/80"
                            : "bg-red-300/60 hover:bg-red-300/80"
                        }`}
                      >
                        Unfollow
                      </button>
                    )}
                    {currentTab === "Pending" && (
                      <button
                        className={`w-full p-2 text-white text-sm rounded active:scale-95 transition cursor-pointer ${
                          theme === "dark"
                            ? "bg-green-900/60 hover:bg-green-900"
                            : "bg-green-600/40 hover:bg-green-600/60"
                        }`}
                      >
                        Accept
                      </button>
                    )}
                    {currentTab === "Connections" && (
                      <button
                        onClick={() => navigate(`/messages/${user._id}`)}
                        className={`w-full p-2 text-white text-sm rounded active:scale-95 transition cursor-pointer flex items-center justify-center gap-1 ${
                          theme === "dark"
                            ? "bg-sky-900/50 hover:bg-sky-900"
                            : "bg-sky-600/40 hover:bg-sky-600/60"
                        }`}
                      >
                        <MessageSquare className="w-5 h-5" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
