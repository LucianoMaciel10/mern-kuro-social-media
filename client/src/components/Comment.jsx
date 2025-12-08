import moment from "moment";
import { useTheme } from "next-themes";
import HeartComponent from "./HeartComponent";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Comment = ({ commentId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentComment, setCurrentComment] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        const { data: userData } = await axios.get(`${API_URL}/api/user/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(userData.user);

        const { data: commentData } = await axios.get(
          `${API_URL}/api/comments/${commentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentComment(commentData.data);
      } catch (error) {
        console.error("Error fetching comment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken, commentId]);

  return loading ? (
    <div
      className={`flex flex-col gap-1 rounded-lg p-2 ${
        theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className={`rounded-full w-[35%] p-2 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-white'}`}></div>
        <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-white'}`}></div>
        <div className="flex justify-between">
          <div className={`rounded-full w-[12%] p-2 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-white'}`}></div>
          <div className={`rounded-full w-[10%] p-2 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-white'}`}></div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`flex flex-col gap-1 rounded-lg p-2 ${
        theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
      }`}
    >
      <div className="flex gap-2 items-center">
        <img
          onClick={() => navigate(`/profile/${currentComment.author._id}`)}
          src={currentComment.author.profile_picture}
          className="w-10 rounded-full cursor-pointer"
        />
        <p
          onClick={() => navigate(`/profile/${currentComment.author._id}`)}
          className="font-semibold cursor-pointer"
        >
          {currentComment.author.username}
        </p>
        <p
          className={`text-xs ${
            theme === "dark" ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          {moment(currentComment.createdAt).fromNow()}
        </p>
      </div>
      <p className="font-light">{currentComment.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium cursor-pointer">Reply</span>
          <HeartComponent
            currentUser={currentComment.author}
            likes={currentComment.likes}
          />
        </div>
        {currentUser?._id === currentComment.author._id && (
          <span
            className={`cursor-pointer ${
              theme === "dark"
                ? "text-red-500 hover:text-red-400"
                : "text-red-400 hover:text-red-600"
            }`}
          >
            Remove
          </span>
        )}
      </div>
    </div>
  );
};

export default Comment;
