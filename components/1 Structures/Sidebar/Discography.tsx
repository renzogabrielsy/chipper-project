import { TbPlaylist } from "react-icons/tb";
import { useMusicContext } from "../../2 Parts/MusicProviderContext";
import Button from "../../2 Parts/Button";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { getAccessToken } from "@/lib/spotify";

type ComponentType =
  | "RenzoSongs"
  | "SinglesForPringles"
  | "PerfectlyEP"
  | "CoolPlaylistV1"
  | "CoolPlaylistV2"
  | "CoolPlaylistV3"
  | "CoolPlaylistV4";

interface ButtonItem {
  label: string;
  component: string;
}

type AlbumArtworks = {
  [key: string]: string;
}

interface ButtonListProps {
  items: ButtonItem[];
  setCurrentComponent: (component: string) => void;
  onItemSelected?: () => void;
}

const getArtistProfilePicture = async (artistName: string, accessToken?: string | null) => {
  try {
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const artistId = searchResponse.data.artists.items[0]?.id;

    if (!artistId) return "";

    const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return artistResponse.data.images?.[0]?.url || "";
  } catch (error) {
    console.error('Error fetching artist profile picture:', error);
    return ""; // Return default value on error
  }
};


const getAlbumDetails = async (albumId: string, accessToken?: string | null) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      name: response.data.name,
      coverArt: response.data.images?.[0]?.url || "",
    };
  } catch (error) {
    console.error('Error fetching album details:', error);
    return { name: "", coverArt: "" }; // Return default values on error
  }
};


const getPlaylistDetails = async (playlistId: string, accessToken?: string | null) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      name: response.data.name,
      coverArt: response.data.images?.[0]?.url || "",
    };
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    return { name: "", coverArt: "" }; // Return default values on error
  }
};



export const Discography: React.FC = () => {
  const { setCurrentComponent, currentComponent } = useMusicContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const componentTitles: Record<ComponentType, string> = {
    RenzoSongs: `Renzo's Top Songs`,
    SinglesForPringles: `Singles For Pringles`,
    PerfectlyEP: `Perfectly EP`,
    CoolPlaylistV1: `Renzo's Cool Playlist Vol. 1`,
    CoolPlaylistV2: `Renzo's Cool Playlist Vol. 2`,
    CoolPlaylistV3: `Renzo's Cool Playlist Vol. 3`,
    CoolPlaylistV4: `Renzo's Cool Playlist Vol. 4`,
  };

  const discographyItems: ButtonItem[] = [
    { label: `Renzo's Top Songs`, component: "RenzoSongs" },
    { label: `Singles For Pringles`, component: "SinglesForPringles" },
    { label: `Perfectly EP`, component: "PerfectlyEP" },
  ];

  const playlistItems: ButtonItem[] = [
    { label: `Renzo's Cool Playlist Vol. 1`, component: "CoolPlaylistV1" },
    { label: `Renzo's Cool Playlist Vol. 2`, component: "CoolPlaylistV2" },
    { label: `Renzo's Cool Playlist Vol. 3`, component: "CoolPlaylistV3" },
    { label: `Renzo's Cool Playlist Vol. 4`, component: "CoolPlaylistV4" },
  ];

  const combinedItems: ButtonItem[] = [
    { label: "--- Discography ---", component: "" },
    ...discographyItems,
    { label: "--- Playlists ---", component: "" }, // Separator
    ...playlistItems,
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        {/* Mobile View: Modal Trigger */}
        <button
          onClick={openModal}
          className="px-4 py-2 bg-gray-700 text-white rounded md:hidden"
        >
          {componentTitles[currentComponent as ComponentType] ||
            `Renzo's Top Songs`}
        </button>

        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
            {/* Modal Overlay */}
            <div
              className="absolute top-0 left-0 w-full h-full bg-black opacity-50"
              onClick={closeModal}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-black rounded-lg shadow-md w-10/12 z-10 overflow-y-auto max-h-96">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-lg"
              >
                ✕
              </button>
              <ButtonList
                items={combinedItems}
                setCurrentComponent={setCurrentComponent}
                onItemSelected={closeModal}
              />
            </div>
          </div>
        )}

        {/* Desktop View: Sidebar Content */}
        <div className="hidden md:block">
          <Header title={`Renzo's Discography`} />
          <ButtonList
            items={discographyItems}
            setCurrentComponent={setCurrentComponent}
          />
          <Header title={`Renzo's Playlists`} />
          <ButtonList
            items={playlistItems}
            setCurrentComponent={setCurrentComponent}
          />
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-row justify-between items-center px-3 py-3 mx-2">
    <div className="inline-flex items-center gap-x-2">
      <TbPlaylist className="text-white" size={26} />
      <p className="text-white font-medium text-md">{title}</p>
    </div>
  </div>
);

const ButtonList: React.FC<ButtonListProps> = ({
  items,
  setCurrentComponent,
  onItemSelected,
}) => {
  const [albumArtworks, setAlbumArtworks] = useState<AlbumArtworks>({});
  
  useEffect(() => {
    const fetchArtworks = async () => {
      const accessToken = await getAccessToken();
  
      // Fetch album details
      const singlesForPringlesData = await getAlbumDetails("36IkSOdQIhxbyEknf6Dpk1", accessToken);
      const perfectlyEPData = await getAlbumDetails("59rJRj1ad41biX71EQrBRC", accessToken);
      
      // Fetch playlist details (Replace with actual IDs)
      const coolPlaylistV1Data = await getPlaylistDetails("6vmkBQDikfvuWWHNnFglrV", accessToken);
      const coolPlaylistV2Data = await getPlaylistDetails("17S4adaqJvn4feOeFawk5l", accessToken);
      const coolPlaylistV3Data = await getPlaylistDetails("0IAYi0pCHCKcVGRv2UPg2W", accessToken);
      const coolPlaylistV4Data = await getPlaylistDetails("5hsZHqFRnYWkgy3nQJlqge", accessToken);
      
      const renzoSyProfilePic = await getArtistProfilePicture("Renzo Sy", accessToken);

      setAlbumArtworks({
        SinglesForPringles: singlesForPringlesData.coverArt,
        PerfectlyEP: perfectlyEPData.coverArt,
        CoolPlaylistV1: coolPlaylistV1Data.coverArt,
        CoolPlaylistV2: coolPlaylistV2Data.coverArt,
        CoolPlaylistV3: coolPlaylistV3Data.coverArt,
        CoolPlaylistV4: coolPlaylistV4Data.coverArt,
        RenzoSongs: renzoSyProfilePic,
      });
    };
  
    fetchArtworks();
  }, []);

  return (
    <div className="flex flex-col overflow-y-auto flex-grow mb-4">
      {items.map((item) => (
  <div key={item.component} className="flex flex-col gap-y-2 px-5 py-2 text-sm">
    {item.component !== "" ? (
      <Button
        className="rounded-md bg-orange-400 bg-opacity-40 text-orange-400 flex justify-start items-center"
        imgSrc={albumArtworks[item.component]} // This line gets the artwork from state
        onClick={() => {
          setCurrentComponent(item.component);
          if (onItemSelected) onItemSelected(); // Close modal if function provided
        }}
      >
        {item.label}
      </Button>
    ) : (
      <div className="px-4 py-2 text-gray-400 text-center">
        {item.label} {/* Rendering the separator */}
      </div>
    )}
  </div>
))}

    </div>
  );
};
