import { useTheme } from "next-themes";
import MenuItems from "./MenuItems";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`fixed left-1/2 border-2 backdrop-blur-md flex items-center -translate-x-1/2 rounded-full bottom-5 w-[90vw] h-15 ${
        theme === "dark"
          ? "bg-neutral-500/30 border-neutral-300"
          : "bg-neutral-200/30 border-neutral-700"
      }`}
    >
      <MenuItems
        flex={"flex-row w-full justify-evenly items-center"}
        selectItemDark={"backdrop-blur-md bg-blue-700/40 text-blue-500 px-[3.5vw] py-[1.5vh]"}
        selectItemLight={"backdrop-blur-md bg-blue-700/40 text-blue-500 px-[3.5vw] py-[1.5vh]"}
        unselectItemsDark={"text-neutral-300"}
        unselectItemsLight={"text-neutral-700"}
      />
    </div>
  );
};

export default Navbar;
