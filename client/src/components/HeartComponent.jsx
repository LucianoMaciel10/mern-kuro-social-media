import { Heart } from "lucide-react";
import { useState } from "react";

const HeartComponent = ({likes, currentUser}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
  };

  return (
    <Heart
      onClick={handleLike}
      className={`w-4 h-4 active:scale-90 transition cursor-pointer ${
        likes.includes(currentUser?._id) && "text-red-500 fill-red-500"
      }`}
    />
  );
};

export default HeartComponent;
