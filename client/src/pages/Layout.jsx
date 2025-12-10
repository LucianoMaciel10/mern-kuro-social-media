import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import { useTheme } from "next-themes";
import Navbar from "../components/Navbar";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useSelector } from "react-redux";

const Layout = () => {
  const { theme } = useTheme();
  const user = useSelector((state) => state.user.value);
  const mediaQuery640 = useMediaQuery(640);

  return user ? (
    <div className="w-full flex h-screen">
      {mediaQuery640 && <Sidebar />}

      <div
        className={`flex-1 overflow-y-auto
          ${theme === "dark" ? "bg-neutral-950" : "bg-neutral-100"}`}
        style={{
          maxHeight: "100vh",
        }}
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
