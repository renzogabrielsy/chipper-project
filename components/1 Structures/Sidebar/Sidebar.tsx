"use client";

import {
  signInWithSpotify,
  signOut,
  getSession,
  supabase,
} from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome, HiOutlineDesktopComputer } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "../../2 Parts/Box";
import SidebarItem from "./SidebarItem";
import { Discography } from "./Discography";
import { getSpotifyProfile } from "@/lib/spotify";
import Button from "@/components/2 Parts/Button";
import { WelcomePage } from "../Welcome Page/WelcomePage";
import { TechUsed } from "./TechUsed";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [spotifyProfile, setSpotifyProfile] = useState<any>(null);
  const pathname = usePathname();
  const routes = useMemo(
    // using the useMemo hook early to setup a good foundation for navigation side of the app if in case I want to add more pages
    () => [
      {
        icon: HiHome,
        label: "Chipper",
        active: pathname !== "/search",
        href: "/",
      },
    ],
    [pathname]
  );

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
      {!session || !session.provider_token ? (
        <div className="flex justify-center items-center h-full">
          <WelcomePage />
        </div>
      ) : (
        <>
          <div className="flex h-full ">
            <div
              className="
        hidden 
        md:flex
        flex-col
        gap-y-2
        h-[100vh]
        w-[320px]
        p-2
        "
            >
              <Box>
                <div
                  className="
            rounded-lg
            flex
            flex-col
            gap-y-2
            px-5
            py-4
            "
                >
                  {routes.map((item) => (
                    <SidebarItem key={item.label} {...item} />
                  ))}
                </div>
              </Box>
              <Box
                className="
        overflow-y-auto
        h-full
        "
              >
                <Discography />
              </Box>
              <Box className="flex flex-col flex-end mt-auto h-auto">
                <div className="h-[190px] flex flex-col justify-start items-start w-full">
                  <TechUsed />
                </div>

                
              </Box>
            </div>
            <main className="h-[96%] md:h-[100%] flex-1 overflow-y-auto py-2 pl-2 md:pl-0 pr-2">
              {children}
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
