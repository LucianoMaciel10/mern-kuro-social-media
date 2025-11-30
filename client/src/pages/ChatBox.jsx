import { useEffect, useRef, useState } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { useTheme } from "next-themes";
import { Image, SendHorizonal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatBox = () => {
  const messages = dummyMessagesData;
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(dummyUserData);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const sendMessage = async () => {};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    user && (
      <div className="flex flex-col h-screen">
        <div
          className={`flex items-center gap-2 px-5 md:px-10 lg:px-22 xl:px-35 bg-linear-to-r border-b ${
            theme === "dark"
              ? "from-blue-900/50 to-neutral-900 border-gray-700 py-[7.7px]"
              : "from-sky-100 to-sky-50 border-neutral-200 py-2"
          }`}
        >
          {/* to-do: cambiar user por el usuario con el que va a chatear mediante el id del usuario en los parametros de la url */}
          <img
            onClick={() => navigate(`/profile/${user._id}`)}
            src={user.profile_picture}
            className={`size-9 rounded-full shadow-md cursor-pointer ${
              theme === "dark" ? "shadow-neutral-700" : "shadow-neutral-400"
            }`}
          />
          <div>
            <p
              onClick={() => navigate(`/profile/${user._id}`)}
              className="font-medium cursor-pointer"
            >
              {user.full_name}
            </p>
            <p className="text-sm text-neutral-500 -mt-1.5">@{user.username}</p>
          </div>
        </div>
        <div className="px-5 md:px-10 lg:px-22 xl:px-35 h-full overflow-y-scroll no-scrollbar">
          <div className="flex flex-col mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => (
                <div
                  className={`flex flex-col mt-4 ${
                    message.to_user_id !== user._id
                      ? "items-start"
                      : "items-end"
                  }`}
                  key={index}
                >
                  <div
                    className={`p-2 text-sm max-w-sm shadow
                      ${
                        message.to_user_id !== user._id
                          ? "rounded-bl-none"
                          : "rounded-br-none"
                      } 
                      ${
                        theme === "dark"
                          ? "text-neutral-100 bg-neutral-800 rounded-lg shadow-neutral-700"
                          : "text-neutral-700 bg-white rounded-lg"
                      }
                    `}
                  >
                    {message.message_type === "image" && (
                      <img
                        src={message.media_url}
                        className="w-full max-w-sm rounded-lg mb-1"
                      />
                    )}
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            <div className="mt-0.5" ref={messagesEndRef} />
          </div>
        </div>
        <div className="pt-5 mb-20 sm:mb-0 mx-5">
          <label
            htmlFor="input-message"
            className={`flex cursor-text items-center gap-3 pl-5 max-h-13.5 p-3 w-full max-w-xl mx-auto border shadow rounded-full mb-5 relative ${
              theme === "dark"
                ? "bg-neutral-800 border-neutral-600 shadow-neutral-800"
                : "bg-white border-neutral-300"
            }`}
          >
            <label htmlFor="input-image">
              {image ? (
                <img src={URL.createObjectURL(image)} className="h-8 rounded" />
              ) : (
                <Image
                  className={`size-7 cursor-pointer ${
                    theme === "dark"
                      ? "hover:text-neutral-400 text-neutral-500"
                      : "hover:text-neutral-500 text-neutral-400"
                  }`}
                />
              )}
              <input
                id="input-image"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <input
              id="input-message"
              type="text"
              className={`flex-1 outline-none ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-700"
              }`}
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            {text && (
              <button
                className={`absolute bg-linear-to-r active:scale-95 hover:scale-105 right-2 transition cursor-pointer text-white shadow p-2.5 rounded-full ${
                  theme === "dark"
                    ? "from-blue-400 to-blue-600"
                    : "from-sky-200 to-sky-500/90"
                }`}
                onClick={sendMessage}
              >
                <SendHorizonal />
              </button>
            )}
          </label>
        </div>
      </div>
    )
  );
};

export default ChatBox;
