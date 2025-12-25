import { Heart } from "lucide-react";

const HeartComponent = ({ likes, userId, handleLike }) => {
  return (
    <Heart
      onClick={handleLike}
      className={`w-5 h-5 active:scale-90 transition cursor-pointer ${
        likes.includes(userId) ? "text-red-500 fill-red-500" : ""
      }`}
    />
  );
};

export default HeartComponent;