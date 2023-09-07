import { supabase } from "@/lib/supabase";
import axios from "axios";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

export const getAccessToken = async () => {
  try {
    const { data: sessionData, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    const {session} = sessionData ?? {}
    if (!session) {
      throw new Error("No session available");
    }

    const accessToken = session.provider_token;

    return accessToken;
  } catch (error) {
    console.error(error);
    return null;
    
  }
};

export const getAccessTokenFromCode = async (code: string) => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      return response.data.access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return null;
    }
  };
  
  export const refreshToken = async (refreshToken: string) => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        },
        headers: {
          'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      return response.data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

export const getSpotifyProfile = async () => {
    try {
      const accessToken = await getAccessToken();
  
      if (!accessToken) {
        throw new Error("No access token available");
      }
  
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

