import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import { useTheme } from "next-themes";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";

const Profile = () => {
  const { theme } = useTheme();
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    (() => {
      fetchUser();
    })();
  }, []);

  return user ? (
    <div className={`min-h-screen relative flex justify-center pt-6`}>
      <div className="w-screen sm:w-lg md:w-2xl lg:w-3xl 2xl:w-5xl p-6 mb-20">
        <div
          className={`rounded-2xl shadow overflow-hidden ${
            theme === "dark"
              ? "bg-neutral-900 border-neutral-700 shadow-md shadow-neutral-800"
              : "border-neutral-400/60 bg-neutral-50"
          }`}
        >
          <div
            className={`h-56 bg-linear-to-l ${
              theme === "dark" 
                ? "from-neutral-950/10 to-blue-900" 
                : "from-sky-300/60 to-sky-600"
            }`}
          >
            {user.cover_photo && <img src={user.cover_photo} className="w-full h-full object-cover" />}
          </div>
          <UserProfileInfo posts={posts} user={user} profileId={profileId} setShowEdit={setShowEdit} />
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
