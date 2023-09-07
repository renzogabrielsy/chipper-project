import { HiOutlineDesktopComputer } from "react-icons/hi";
import { TbBrandNextjs, TbBrandTailwind } from "react-icons/tb";
import { SiTailwindcss, SiSupabase, SiAxios, SiSpotify } from "react-icons/si";
import Button from "@/components/2 Parts/Button";
import React from "react";

type Props = {};

export const TechUsed = (props: Props) => {
  const techItems = [
    {
      Icon: TbBrandNextjs,
      label: "Next.JS",
      size: "text-3xl",
      link: "https://nextjs.org/",
    },
    {
      Icon: SiTailwindcss,
      label: "Tailwind",
      size: "text-xl",
      link: "https://tailwindcss.com/",
    },
    {
      Icon: TbBrandTailwind,
      label: "TwMerge",
      size: "text-2xl",
      link: "https://www.npmjs.com/package/tailwind-merge",
    },
    {
      Icon: SiAxios,
      label: "Axios",
      size: "text-2xl",
      link: "https://axios-http.com/",
    },
    {
      Icon: SiSupabase,
      label: "SupaBase",
      size: "text-xl",
      link: "https://supabase.io/",
    },
    {
      Icon: SiSpotify,
      label: "Spotify API",
      size: "text-xl",
      link: "https://developer.spotify.com/documentation/web-api/",
    },
  ];

  return (
    <>
      <div className="flex flex-row justify-between items-center px-3 py-3 mx-2">
        <div className="inline-flex items-center gap-x-2">
          <HiOutlineDesktopComputer className="text-white" size={26} />
          <p className="text-white font-medium text-md">Technologies Used</p>
        </div>
      </div>

      <div className="flex flex-row justify-between items-start gap-x-2 gap-y-2 pl-7 pr-10 py-1 mx-1 text-xs flex-wrap">
        {techItems.map((tech, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center w-16 gap-y-1"
          >
            <Button
              onClick={() => window.open(tech.link, "_blank")}
              className="flex justify-center items-center h-9 w-9 rounded-md p-0 bg-black-0"
            >
              <tech.Icon className={`text-white ${tech.size}`} />
            </Button>
            <p>{tech.label}</p>
          </div>
        ))}
      </div>
    </>
  );
};
