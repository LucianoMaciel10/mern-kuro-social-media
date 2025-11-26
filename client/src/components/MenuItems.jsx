/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets";
import { useTheme } from "next-themes";
import { useMediaQuery } from "../hooks/useMediaQuery";

const MenuItems = ({ flex, selectItemDark, unselectItemsDark, selectItemLight, unselectItemsLight }) => {
  const mediaQuery1279 = useMediaQuery(1279);
  const { theme } = useTheme();

  return (
    <div
      className={`${
        mediaQuery1279
          ? "px-6 text-gray-600 space-y-2 font-medium"
          : `flex gap-3 ${flex}`
      }`}
    >
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex items-center rounded-xl transition-all
            ${mediaQuery1279 && "gap-3"}
            ${
              isActive && theme === "dark"
                ? `${selectItemDark}`
                : isActive && theme !== "dark"
                  ? `${selectItemLight}` // bg-gray-200 text-blue-700
                  : !isActive && theme === "dark"
                    ? `${unselectItemsDark}`
                    : !isActive && theme !== "dark" && `${unselectItemsLight}`
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
