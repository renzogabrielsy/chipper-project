import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
    icon: IconType;
    label: string;
    active?: boolean;
    href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    active,
    href
}) => {
    return (
       <Link 
       href={href}
       className={twMerge(
        `
        rounded-lg
        flex
        flex-row
        h-auto
        items-center
        w-full
        gap-x-4
        text-sm
        font-bold
        text-orange-400 bg-orange-200 bg-opacity-30
        transition
        py-2
        px-2
        `
       )}>
       <Icon size={26} />
       <p className="truncate w-full">{label}</p>
       </Link> // used a Link component in case I wanted to add more pages to the app
    );
}

export default SidebarItem;