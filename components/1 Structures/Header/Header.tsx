"use client";

import {
  signInWithSpotify,
  signOut,
  getSession,
  supabase,
} from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "../../2 Parts/Button";
import { getSpotifyProfile } from "@/lib/spotify";
import { FaUserCircle, FaGithub, FaInstagram, FaSpotify } from "react-icons/fa";
import { TechUsed } from "../Sidebar/TechUsed";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const router = useRouter();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [spotifyProfile, setSpotifyProfile] = useState<any>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Reference for the dropdown to detect outside clicks
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await getSession();
      setSession(data?.session || null);
      console.log(data?.session?.provider_token);
    };

    fetchSession();

    const fetchData = async () => {
      const profile = await getSpotifyProfile();
      setSpotifyProfile(profile);
    };
    fetchData();
  }, []);

  const handleLogin = async () => {
    const { error } = await signInWithSpotify();
    if (error) {
      setLoginError(
        "Oops! Something went wrong with logging in. Please try again."
      );
    } else {
      setLoginError(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  useEffect(() => {
    // Set up a session subscription when component mounts
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const redirectToGithub = () => {
    window.open("https://github.com/renzogabrielsy", "_blank");
  };
  const redirectToInstagram = () => {
    window.open("https://www.instagram.com/renzo.code/", "_blank");
  };
  const redirectToRenzoSpotify = () => {
    window.open(
      "https://open.spotify.com/artist/4rfbCfMiXIqYNOII8JJFbB?si=8kLwrgjlS4mUxdjvrcYfEA",
      "_blank"
    );
  };

  return (
    <div
      className={twMerge(
        `
        h-fit
        mr-4
        `,
        className
      )}
    >
      {loginError && <p className="text-red-500">{loginError}</p>}
      <div
        className="
      w-full
      flex
      items-center
      justify-end
      "
      >
        <div
          className="
        flex
        justify-between
        items-center
        gap-x-4
        "
        >
          {/* signup and signin buttons */}
            <>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-400 transition hover:opacity-75"
                >
                  <FaUserCircle className="text-3xl text-black" />
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="transition-opacity duration-300 absolute top-[100%] right-0 mt-2 bg-white bg-opacity shadow-md rounded-lg w-40"
                    style={{ opacity: isDropdownOpen ? 1 : 0 }}
                  >
                    <div className="flex flex-col justify-between items-center w-full">
                      <div className="flex my-2 text-black font-bold">Signed in as:</div>
                      {spotifyProfile?.images &&
                        spotifyProfile.images.length > 0 && (
                          <div className="rounded-full w-8 h-8 overflow-hidden">
                            <img
                              src={spotifyProfile.images[0].url}
                              alt="Spotify Profile"
                            />
                          </div>
                        )}
                      <div className="text-black">
                        {spotifyProfile?.display_name}
                      </div>
                      <div className="flex flex-col justify-center items-center gap-y-1 mt-10">
                        <div className="flex justify-center">
                          <p className="italic text-xs text-black">
                            App made by Renzo Sy
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-x-4">
                          <div className="flex flex-row gap-x-2">
                            <div className="flex flex-col gap-y-1 justify-center items-center">
                              <Button
                                className="flex justify-center items-center h-8 w-8 bg-black p-0"
                                onClick={() => redirectToGithub()}
                              >
                                <FaGithub className="text-white text-xl" />
                              </Button>
                            </div>
                            <div className="flex flex-col gap-y-2 justify-center items-center">
                              <Button
                                className="flex justify-center items-center h-8 w-8 bg-black p-0"
                                onClick={redirectToInstagram}
                              >
                                <FaInstagram className=" text-white text-xl" />
                              </Button>
                            </div>
                            <div className="flex flex-col gap-y-2 justify-center items-center">
                              <Button
                                className="flex justify-center items-center h-8 w-8 bg-black p-0"
                                onClick={redirectToRenzoSpotify}
                              >
                                <FaSpotify className="text-white text-xl" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleLogout}
                        className="flex bg-red-500 text-white m-2 w-28 h-9 items-center justify-center text-sm"
                      >
                        Log Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
        </div>
      </div>
    </div>
  );
};

export default Header;
