"use client"
import { createContext, useContext, useState } from "react";

type MusicContextType = {
  currentComponent: string;
  setCurrentComponent: (componentName: string) => void;
};

type MusicProviderProps = {
    children: React.ReactNode;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }
  return context;
};

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentComponent, setCurrentComponent] = useState("RenzoSongs"); // default value

  return (
    <MusicContext.Provider value={{ currentComponent, setCurrentComponent }}>
      {children}
    </MusicContext.Provider>
  );
};
