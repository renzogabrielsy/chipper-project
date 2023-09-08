"use client";

import React from "react";
import {
  signInWithSpotify,
  signOut,
  getSession,
  supabase,
} from "@/lib/supabase";
import { FaSpotify, FaGithub, FaInstagram } from "react-icons/fa";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect, useRef } from "react";
import { getSpotifyProfile } from "@/lib/spotify";
import Box from "@/components/2 Parts/Box";
import Button from "@/components/2 Parts/Button";

type Props = {};

export const WelcomePage = (props: Props) => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [spotifyProfile, setSpotifyProfile] = useState<any>(null);

  const redirectToSpotifySignUp = () => {
    window.open("https://www.spotify.com/signup/", "_blank");
  };
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

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await getSession();
      setSession(data?.session || null);
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
  return (
    <>
      <Box className="flex flex-col justify-center items-center p-10 h-full w-full md:h-[700px] md:w-[500px]">
        <div className="flex flex-col justify-center items-center h-full w-full gap-y-4">
          <h1 className="text-2xl font-bold">Welcome to</h1>
          <h1 className="text-4xl font-bold">Chipper V1</h1>
          <p className="text-center text-lg font-semibold">
            {`Renzo's cool little web-based app featuring his own music and some
            of his favorites on Spotify!`}
          </p>

          <p className="text-center text-sm italic">
            {`(made by Renzo himself, of course!)`}
          </p>
          <p className="text-center text-md font-semibold">
            Login below to access the app!
          </p>
        </div>
        <div className="flex flex-col justify-center items-center h-full w-full gap-y-4">
          <Button
            className="flex justify-center items-center text-black font-semibold"
            onClick={handleLogin}
          >
            <FaSpotify className="mr-2" />
            Login with Spotify
          </Button>
          <Button
            className="flex justify-center items-center bg-white text-black font-semibold mb-4"
            onClick={redirectToSpotifySignUp}
          >
            <FaSpotify className="mr-2" />
            Sign up for Spotify
          </Button>
          <div className="flex flex-row items-center gap-x-4">
            <div className="flex flex-col gap-y-2 justify-center items-center">
              <Button
                className="flex justify-center items-center h-12 w-12 bg-orange-400"
                onClick={() => redirectToGithub()}
              >
                <FaGithub className="text-3xl" />
              </Button>
              <p>Github</p>
            </div>
            <div className="flex flex-col gap-y-2 justify-center items-center">
              <Button
                className="flex justify-center items-center h-12 w-12 bg-orange-400"
                onClick={redirectToInstagram}
              >
                <FaInstagram className="text-3xl" />
              </Button>
              <p>Instagram</p>
            </div>
            <div className="flex flex-col gap-y-2 justify-center items-center">
              <Button
                className="flex justify-center items-center h-12 w-12 bg-orange-400"
                onClick={redirectToRenzoSpotify}
              >
                <FaSpotify className="text-3xl" />
              </Button>
              <p>Spotify</p>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};
