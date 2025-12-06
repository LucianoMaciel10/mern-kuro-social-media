import moment from "moment";
import { useTheme } from "next-themes";
import HeartComponent from "./HeartComponent";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Comment = ({ comment, post }) => {
  const [currentUser, setCurrentUser] = useState({});
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${API_URL}/api/user/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [getToken]);

  return (
    <div
      className={`flex flex-col gap-1 rounded-lg p-2 ${
        theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
      }`}
    >
      <div className="flex gap-2 items-center">
        <img
          onClick={() => navigate(`/profile/${comment.user._id}`)}
          src={comment.user.profile_picture}
          className="w-10 rounded-full cursor-pointer"
        />
        <p
          onClick={() => navigate(`/profile/${comment.user._id}`)}
          className="font-semibold cursor-pointer"
        >
          {comment.user.username}
        </p>
        <p
          className={`text-xs ${
            theme === "dark" ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          {moment(comment.createdAt).fromNow()}
        </p>
      </div>
      <p className="font-light">{comment.message}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium cursor-pointer">Reply</span>
          <HeartComponent
            currentUser={comment.user}
            likes={post.users_who_liked}
          />
        </div>
        {currentUser._id === comment.user._id && (
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
