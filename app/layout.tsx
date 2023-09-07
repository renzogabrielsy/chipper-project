import Sidebar from "@/components/1 Structures/Sidebar/Sidebar";
import MusicPlayer from "@/components/1 Structures/Music Player/MusicPlayer";
import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { RenzoSongs } from "@/components/1 Structures/Main/Top Songs/RenzoSongs";
import { MusicProvider } from "@/components/2 Parts/MusicProviderContext";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chipper (by renzo)",
  description: `Renzo's Cool Spotify Clone`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${font.className} bg-[url('/images/DSCF1367.webp')] flex flex-col min-h-screen`}
      >
        <div className="flex-grow h-[80vh]">
          <MusicProvider>
            <Sidebar>{children}</Sidebar>
          </MusicProvider>
        </div>
      </body>
    </html>
  );
}
