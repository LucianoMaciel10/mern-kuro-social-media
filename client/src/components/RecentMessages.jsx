/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { dummyRecentMessagesData } from "../assets/assets.js";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import moment from "moment";
import { useMediaQuery } from "../hooks/useMediaQuery.jsx";

const RecentMessages = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const is1100to1280 = useMediaQuery(1100, 1280); // 1100px - 1280px
  const isAbove1330 = useMediaQuery(1330); // >= 1330px

  const fetchRecentMessages = async () => {
    setMessages(dummyRecentMessagesData);
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  return (
    <div
      className={`max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs ${
        theme === "dark"
          ? "bg-neutral-900 shadow-md shadow-neutral-800"
          : "bg-white"
      }`}
    >
      <h3
        className={`font-semibold mb-4 ${
          theme === "dark" ? "text-neutral-400" : "text-slate-800"
        }`}
      >
        Recent Messages
      </h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            className={`flex items-start gap-2 p-2 rounded-lg ${
              theme === "dark" ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
            }`}
            key={index}
          >
            <img
              src={message.from_user_id.profile_picture}
              className="y-8 h-8 rounded-full"
            />
            <div className="w-full">
              <div
                className={`flex ${
                  is1100to1280 || isAbove1330
                    ? "justify-between gap-2"
                    : "flex-col"
                }`}
              >
                <p className="font-medium">{message.from_user_id.full_name}</p>
                <p className="text-[10px] text-slate-400">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>
              <div className="flex gap-2">
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {message.text ? message.text : "Media"}
                </p>
                {!message.seen && (
                  <p
                    className={`${
                      theme === "dark" ? "bg-blue-500" : "bg-sky-500"
                    } w-4 h-4 flex items-center justify-center rounded-full text-[10px] text-white`}
                  >
                    1
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
