import classNames from "clsx";
import { Menu } from "lucide-react";
import { GroupSelector } from "./EventSelector";

type Props = {
  onMenuButtonClick(): void;
};

const Navbar = (props: Props) => {
  return (
    <nav
      className={classNames({
        "bg-white text-zinc-500": true,
        "flex items-center": true,
        "w-screen md:w-full sticky z-10 px-8 shadow-sm h-[73px] top-0 ": true,
      })}
    >
      <p className="font-bold text-xs md:text-sm">Group Portal</p>
      <div className="flex-grow"></div>
      <GroupSelector />
      <button className="md:hidden ml-4" onClick={props.onMenuButtonClick}>
        <Menu className="h-6 w-6" />
      </button>
    </nav>
  );
};

export default Navbar;
