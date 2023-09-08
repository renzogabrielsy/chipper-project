"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "@/lib/spotify";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";
import EmailForm from "@/components/2 Parts/EmailForm";

interface Track {
  name: string;
  preview_url: string;
  coverArt: string;
  albumName: string;
  artistName: string;
  duration: number;
  popularity: number;
}
interface RenzoSongsProps {
  onTrackSelected: (uri: string) => void;
  view: "GRID" | "LIST";
}

export const RenzoSongs: React.FC<RenzoSongsProps> = ({
  onTrackSelected,
  view,
}) => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getArtistId = async (
    artistName: string,
    accessToken: string
  ): Promise<string> => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${artistName}&type=artist`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.artists.items[0].id;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data === "User not registered in the Developer Dashboard"
      ) {
        setShowModal(true);
      }

      if (!errorMessage) {
        if (error.response) {
          setErrorMessage("Server responded with: " + error.response.data);
        } else {
          setErrorMessage("There was an error: " + error.message);
        }
      }
      throw error;
    }
  };

  const getTopTracks = async (
    artistId: string,
    accessToken: string
  ): Promise<Track[]> => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.tracks.map((track: any) => ({
        name: track.name,
        preview_url: track.uri,
        coverArt: track.album.images[0].url,
        albumName: track.album.name,
        artistName: track.artists[0].name,
        duration: track.duration_ms,
        popularity: track.popularity,
      }));
    } catch (error: any) {
      if (
        error.response &&
        error.response.data === "user not registered in the Developer Dashboard"
      ) {
        setShowModal(true);
      }

      if (!errorMessage) {
        if (error.response) {
          setErrorMessage("Server responded with: " + error.response.data);
        } else {
          setErrorMessage("There was an error: " + error.message);
        }
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          const artistId = await getArtistId("Renzo Sy", accessToken);
          const tracks = await getTopTracks(artistId, accessToken);
          setTopTracks(tracks);
        }
      } catch (error) {
        // Any additional error handling, if required.
      }
    };
    fetchTopTracks();
  });

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          {/* Your modal content here */}
          <div className="p-4 bg-white text-black rounded-md w-[500px] mb-16">
            <h1 className="text-xl font-bold">{`Oops! You're not part of the allowlist!`}</h1>
            <h1 className="text-sm font-semibold text-justify indent-4 mt-2">
              {`Unfortunately, because this app is still currently in "development", 
              you'll need to be part of the allowlist to access the app...`}
            </h1>
            <h1 className="text-sm font-semibold text-justify indent-4 mt-4">
              {`Fortunately, you can shoot me an e-mail regarding you interest in accessing this app! 
              Just submit the form below (along with a personal message if you'd like) and I'll get back to you in a couple of days!`}
            </h1>
            <p className="text-xs text-center font-bold mt-4">{`(Make sure you're using the email you normally use to login to Spotify!)`}</p>
            <p className="text-xs text-center font-bold mt-2 italic text-orange-600">{`**For premium Spotify users only.`}</p>
            <div className="w-full mt-4">
              <EmailForm />
            </div>
          </div>
        </div>
      )}
      <div className="justify-center max-h-full overflow-y-auto">
        <div className="flex flex-wrap justify-center xl:justify-start min-width-[100%]">
          {topTracks.map((track, index) =>
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
    </>
  );
};
