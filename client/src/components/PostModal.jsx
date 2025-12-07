import { useTheme } from "next-themes";
import PostCard from "./PostCard";
import { useMediaQuery } from "../hooks/useMediaQuery";
import moment from "moment";
import { SendHorizonal, X } from "lucide-react";
import Comment from "./Comment";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const PostModal = ({ post, setShowModal }) => {
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [comment, setComment] = useState('');
  const { theme } = useTheme();
  const mediaQuery330 = useMediaQuery(330);
  const mediaQuery640 = useMediaQuery(640);
  const mediaQuery1750 = useMediaQuery(1750);
  const { getToken } = useAuth();

  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    `<span class="${
      theme === "dark" ? "text-blue-500" : "text-blue-600"
    }">$1</span>`
  );

  const handleSendComment = async (comment, postId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${API_URL}/api/comments/create`,
        { content: comment.trim(), postId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setComment("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingComment(false);
    }
  };

  return (
    <div
      onClick={() => setShowModal(false)}
      className={`fixed flex-col inset-0 z-110 min-h-screen bg-black/80 backdrop-blur flex items-center justify-center px-6 sm:px-30 md:px-48 lg:px-70 xl:px-100 2xl:px-130 ${
        mediaQuery1750 && "px-160!"
      }`}
    >
      <div className="max-h-[70vh] relative overflow-y-scroll no-scrollbar rounded-lg">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
          className="absolute top-3 right-3 text-3xl font-bold focus:outline-none z-50"
        >
          <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
        </button>
        {mediaQuery640 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`rounded-lg rounded-b-none ${
              theme === "dark"
                ? "bg-neutral-900 shadow-md shadow-neutral-800"
                : "bg-white"
            }`}
          >
            <PostCard withShadow={false} post={post} noReRender={true} />
          </div>
        )}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`p-3 sm:pt-0 flex flex-col gap-2 ${
            theme === "dark"
              ? "bg-neutral-900 shadow-md shadow-neutral-800"
              : "bg-white"
          }`}
        >
          {!mediaQuery640 && post.content && (
            <div
              className={`border-b-2 pb-2 flex flex-col gap-1 ${
                theme === "dark"
                  ? "border-b-neutral-700"
                  : "border-b-neutral-400"
              }`}
            >
              <div className="flex gap-2 items-center">
                <img
                  src={post.user.profile_picture}
                  className="w-10 rounded-full cursor-pointer"
                />
                <div
                  className={`flex ${
                    !mediaQuery330 ? "flex-col" : "items-center gap-2"
                  }`}
                >
                  <p className="font-semibold cursor-pointer">
                    {post.user.username}
                  </p>
                  <p className="text-xs">{moment(post.createdAt).fromNow()}</p>
                </div>
              </div>
              <div
                className={`${
                  theme === "dark" ? "text-neutral-200" : "text-gray-800"
                } text-sm whitespace-pre-line`}
                dangerouslySetInnerHTML={{ __html: postWithHashtags }}
              />
            </div>
          )}
          <div
            className={`flex items-center justify-between gap-4 p-2 rounded-lg ${
              theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
            }`}
          >
            <input
              id="input-post-comment"
              type="text"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className={`rounded-full border outline-none w-full px-4 py-1 ${
                theme === "dark" ? "border-neutral-600" : "border-neutral-400"
              }`}
              placeholder="Send a comment"
            />
            <button
              disabled={!comment.trim() || isLoadingComment}
              onClick={() => handleSendComment(comment, post._id)}
              className={`disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-full p-2 ${
                theme === "dark"
                  ? "bg-neutral-700 cursor-pointer hover:bg-neutral-600/85"
                  : "bg-neutral-200 cursor-pointer hover:bg-neutral-300/80"
              }`}
            >
              <SendHorizonal
                className={`${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              />
            </button>
          </div>
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <Comment comment={comment} post={post} key={comment._id} />
            ))
          ) : (
            <div className="text-neutral-500">There are no comments yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
