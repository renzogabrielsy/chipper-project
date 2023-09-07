"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getAccessTokenFromCode, getAccessToken } from "@/lib/spotify";
import Image from "next/image";
import { FaPlay, FaPause, FaVolumeOff } from "react-icons/fa";

declare const Spotify: any;

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface MusicPlayerProps {
  trackURI: string;
}

interface ReadyEvent {
  device_id: string;
}

interface Track {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
}

interface TrackWindow {
  current_track: Track;
}

interface PlayerState {
  track_window?: TrackWindow;
  paused: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ trackURI }) => {
  const [isReady, setIsReady] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0); // Current track progress in milliseconds
  const [duration, setDuration] = useState<number>(0); // Total track duration in milliseconds
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(null);
  const [artistName, setArtistName] = useState<string | null>(null);
  const [albumName, setAlbumName] = useState<string | null>(null);

  const playNewTrack = useCallback(
    async (deviceId: string) => {
      const token = await getAccessToken();
      if (token && trackURI) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ uris: [trackURI] }), // Set the track URI in the request body
            }
          );
          if (response.ok) {
            // Check if response status is 2xx
            setIsPlaying(true);
          } else {
            console.error(
              `Failed to resume playback. Server responded with ${response.status}: ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(
            "An error occurred while trying to resume playback:",
            error
          );
        }
      }
    },
    [trackURI]
  );

  const resumePlayback = useCallback(
    async (deviceId: string) => {
      const token = await getAccessToken();
      if (token) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              // Do not include the uris parameter in the request body
            }
          );
          if (response.ok) {
            // Check if response status is 2xx
            setIsPlaying(true);
          } else {
            console.error(
              `Failed to resume playback. Server responded with ${response.status}: ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(
            "An error occurred while trying to resume playback:",
            error
          );
        }
      }
    },
    [] // Empty dependency array since we don't need trackURI here
  );

  const pause = () => {
    if (player) {
      player.pause();
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(event.target.value);
    setProgress(newProgress);
    if (player) {
      player.seek(newProgress);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateProgress = () => {
      if (player) {
        player.getCurrentState().then((state: any) => {
          if (state) {
            setProgress(state.position);
            setDuration(state.duration);
          }
        });
      }
    };

    const progressInterval = setInterval(updateProgress, 1000); // Update every 1 second
    return () => clearInterval(progressInterval);
  }, [player]);

  useEffect(() => {
    // Automatically start playing the new track when trackURI changes
    if (deviceId && trackURI) {
      playNewTrack(deviceId);
    }
  }, [deviceId, trackURI, playNewTrack]);

  useEffect(() => {
    const initPlayer = async () => {
      const token = await getAccessToken();
      if (token) {
        const player = new Spotify.Player({
          name: "Chipper (by renzo)",
          getOAuthToken: (cb: (token: string) => void) => {
            cb(token);
          },
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }: ReadyEvent) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
          playNewTrack(device_id);
          setIsReady(true);
        });

        player.addListener(
          "not_ready",
          ({ device_id }: { device_id: string }) => {
            console.log("Device ID has gone offline", device_id);
          }
        );

        player.addListener(
          "initialization_error",
          ({ message }: { message: string }) => {
            console.error(message);
          }
        );

        player.addListener(
          "authentication_error",
          ({ message }: { message: string }) => {
            console.error(message);
          }
        );

        player.addListener(
          "account_error",
          ({ message }: { message: string }) => {
            console.error(message);
          }
        );

        let hasLoggedError = false;
        let lastTrackName = "";

        player.addListener("player_state_changed", (state: PlayerState) => {
          if (state && state.track_window && state.track_window.current_track) {
            const currentTrackData = state.track_window.current_track;
            const trackName = currentTrackData.name;
            const coverArt = currentTrackData.album.images[0].url;
            const artist = currentTrackData.artists[0]?.name; // <-- Extracting artist name
            const album = currentTrackData.album.name; // <-- Extracting album name

            if (trackName !== lastTrackName) {
              setCurrentTrack(trackName);
              setCoverArtUrl(coverArt);
              setArtistName(artist); // <-- Setting artist name to state
              setAlbumName(album); // <-- Setting album name to state
              lastTrackName = trackName;
            }
          } else {
            console.error(
              "Failed to get track information. The track window or current track is not available."
            );
          }

          setIsPlaying(!state?.paused);
        });

        player.connect();
        setPlayer(player);
      }
    };

    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
      const loadScript = () => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.onload = () => {};
        document.body.appendChild(script);
      };

      loadScript();
    }
  }, [playNewTrack, trackURI]);

  useEffect(() => {
    if (currentTrack) {
      console.log(`Now playing: ${currentTrack}`);
    }
  }, [currentTrack]);

  return (
    <div className="music-player px-[0.55rem] py-[0.5rem] text-white rounded-md">
      <div className="flex flex-grow w-full justify-center md:justify-between items-center ">
        <div className=" min-h-[170px] min-w-[170px] mr-2 rounded-md bg-gray-950 md:flex justify-center hidden">
          {coverArtUrl && (
            <Image
              src={coverArtUrl}
              alt="Cover Art"
              className="rounded-md"
              width={170}
              height={170}
            />
          )}
        </div>
        <div className="w-full ml-1 mr-1">
          <div className="ml-3 min-h-[64px]">
            <h2 className="text-2xl">{currentTrack}</h2>
            {artistName && <p className="text-xs">by {artistName}</p>}
            {albumName && <p className="text-xs mb-2">from {albumName}</p>}
          </div>
          <div className="flex justify-center items-center flex-col w-full md:w-auto p-3">
            <div className="flex flex-row justify-between md:justify-center w-full">
              <div className="md:hidden"></div>
              {isPlaying ? (
                <button
                  className={`bg-white p-2 rounded-full justify-center mb-2 ml-5 md:ml-0 ${
                    !isReady ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={pause}
                >
                  <FaPause className="text-sm text-black" />
                </button>
              ) : (
                <button
                  className={`bg-white p-2 rounded-full justify-center mb-2 ml-5 md:ml-0 ${
                    !isReady ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (deviceId) {
                      resumePlayback(deviceId);
                    }
                  }}
                >
                  <FaPlay className="text-sm text-black" />
                </button>
              )}
              <div className="relative flex flex-col justify-between items-end md:hidden">
                <button
                  onClick={toggleVolumeSlider}
                  className="p-2 rounded-full mb-1 z-10"
                >
                  <FaVolumeOff className="text-lg" />
                </button>
                {showVolumeSlider && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    // Modified styles here
                    className="absolute w-24 transform -rotate-90 bottom-0 -right-8 mb-20"
                  />
                )}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={handleProgressChange}
              className="w-full"
            />
            <div className="flex flex-row justify-between w-full mt-2">
              <div className="text-xs">
                {formatTime(Math.floor(progress / 1000))}
              </div>
              <div className="text-xs">
                {formatTime(Math.floor(duration / 1000))}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center mt-[87px]">
          <label className="text-lg">
            <FaVolumeOff />
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-[7rem] ml-2 mr-3"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
