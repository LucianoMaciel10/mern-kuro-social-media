import { useTheme } from "next-themes";
import { dummyUserData } from "../assets/assets";
import { useState } from "react";
import { Pencil, X } from "lucide-react";

const ProfileModal = ({ setShowEdit }) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const { theme } = useTheme();
  const user = dummyUserData;
  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
  };

  return (
    <div
      onClick={() => setShowEdit(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-110 h-screen backdrop-blur bg-black/80"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl mx-auto h-full p-10"
      >
        <div
          className={`${
            theme === "dark"
              ? "bg-neutral-900 shadow-neutral-800 shadow-md"
              : "bg-white shadow"
          } relative rounded-lg shadow p-6 h-[90vh] overflow-y-scroll no-scrollbar text-center`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEdit(false);
            }}
            className="absolute top-3 right-3 text-3xl font-bold focus:outline-none z-50"
          >
            <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
          </button>
          <h1
            className={`text-2xl font-bold mb-4 border-b pb-2 ${
              theme === "dark"
                ? "border-b-neutral-700/70"
                : "border-b-neutral-200"
            }`}
          >
            Edit Profile
          </h1>
          <form className="space-y-4" onSubmit={handleSaveProfile}>
            <div className="flex flex-col gap-1">
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                Profile Picture
              </p>
              <label
                className="cursor-pointer flex justify-center"
                style={{ pointerEvents: "none" }}
              >
                <input
                  hidden
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      profile_picture: e.target.files[0],
                    })
                  }
                  type="file"
                  accept="image/*"
                />
                <div className="group/profile relative overflow-hidden rounded-full w-40 h-40 sm:w-50 sm:h-50 max-w-[40vw] max-h-[40vw] pointer-events-auto">
                  <img
                    src={
                      editForm.profile_picture
                        ? URL.createObjectURL(editForm.profile_picture)
                        : user.profile_picture
                    }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 hidden group-hover/profile:flex bg-black/20 items-center justify-center rounded-full">
                    <div className="bg-neutral-200/30 p-3 rounded-full">
                      <Pencil className="size-8 text-white" />
                    </div>
                  </div>
                </div>
              </label>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                Cover Photo
              </p>
              <label
                className="cursor-pointer sm:px-4"
                style={{ pointerEvents: "none" }}
              >
                <input
                  hidden
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      cover_photo: e.target.files[0],
                    })
                  }
                  type="file"
                  accept="image/*"
                />
                <div
                  className="group/profile relative rounded-lg overflow-hidden w-full max-w-[600px] aspect-1.5/1 sm:aspect-2/1"
                  style={{ pointerEvents: "auto" }}
                >
                  <img
                    src={
                      editForm.cover_photo
                        ? URL.createObjectURL(editForm.cover_photo)
                        : user.cover_photo
                    }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 hidden group-hover/profile:flex bg-black/20 items-center justify-center">
                    <div className="bg-neutral-200/30 p-3 rounded-full">
                      <Pencil className="size-8 text-white" />
                    </div>
                  </div>
                </div>
              </label>
            </div>
            <div className="flex flex-col items-center gap-1 w-full">
              <label
                htmlFor="fullname"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                Name
              </label>
              <input
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
                value={editForm.full_name}
                id="fullname"
                type="text"
                className={`w-full sm:w-[80%] p-3 border rounded-lg text-center ${
                  theme === "dark"
                    ? "border-neutral-600 placeholder:text-neutral-600"
                    : "border-neutral-200"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            <div className="flex flex-col items-center gap-1 w-full">
              <label
                htmlFor="username"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                Username
              </label>
              <input
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
                value={editForm.username}
                id="username"
                type="text"
                className={`w-full sm:w-[80%] p-3 border rounded-lg text-center ${
                  theme === "dark"
                    ? "border-neutral-600 placeholder:text-neutral-600"
                    : "border-neutral-200"
                }`}
                placeholder="Enter a username"
              />
            </div>
            <div className="flex flex-col items-center gap-1 w-full">
              <label
                htmlFor="location"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                Location
              </label>
              <input
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                value={editForm.location}
                type="text"
                id="location"
                className={`w-full sm:w-[80%] p-3 border rounded-lg text-center resize-none no-scrollbar ${
                  theme === "dark"
                    ? "border-neutral-600 placeholder:text-neutral-600"
                    : "border-neutral-200"
                }`}
                placeholder="Enter your location"
              />
            </div>
            <div className="flex flex-col items-center gap-1 w-full">
              <label
                htmlFor="bio"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                Biography
              </label>
              <textarea
                rows={3}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                value={editForm.bio}
                id="bio"
                className={`w-full sm:w-[90%] p-3 border rounded-lg text-center resize-none no-scrollbar ${
                  theme === "dark"
                    ? "border-neutral-600 placeholder:text-neutral-600"
                    : "border-neutral-200"
                }`}
                placeholder="Enter a short biography about you"
              />
            </div>
            <div className="flex flex-col gap-3 w-full items-center">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="toggle-privacy"
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                  }`}
                >
                  Privacy Setting
                </label>
                <select
                  id="toggle-privacy"
                  value={isPrivate ? "private" : "public"}
                  onChange={(e) => setIsPrivate(e.target.value === "private")}
                  className={`px-4 py-2 border rounded-lg cursor-pointer ${
                    theme === "dark"
                      ? "border-neutral-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option
                    className={`${theme === "dark" && "bg-neutral-800"}`}
                    value="public"
                  >
                    🌍 Public
                  </option>
                  <option
                    className={`${theme === "dark" && "bg-neutral-800"}`}
                    value="private"
                  >
                    🔒 Private
                  </option>
                </select>
              </div>

              <p
                className={`text-sm p-3 rounded-lg border w-[90%] ${
                  theme === "dark"
                    ? "border-blue-600 text-neutral-200 bg-blue-500/70"
                    : "border-blue-200 text-gray-600 bg-blue-50"
                }`}
              >
                {isPrivate ? (
                  <>
                    <strong>Private Account:</strong> Follow requests will
                    require your approval
                  </>
                ) : (
                  <>
                    <strong>Public Account:</strong> Anyone can follow you
                    without approval
                  </>
                )}
              </p>
            </div>
            <div className="flex justify-evenly pt-2">
              <button
                onClick={() => setShowEdit(false)}
                type="button"
                className={`p-2 sm:px-3 cursor-pointer border rounded-lg transition-colors ${
                  theme === "dark"
                    ? "border-neutral-600 text-neutral-300 hover:bg-neutral-700/50"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`p-2 sm:px-3 cursor-pointer text-white bg-linear-to-r rounded-lg transition-colors ${
                  theme === "dark"
                    ? "from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600"
                    : "from-sky-300 to-sky-500 hover:from-sky-400 hover:to-sky-600"
                }`}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
