import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import { useTheme } from "next-themes";

const Layout = () => {
  const { theme } = useTheme();
  const user = dummyUserData;

  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar />

      <div
        className={`flex-1 ${
          theme === "dark" ? "bg-neutral-950" : "bg-neutral-100"
        }`}
      >
        <Outlet />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
