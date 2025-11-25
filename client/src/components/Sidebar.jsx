import { UserButton, useClerk } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { assets, dummyUserData } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut, Moon, Sun } from "lucide-react";
import { dark } from "@clerk/themes";
import { useMediaQuery } from "../hooks/useMediaQuery";

const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const user = dummyUserData;
  const { signOut } = useClerk();
  const mediaQuery1279 = useMediaQuery(1279);

  return (
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
      ${mediaQuery1279 ? "w-60" : "w-15"}
      `}
    >
      <div
        className={`${
          mediaQuery1279
            ? "w-full"
            : "py-4 flex flex-col justify-center items-center"
        }`}
      >
        {mediaQuery1279 ? (
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
        <MenuItems mediaQuery1279={mediaQuery1279} />
        <Link
          to={"/create-post"}
          className={`flex items-center justify-center gap-2 mt-6 mx-6 bg-linear-to-r  active:scale-95 transition cursor-pointer text-white ${
            theme === "dark"
              ? "from-blue-500 to-blue-900 hover:from-blue-400 hover:to-blue-800"
              : "from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600"
          } 
          ${mediaQuery1279 ? "py-2.5 rounded-lg" : "rounded-full p-1"}
          `}
        >
          {mediaQuery1279 ? (
            <>
              <CirclePlus className="w-5 h-5" />
              Create Post
            </>
          ) : (
            <CirclePlus className="w-7 h-7" />
          )}
        </Link>
      </div>
      <div
        className={`border-t w-full flex
        ${theme === "dark" ? "border-gray-700" : "border-gray-200"} 
        ${
          mediaQuery1279
            ? "p-4 px-7 items-center justify-between"
            : "justify-center py-3"
        }`}
      >
        {mediaQuery1279 ? (
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
              {/* hover:fill-[#C5C5C6] hover:text-[#C5C5C6] */}
              <div>
                <h1 className="text-sm font-medium">{user.full_name}</h1>
                <p className="text-xs text-gray-500">@{user.username}</p>
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
                  userButtonPopoverActionButton__signOut: { display: "none" },
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
