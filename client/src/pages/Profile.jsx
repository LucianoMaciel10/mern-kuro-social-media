/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "next-themes";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import { useMediaQuery } from "../hooks/useMediaQuery";
import ProfileModal from "../components/ProfileModal";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const mediaQuery1536 = useMediaQuery(1536);
  const mediaQuery768 = useMediaQuery(768);

  const fetchUser = async (profileId) => {
    const token = await getToken();
    try {
      const { data } = await api.post(
        "/api/user/profiles",
        { profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setUser(data.profile);
        setPosts(data.post);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchUser(profileId);
    } else {
      fetchUser(currentUser._id);
    }
  }, [profileId, currentUser]);

  return user ? (
    <div
      className={`h-full overflow-y-scroll no-scrollbar relative flex justify-center pt-6`}
    >
      <div className="w-screen sm:w-lg md:w-2xl lg:w-3xl 2xl:w-5xl px-6">
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
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <UserProfileInfo
            posts={posts}
            user={user}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        <div className="mt-6">
          <div
            className={`rounded-xl shadow p-1 flex max-w-md mx-auto ${
              theme === "dark"
                ? "bg-neutral-900 shadow-md shadow-neutral-800"
                : "bg-white"
            }`}
          >
            {["posts", "media", "likes"].map((tab) => (
              <button
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? theme === "dark"
                      ? "bg-blue-600"
                      : "bg-sky-400"
                    : theme === "dark"
                    ? "text-neutral-500 hover:text-neutral-400"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
                key={tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {(activeTab === "posts" && posts.length > 0) && (
            <div className="flex flex-col items-center gap-6 mt-6 pb-27 sm:pb-6">
              {posts.map((post) => (
                <PostCard post={post} key={post._id} />
              ))}
            </div>
          )}

          {(activeTab === "media" && posts.length > 0) && (
            <div className="pb-27 sm:pb-6 flex justify-center">
              <div
                className={`w-fit grid gap-6 justify-items-center p-6 mt-6 rounded-lg shadow ${
                  mediaQuery1536
                    ? "grid-cols-3"
                    : !mediaQuery768
                    ? "grid-cols-1"
                    : "grid-cols-2"
                }
                ${
                  theme === "dark"
                    ? "bg-neutral-900 shadow-neutral-800"
                    : "bg-white"
                }
              `}
              >
                {posts
                  .filter((post) => post.image_urls.length > 0)
                  .map((post) => (
                    <>
                      {post.image_urls.map((image, index) => (
                        <Link
                          to={image}
                          target="_blank"
                          key={index}
                          className={`w-64 relative group rounded-lg cursor-pointer overflow-hidden shadow-md hover:shadow-lg ${
                            theme === "dark" && "shadow-neutral-800"
                          }`}
                        >
                          <img
                            src={image}
                            key={index}
                            className=" aspect-video object-cover"
                          />
                          <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                            Posted {moment(post.createdAt).fromNow()}
                          </p>
                        </Link>
                      ))}
                    </>
                  ))}
              </div>
            </div>
          )}
          {/* {activeTab === "likes" && (
            Buscar entre todos los posts, los que tengan los ID que aparecen en la propiedad user.posts_liked y mostrarlos
          )} */}
        </div>
      </div>
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
