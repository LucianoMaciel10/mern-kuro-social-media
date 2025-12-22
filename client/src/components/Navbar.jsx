import { useTheme } from "next-themes";
import MenuItems from "./MenuItems";
import { useMediaQuery } from "../hooks/useMediaQuery";

const Navbar = () => {
  const { theme } = useTheme();
  const mediaQuery375 = useMediaQuery(375)

  return (
    <div
      className={`fixed px-3 left-1/2 border-2 backdrop-blur-md flex items-center -translate-x-1/2 rounded-full bottom-5 w-[90vw] h-15 ${
        theme === "dark"
          ? "bg-neutral-500/30 border-neutral-300"
          : "bg-neutral-200/30 border-neutral-700"
      }`}
    >
      <MenuItems
        flex={"flex-row w-full justify-evenly items-center"}
        selectItemDark={"backdrop-blur-md bg-blue-700/40 text-blue-500 p-2"}
        selectItemLight={"backdrop-blur-md bg-blue-400/50 text-blue-600 p-2"}
        unselectItemsDark={`text-neutral-300 ${mediaQuery375 && 'px-2'}`}
        unselectItemsLight={`text-neutral-700 ${mediaQuery375 && 'px-2'}`}
      />
    </div>
  );
};

export default Navbar;
