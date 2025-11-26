import { useTheme } from "next-themes";
import MenuItems from "./MenuItems";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`fixed left-1/2 border backdrop-blur-md flex items-center -translate-x-1/2 rounded-full bottom-5 w-[90vw] h-15 ${
        theme === "dark"
          ? "bg-neutral-500/20 border-neutral-300"
          : "bg-neutral-200/20 border-neutral-800"
      }`}
    >
      <MenuItems
        flex={"flex-row w-full justify-around items-center"}
        selectItemDark={"backdrop-blur-md bg-blue-700/30 text-blue-600 px-3.5 py-3"}
        selectItemLight={"backdrop-blur-md bg-blue-700/30 text-blue-600 px-3.5 py-3"}
        unselectItemsLight={"text-neutral-400"}
        unselectItemsDark={"text-neutral-400"}
      />
    </div>
  );
};

export default Navbar;
