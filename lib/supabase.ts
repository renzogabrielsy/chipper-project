import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with your Supabase URL and ANON key
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string; // Replace with your Supabase anon key
export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

// Sign in using Spotify provider
export const signInWithSpotify = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: { scopes: "streaming user-read-email user-read-private user-modify-playback-state" },
  });
};

// Sign out
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Supabase Auth session
export const getSession = () => {
  return supabase.auth.getSession();
}

// // Optional: If you want to listen to session changes, you can export a function like this:
// export const subscribeToSession = (callback: (session: Session | null) => void) => {
//   return supabase.auth.onAuthStateChange((_event, session) => {
//     callback(session);
//   });
// };