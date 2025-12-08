import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Heart } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const HeartComponent = ({ likes, userId, setLikes, postId }) => {
  const { getToken } = useAuth();

  const handleLike = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.post(`${API_URL}/api/posts/like`, postId, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        if (likes.includes(userId)) {
          setLikes(likes.filter((id) => id !== userId));
        } else {
          setLikes([...likes, userId]);
        }
      }
    } catch (error) {
      console.error("Error fetching comment:", error);
    }
  };

  return (
    <Heart
      onClick={handleLike}
      className={`w-4 h-4 active:scale-90 transition cursor-pointer ${
        likes.includes(userId) ? "text-red-500 fill-red-500" : ""
      }`}
    />
  );
};

export default HeartComponent;
