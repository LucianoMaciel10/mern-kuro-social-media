import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Layout from "./pages/Layout";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import { useTheme } from "next-themes";

function App() {
  const { theme } = useTheme();
  const { user } = useUser();
  const { getToken } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token));
      }
    };
    fetchData();
  }, [user, getToken, dispatch]);

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: theme === "dark" ? "#171717" : "#ffffff",
            color: theme === "dark" ? "#f5f5f5" : "#000000",
            borderRadius: "8px",
            boxShadow:
              theme === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
          success: {
            style: {
              background: theme === "dark" ? "#10b981" : "#d1fae5",
              color: theme === "dark" ? "#ffffff" : "#047857",
            },
          },
          error: {
            style: {
              background: theme === "dark" ? "#ef4444" : "#fee2e2",
              color: theme === "dark" ? "#ffffff" : "#dc2626",
            },
          },
          loading: {
            style: {
              background: theme === "dark" ? "#3b82f6" : "#dbeafe",
              color: theme === "dark" ? "#ffffff" : "#1e40af",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
