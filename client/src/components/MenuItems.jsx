/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets";
import { useTheme } from "next-themes";

const MenuItems = ({ mediaQuery1279 }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`${
        mediaQuery1279
          ? "px-6 text-gray-600 space-y-1 font-medium"
          : "flex flex-col gap-3"
      }`}
    >
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `px-3.5 py-3 flex items-center rounded-xl 
            ${mediaQuery1279 && "gap-3"}
            ${
              isActive && theme === "dark"
                ? "bg-gray-800 text-blue-500"
                : isActive && theme !== "dark"
                ? "bg-gray-200 text-blue-700"
                : !isActive && theme === "dark"
                ? "hover:bg-gray-800 text-gray-500"
                : !isActive && theme !== "dark" && "hover:bg-gray-200"
            }`
          }
        >
          <Icon className={`${mediaQuery1279 ? "w-5 h-5" : "w-6 h-6"}`} />
          {mediaQuery1279 && label}
        </NavLink>
      ))}
    </div>
  );
};

export default MenuItems;
