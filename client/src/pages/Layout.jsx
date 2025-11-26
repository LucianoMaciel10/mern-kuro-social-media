import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import { useTheme } from "next-themes";
import Navbar from "../components/Navbar";
import { useMediaQuery } from "../hooks/useMediaQuery";

const Layout = () => {
  const { theme } = useTheme();
  const user = dummyUserData;
  const mediaQuery640 = useMediaQuery(640);

  return user ? (
    <div className="w-full flex h-screen">
      {mediaQuery640 && <Sidebar />}

      <div
        className={`flex-1 ${
          theme === "dark" ? "bg-neutral-950" : "bg-neutral-100"
        }`}
      >
        <Outlet />
      </div>

      {!mediaQuery640 && <Navbar />}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
