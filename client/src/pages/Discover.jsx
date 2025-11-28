import { useState } from "react";
import { dummyConnectionsData } from "../assets/assets";
import { useTheme } from "next-themes";
import { SearchIcon } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";

const Discover = () => {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);
  const mediaQuery1280 = useMediaQuery(768,1280);
  const mediaQuery708 = useMediaQuery(708)

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setUsers([]);
      setLoading(true);
      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div
      className={`min-h-screen bg-linear-to-b ${
        theme === "dark"
          ? "from-neutral-800 to-black"
          : "from-neutral-100 to-neutral-300"
      } ${mediaQuery1280 && "flex justify-center"}`}
    >
      <div className="max-w-6xl mx-auto p-6 pb-26">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 mt-3 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-900"
            }`}
          >
            Discover People
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Connect with amazing people and grow your network
          </p>
        </div>

        <div
          className={`mb-8 shadow-md rounded-md border md:w-165 ${
            theme === "dark"
              ? "bg-neutral-900 shadow-neutral-800 border-neutral-600"
              : "border-neutral-300 bg-white"
          }`}
        >
          <div className="p-6">
            <label className="relative cursor-text">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
              <input
                type="text"
                placeholder="Search people by name, username, bio or location..."
                className="pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm outline-none pr-3 truncate"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </label>
          </div>
        </div>

        <div className={`flex flex-wrap gap-6 ${!mediaQuery708 && 'justify-center'}`}>
          {users.map((user) => (
            <UserCard user={user} key={user._id} />
          ))}
        </div>

        {
          loading && <Loading height="60vh" />
        }
      </div>
    </div>
  );
};

export default Discover;
