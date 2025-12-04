import { useTheme } from "next-themes";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Messages = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [inbox, setInbox] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${API_URL}/api/messages/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInbox(data.data.inbox);
        setPending(data.data.pending);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversations();
  }, [getToken]);

  return (
    <div
      className={`min-h-screen relative flex justify-center h-full overflow-y-scroll no-scrollbar`}
    >
      <div className="w-screen sm:w-lg md:w-2xl lg:w-3xl 2xl:w-5xl p-6">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 mt-3 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-900"
            }`}
          >
            Inbox{" "}
            <span
              className={`ml-2 font-medium text-2xl px-2 rounded-md text-white ${
                theme === "dark" ? "bg-blue-500" : "bg-sky-500"
              }`}
            >
              {inbox.length}
            </span>
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Talk to the people you follow and who follow you
          </p>
        </div>

        {inbox && inbox.length > 0 && (
          <div className={`flex flex-col gap-5`}>
            {inbox.map((user) => (
              <div
                className={` flex gap-5 p-6 shadow rounded-md ${
                  theme === "dark"
                    ? "bg-neutral-900 shadow-md shadow-neutral-800"
                    : "bg-white"
                }`}
                key={user._id}
              >
                <img
                  src={user.profile_picture}
                  className="rounded-full size-12 mx-auto"
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
                    className={`text-sm mt-1 ${
                      theme === "dark" ? "text-neutral-500" : "text-neutral-600"
                    }`}
                  >
                    {user.bio}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/messages/${user._id}`)}
                    className={`size-10 flex items-center justify-center text-sm rounded active:scale-95 transition cursor-pointer gap-1 ${
                      theme === "dark"
                        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className={`size-10 flex items-center justify-center text-sm rounded active:scale-95 transition cursor-pointer ${
                      theme === "dark"
                        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="my-8">
          <h1
            className={`text-3xl font-bold mb-2 mt-3 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-900"
            }`}
          >
            Pending{" "}
            <span
              className={`ml-2 font-medium text-2xl px-2 rounded-md text-white ${
                theme === "dark" ? "bg-blue-500" : "bg-sky-500"
              }`}
            >
              {pending.length}
            </span>
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Messages from people you don't follow
          </p>
        </div>

        {pending && pending.length > 0 && (
          <div className={`flex flex-col gap-5 pb-27 sm:pb-5`}>
            {pending.map((user) => (
              <div
                className={` flex gap-5 p-6 shadow rounded-md ${
                  theme === "dark"
                    ? "bg-neutral-900 shadow-md shadow-neutral-800"
                    : "bg-white"
                }`}
                key={user._id}
              >
                <img
                  src={user.profile_picture}
                  className="rounded-full size-12 mx-auto"
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
                    className={`text-sm mt-1 ${
                      theme === "dark" ? "text-neutral-500" : "text-neutral-600"
                    }`}
                  >
                    {user.bio}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/messages/${user._id}`)}
                    className={`size-10 flex items-center justify-center text-sm rounded active:scale-95 transition cursor-pointer gap-1 ${
                      theme === "dark"
                        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className={`size-10 flex items-center justify-center text-sm rounded active:scale-95 transition cursor-pointer ${
                      theme === "dark"
                        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
