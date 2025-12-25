import { useTheme } from "next-themes";
import { useMediaQuery } from "../hooks/useMediaQuery";
import moment from "moment";
import {
  BadgeCheck,
  MessageCircle,
  SendHorizonal,
  Share2,
  X,
} from "lucide-react";
import Comment from "./Comment";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import HeartComponent from "./HeartComponent";
import toast from "react-hot-toast";

const PostModal = ({
  post,
  setShowModal,
  handleCommentUpdate,
  handleLike,
  user,
}) => {
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const scrollContainerRef = useRef(null);
  const { theme } = useTheme();
  const mediaQuery330 = useMediaQuery(330);
  const mediaQuery640 = useMediaQuery(640);
  const mediaQuery1750 = useMediaQuery(1750);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    `<span class="${
      theme === "dark" ? "text-blue-500" : "text-blue-600"
    }">$1</span>`
  );

  const getMaskGradient = () => {
    if (!showBottomFade && !showTopFade) return "none";
    
    if (showBottomFade && showTopFade) {
      return "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)";
    }
    if (showTopFade) {
      return "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)";
    }
    return "linear-gradient(to bottom, black 0%, black 95%, transparent 100%)";
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollContainerRef.current;
      const hasScroll = scrollHeight > clientHeight;
      const isAtBottom = scrollTop >= scrollHeight - clientHeight - 10;
      const isAtTop = scrollTop <= 5;
      
      setShowBottomFade(hasScroll && !isAtBottom);
      setShowTopFade(hasScroll && !isAtTop);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Ejecutar checkScroll inmediatamente
    checkScroll();

    // Ejecutar de nuevo después de un pequeño delay para asegurar que el DOM se actualizó
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);

    // Detectar cambios en el DOM del contenedor
    const observer = new MutationObserver(() => {
      checkScroll();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [comments]);

  const handleSendComment = async (commentText, postId) => {
    try {
      if (!commentText || !commentText.trim()) {
        console.error("Comment cannot be empty");
        return;
      }

      setIsLoadingComment(true);
      const token = await getToken();

      const { data } = await api.post(
        "/api/comments/create",
        {
          content: commentText.trim(),
          postId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setComments([...comments, data.data._id]);
        setComment("");
        handleCommentUpdate?.({
          ...post,
          comments: [...post.comments, data.data._id],
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
      <div
        ref={scrollContainerRef}
        style={{
          maskImage: getMaskGradient(),
          WebkitMaskImage: getMaskGradient(),
        }}
        className={`max-h-[70vh] min-w-full relative overflow-y-scroll no-scrollbar rounded-lg`}
      >
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
            <div
              className={`rounded-xl p-4 space-y-4 w-full 
                ${
                  theme === "dark"
                    ? "bg-neutral-900 shadow-neutral-800"
                    : "bg-white"
                }
              `}
            >
              <div className="inline-flex items-center gap-3">
                <img
                  onClick={() => navigate(`/profile/${post.user._id}`)}
                  src={post.user.profile_picture}
                  className="w-10 h-10 rounded-full shadow cursor-pointer"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span
                      onClick={() => navigate(`/profile/${post.user._id}`)}
                      className="cursor-pointer"
                    >
                      {post.user.full_name}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-gray-500 text-sm">
                    @{post.user.username} • {moment(post.createdAt).fromNow()}
                  </div>
                </div>
              </div>
              {post.content && (
                <div
                  className={`${
                    theme === "dark" ? "text-neutral-200" : "text-gray-800"
                  } text-sm whitespace-pre-line`}
                  dangerouslySetInnerHTML={{ __html: postWithHashtags }}
                />
              )}
              <div className="grid grid-cols-2 gap-2">
                {post.image_urls.map((image, index) => (
                  <img
                    src={image}
                    key={index}
                    className={`w-full h-48 object-cover rounded-lg ${
                      post.image_urls.length === 1 && "col-span-2 h-auto"
                    }`}
                  />
                ))}
              </div>
              <div
                className={`flex items-center gap-4 text-sm pt-2 border-t ${
                  theme === "dark"
                    ? "border-neutral-600 text-neutral-400"
                    : "border-neutral-300 text-neutral-600"
                }`}
              >
                <div className="flex items-center gap-1">
                  <HeartComponent
                    userId={user?._id}
                    likes={post.likes || []}
                    handleLike={handleLike}
                  />
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle
                    onClick={() =>
                      document.getElementById("input-post-comment").focus()
                    }
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span>{post.comments.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-5 h-5 cursor-pointer" />
                  <span>{0}</span>
                </div>
              </div>
            </div>
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
              theme === "dark" ? "bg-neutral-800" : "bg-neutral-200/80"
            }`}
          >
            <input
              id="input-post-comment"
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter" && comment.trim() && !isLoadingComment) {
                  handleSendComment(comment, post._id);
                }
              }}
              disabled={isLoadingComment}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className={`rounded-full border-2 outline-none w-full px-4 py-1 ${
                theme === "dark" ? "border-neutral-600 focus:border-neutral-400/80" : "border-neutral-400 focus:border-neutral-600"
              }`}
              placeholder="Send a comment"
            />
            <button
              disabled={!comment.trim() || isLoadingComment}
              onClick={() => handleSendComment(comment, post._id)}
              className={`disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-full p-2 ${
                theme === "dark"
                  ? "bg-neutral-600 cursor-pointer hover:bg-neutral-500/80 disabled:hover:bg-neutral-600"
                  : "bg-neutral-300 cursor-pointer hover:bg-neutral-400/50 disabled:hover:bg-neutral-300"
              }`}
            >
              <SendHorizonal
                className={`${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              />
            </button>
          </div>
          {comments.length > 0 ? (
            comments.map((commentId) => (
              <Comment commentId={commentId} post={post} key={commentId} />
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