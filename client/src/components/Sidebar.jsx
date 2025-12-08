import { UserButton, useAuth, useClerk } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { LogOut, Moon, Sun } from "lucide-react";
import { dark } from "@clerk/themes";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Sidebar = () => {
  const {getToken} = useAuth()
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const { signOut } = useClerk();
  const mediaQuery1280 = useMediaQuery(1280);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        const { data } = await axios.get(`${API_URL}/api/user/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(data.user);
      } catch (error) {
        console.error("Error fetching comment:", error);
      }
    };

    fetchData();
  }, [getToken]);

  return currentUser && (
    <div
      className={`
      xl:w-72 border-r
      ${
        theme === "dark"
          ? "border-gray-700 bg-neutral-900"
          : "border-gray-200 bg-gray-50"
      } 
      flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 
      translate-x-0 max-sm:-translate-x-full
      transition-transform duration-300 ease-in-out
      ${mediaQuery1280 ? "w-60" : "w-15"}
      `}
    >
      <div
        className={`${
          mediaQuery1280
            ? "w-full"
            : "py-4 flex flex-col justify-center items-center"
        }`}
      >
        {mediaQuery1280 ? (
          <img
            onClick={() => navigate("/")}
            src={theme === "dark" ? assets.logoL : assets.logoD}
            className="w-26 ml-7 my-2 cursor-pointer"
          />
        ) : (
          <img
            onClick={() => navigate("/")}
            src={assets.kuroFavicon}
            className="w-8 my-2 cursor-pointer"
          />
        )}
        <hr
          className={`${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          } mb-8`}
        />
        <MenuItems
          flex={"flex-col"}
          selectItemDark={"bg-gray-800 text-blue-500 p-3"}
          selectItemLight={"bg-neutral-200 text-blue-500 p-3"}
          unselectItemsDark={"hover:bg-neutral-800 text-neutral-500 p-3"}
          unselectItemsLight={"hover:bg-neutral-200 text-neutral-500 p-3"}
        />
      </div>
      <div
        className={`border-t w-full flex
        ${theme === "dark" ? "border-gray-700" : "border-gray-200"} 
        ${
          mediaQuery1280
            ? "p-4 px-7 items-center justify-between"
            : "justify-center py-3"
        }`}
      >
        {mediaQuery1280 ? (
          <>
            <div className="flex gap-2 items-center">
              <UserButton
                appearance={{
                  theme: theme === "dark" ? dark : undefined,
                  elements: {
                    userButtonPopoverActionButton__signOut: { display: "none" },
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Change theme"
                    labelIcon={
                      theme === "dark" ? (
                        <Sun className="w-4 h-4 fill-[#ABABAC] text-[#ABABAC]" />
                      ) : (
                        <Moon
                          stroke="none"
                          fill="#616161"
                          className="w-4 h-4"
                        />
                      )
                    }
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  />
                </UserButton.MenuItems>
              </UserButton>
              <div>
                <h1 className="text-sm font-medium">{currentUser.full_name}</h1>
                <p className="text-xs text-gray-500">@{currentUser.username}</p>
              </div>
            </div>
            <LogOut
              className={`w-4.5 transition cursor-pointer ${
                theme === "dark"
                  ? "text-gray-500 hover:text-gray-400"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => signOut()}
            />
          </>
        ) : (
          <>
            <UserButton
              appearance={{
                theme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: {
                    width: "35px",
                    height: "35px",
                  },
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Change theme"
                  labelIcon={
                    theme === "dark" ? (
                      <Sun className="w-4 h-4 fill-[#ABABAC] text-[#ABABAC]" />
                    ) : (
                      <Moon stroke="none" fill="#616161" className="w-4 h-4" />
                    )
                  }
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              </UserButton.MenuItems>
            </UserButton>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
