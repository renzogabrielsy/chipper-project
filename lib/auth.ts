import { supabase, getSession } from './supabase'; // Import your Supabase client and getSession function
import { getAccessToken } from './spotify'; // Import getAccessToken from spotify.ts

// Helper function to check if the token has expired
const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return (exp * 1000) - new Date().getTime() < 60000; // Expires in less than 1 minute
  } catch {
    return true; // Assume token is expired if there's any error
  }
};

export const refreshAccessToken = async (): Promise<void> => {
  const { data: userData, error: userError } = await supabase.auth.getUser(); // Use await here
  if (userError) {
    console.error('Error getting user:', userError.message);
    return;
  }

  if (userData?.user) { // Check if user is available (user is authenticated)
    const session = await getSession(); // Use getSession function to get current session
    if (session) { // Check if session is available (user is authenticated)
      const accessToken = await getAccessToken(); // Get access token using imported function
      if (accessToken && isTokenExpired(accessToken)) {
        // If token is expired, trigger token refresh
        const { data, error } = await supabase.auth.refreshSession(); // Correct way to handle response

        if (error) {
          console.error('Error refreshing access token:', error.message);
        }
      }
    }
  }
};

