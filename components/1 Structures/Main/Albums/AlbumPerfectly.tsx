"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "@/lib/spotify";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";

interface Track {
  name: string;
  preview_url: string;
  coverArt: string;
  albumName: string;
  artistName: string;
  duration: number;
  popularity: number;
}

const getAlbumDetails = async (albumId: string, accessToken: string) => {
  const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    name: response.data.name,
    coverArt: response.data.images?.[0]?.url || '',
  };
};

const getAlbumTracks = async (
  albumId: string,
  accessToken: string
): Promise<Track[]> => {
  const response = await axios.get(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log(response.data);

  if (!response.data.items) {
    return [];
  }

  return response.data.items.map((item: any) => {
    return {
      name: item.name,
      preview_url: item.uri,
      coverArt: item.album?.images?.[0]?.url || "", // Using optional chaining to prevent errors
      albumName: item.album?.name || "",
      artistName: item.artists[0].name,
      duration: item.duration_ms,
      popularity: item.popularity,
    };
  });
};

interface SongsProps {
  onTrackSelected: (uri: string) => void;
  view: "GRID" | "LIST";
}

export const AlbumPerfectly: React.FC<SongsProps> = ({
  onTrackSelected,
  view,
}) => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracksAndAlbumInfo = async () => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        // Fetch album details and tracks in parallel using Promise.all
        const [albumDetails, trackList] = await Promise.all([
          getAlbumDetails("59rJRj1ad41biX71EQrBRC", accessToken),
          getAlbumTracks("59rJRj1ad41biX71EQrBRC", accessToken),
        ]);

        // Combine album details with each track
        const combinedTracks = trackList.map((track) => ({
          ...track,
          coverArt: albumDetails.coverArt,
          albumName: albumDetails.name,
        }));

        setTracks(combinedTracks);
      }
    };

    fetchTracksAndAlbumInfo();
  }, []);

  return (
    <div className="justify-center max-h-full overflow-y-auto">
      <div className="flex flex-wrap justify-center xl:justify-start min-width-[100%]">
        {tracks.map((track, index) =>
          view === "GRID" ? (
            <div
              key={index}
              className="flex flex-row items-center justify-between bg-opacity-30 bg-black p-4 rounded-md m-2 w-[250px]"
            >
              <div className="flex items-center">
                <div className=" flex justify-center">
                  {track.coverArt && (
                    <Image
                      src={track.coverArt}
                      alt="Cover Art"
                      className="rounded-md"
                      width={60}
                      height={60}
                    />
                  )}
                </div>
                <span className="ml-4 text-white text-sm">{track.name}</span>
              </div>
              <button
                className="bg-green-500 p-2 rounded-full"
                onClick={() => onTrackSelected(track.preview_url)}
              >
                <FaPlay className="text-white" />
              </button>
            </div>
          ) : (
              <div
                key={index}
                className="flex flex-row items-center justify-between w-full"
              >
                <div
                  className="relative group rounded-md mb-2"
                  style={{ width: 60, height: 60 }}
                >
                  <Image
                    src={track.coverArt}
                    alt="Cover Art"
                    className="rounded-md absolute top-0 left-0 group-hover:opacity-50"
                    width={60}
                    height={60}
                  />
                  <button
                    onClick={() => onTrackSelected(track.preview_url)}
                    className="absolute inset-[0.9rem] flex items-center justify-center opacity-0 h-8 w-8 group-hover:opacity-100 transform hover:scale-125 bg-green-500 p-2 rounded-full transition-transform duration-300"
                  >
                    <FaPlay className="text-white" />
                  </button>
                </div>
                <span className="text-white text-sm mb-1 w-[20%]">
                  {track.name}
                </span>
                <span className="text-white text-sm mb-1 w-[20%]">
                  {track.albumName}
                </span>
                <span className="text-white text-sm mb-1 w-[20%] hidden md:block">
                  {track.artistName}
                </span>
                <span className="text-white text-sm mb-1 w-[20%]">
                  {Math.floor(track.duration / 60000)}:
                  {((track.duration % 60000) / 1000)
                    .toFixed(0)
                    .padStart(2, "0")}
                </span>
              </div>
          )
        )}
      </div>
    </div>
  );
};
