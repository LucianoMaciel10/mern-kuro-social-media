import { BadgeCheck, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostModal from "./PostModal";
import HeartComponent from "./HeartComponent";

const PostCard = ({
  post,
  withShadow,
  currentUser,
  handlePostUpdate,
  onLikeUpdate,
  noReRender = false,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [likes, setLikes] = useState(post.likes || []);
  const [showModal, setShowModal] = useState(false);

  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    `<span class="${
      theme === "dark" ? "text-blue-500" : "text-blue-600"
    }">$1</span>`
  );

  useEffect(() => {
    setLikes(post.likes || []);
  }, [post.likes]);

  const handleLikeChange = (newLikes) => {
    setLikes(newLikes);
    if (noReRender) {
      onLikeUpdate?.(newLikes);
    } else {
      onLikeUpdate?.(post._id, newLikes);
    }
  };

  const handleModalLikeChange = (newLikes) => {
    setLikes(newLikes);
    onLikeUpdate?.(post._id, newLikes);
  };

  return (
    <div
      className={`rounded-xl p-4 space-y-4 w-full ${
        theme === "dark"
          ? `bg-neutral-900 shadow-neutral-800 ${withShadow && "shadow-md"}`
          : "bg-white"
      }
      ${withShadow && "shadow"}
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
            userId={currentUser?._id}
            likes={likes || []}
            postId={post._id}
            setLikes={handleLikeChange}
          />
          <span>{likes?.length || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle
            onClick={() =>
              !noReRender
                ? setShowModal(true)
                : document.getElementById("input-post-comment").focus()
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
      {showModal && (
        <PostModal
          post={{ ...post, likes }}
          currentUser={currentUser}
          onCommentAdded={handlePostUpdate}
          onLikeUpdate={handleModalLikeChange} // ✅ Usar handler específico para modal
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default PostCard;
