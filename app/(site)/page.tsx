"use client";

import Header from "@/components/1 Structures/Header/Header";
import { useState } from "react";
import { RenzoSongs } from "@/components/1 Structures/Main/Top Songs/RenzoSongs";
import MusicPlayer from "@/components/1 Structures/Music Player/MusicPlayer";
import { HiOutlineViewGridAdd, HiOutlineViewList } from "react-icons/hi";
import { RenzosCoolPlaylistV1 } from "@/components/1 Structures/Main/Playlists/RenzosCoolPlaylistV1";
import { useMusicContext } from "@/components/2 Parts/MusicProviderContext";
import { RenzosCoolPlaylistV2 } from "@/components/1 Structures/Main/Playlists/RenzosCoolPlaylistV2";
import { RenzosCoolPlaylistV3 } from "@/components/1 Structures/Main/Playlists/RenzosCoolPlaylistV3";
import { RenzosCoolPlaylistV4 } from "@/components/1 Structures/Main/Playlists/RenzosCoolPlaylistV4";
import { AlbumSinglesForPringles } from "@/components/1 Structures/Main/Albums/AlbumSinglesForPringles";
import { AlbumPerfectly } from "@/components/1 Structures/Main/Albums/AlbumPerfectly";
import { Discography } from "@/components/1 Structures/Sidebar/Discography";

type ComponentType =
  | "RenzoSongs"
  | "SinglesForPringles"
  | "PerfectlyEP"
  | "CoolPlaylistV1"
  | "CoolPlaylistV2"
  | "CoolPlaylistV3"
  | "CoolPlaylistV4";

type ViewType = "GRID" | "LIST";

const componentMapping: Record<ComponentType, React.ElementType> = {
  RenzoSongs,
  SinglesForPringles: AlbumSinglesForPringles,
  PerfectlyEP: AlbumPerfectly,
  CoolPlaylistV1: RenzosCoolPlaylistV1,
  CoolPlaylistV2: RenzosCoolPlaylistV2,
  CoolPlaylistV3: RenzosCoolPlaylistV3,
  CoolPlaylistV4: RenzosCoolPlaylistV4,
};

export default function Home() {
  const { currentComponent: rawCurrentComponent } =
    useMusicContext();
  const currentComponent = rawCurrentComponent as ComponentType;

  const [selectedSong, setSelectedSong] = useState<string>("");
  const [view, setView] = useState<ViewType>("LIST");

  const handleSongSelect = (uri: string) => {
    setSelectedSong(uri);
  };

  const componentTitles: Record<ComponentType, string> = {
    RenzoSongs: `Renzo's Top Songs`,
    SinglesForPringles: `Singles For Pringles`,
    PerfectlyEP: `Perfectly EP`,
    CoolPlaylistV1: `Renzo's Cool Playlist Vol. 1`,
    CoolPlaylistV2: `Renzo's Cool Playlist Vol. 2`,
    CoolPlaylistV3: `Renzo's Cool Playlist Vol. 3`,
    CoolPlaylistV4: `Renzo's Cool Playlist Vol. 4`,
  };

  const ComponentToRender = componentMapping[currentComponent];

  return (
    <div
      className="
    bg-black
      bg-opacity-80
      rounded-lg
      h-full
      w-[100%]
      overflow-hidden
      overflow-y-auto
      flex
      flex-col
      justify-between
      relative
    "
    >
      <div className="flex flex-row justify-between mt-4">
        <div className="mb-2">
          <h1
            className="
          text-white
          text-2xl
          font-semibold
          ml-5
          "
          >
            {`Renzo's Cool Music`}
          </h1>
          <p
            className="
          text-white
          text-sm
          font-normal
          ml-5
          "
          >
            {`A collection of cool songs (by Renzo) hosted on his own custom web-app using the Spotify API`}
          </p>
        </div>
        <div className="min-w-[220px]">
          <Header />
        </div>
      </div>

      <div
        className="
      my-6
      px-6
      min-h-[40vh]
      max-h-[60vh]
      flex
      flex-col
      "
      >
        <div
          className="
        flex
        justify-between
        items-center
        mb-7
        "
        >
          <h1
            className="
           text-white
          text-2xl
          font-semibold
          md:block
          hidden
          "
          >
            {componentTitles[currentComponent] || `Renzo's Top Songs`}
          </h1>
          <div className="md:hidden">
            <Discography />
          </div>
          <div className="flex flex-row text-2xl">
            <button onClick={() => setView("GRID")}>
              <HiOutlineViewGridAdd className="mx-2 rounded-md hover:bg-white hover:bg-opacity-30 hover:cursor-pointer" />
            </button>
            <button onClick={() => setView("LIST")}>
              <HiOutlineViewList className="ml-2 rounded-md hover:bg-white hover:bg-opacity-30 hover:cursor-pointer" />
            </button>
          </div>
        </div>
        {view === "LIST" && (
          <div className="flex flex-row justify-between mr-[1.1rem] mb-3">
            <span className="text-white text-sm mb-1 w-[60px]"></span>
            <span className="text-white font-bold text-sm mb-1 w-[20%]">
              Track
            </span>
            <span className="text-white font-bold text-sm mb-1 w-[20%]">
              Album
            </span>
            <span className="text-white font-bold text-sm mb-1 w-[20%] hidden md:block">
              Artist
            </span>
            <span className="text-white font-bold text-sm mb-1 w-[20%]">
              Duration
            </span>
          </div>
        )}
        <div className="flex-grow overflow-y-auto">
        {ComponentToRender && (
          <ComponentToRender onTrackSelected={handleSongSelect} view={view} />
        )}
        </div>
      </div>
      <div className="flex flex-col flex-end mt-auto min-h-[190px] ">
        <MusicPlayer trackURI={selectedSong} />
      </div>
    </div>
  );
}
