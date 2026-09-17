import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from localStorage or Vite environment variables
export const getSupabaseCredentials = () => {
  try {
    const saved = localStorage.getItem('sri_rama_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
      }
    }
  } catch (e) {}

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url: envUrl.trim(), anonKey: envKey.trim() };
};

let clientInstance = null;
let currentClientUrl = '';

export const getSupabaseClient = () => {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;

  if (!clientInstance || currentClientUrl !== url) {
    try {
      clientInstance = createClient(url, anonKey);
      currentClientUrl = url;
    } catch (e) {
      console.error("Failed to create Supabase client:", e);
      clientInstance = null;
    }
  }
  return clientInstance;
};

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
};

export const setSupabaseCredentials = (url, anonKey) => {
  if (!url || !anonKey) {
    localStorage.removeItem('sri_rama_supabase_config');
    clientInstance = null;
    currentClientUrl = '';
    return;
  }
  localStorage.setItem('sri_rama_supabase_config', JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() }));
  clientInstance = createClient(url.trim(), anonKey.trim());
  currentClientUrl = url.trim();
};

export const testSupabaseConnection = async () => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'క్లౌడ్ డేటాబేస్ URL మరియు API Key నమోదు కాబడలేదు.' };
  }

  try {
    const { data, error } = await client.from('devotees').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          code: 'NO_TABLE',
          message: "డేటాబేస్ కనెక్ట్ అయ్యింది! కానీ 'devotees' టేబుల్ లభించలేదు. దయచేసి DBeaver SQL Editor లో dbeaver_schema.sql రన్ చేయండి."
        };
      }
      if (error.code === '42501') {
        return {
          success: false,
          code: 'RLS_ERROR',
          message: "డేటాబేస్ కనెక్ట్ అయ్యింది కానీ RLS Permission అనుమతించబడలేదు! దయచేసి DBeaver లో RLS Policies సృష్టించండి."
        };
      }
      return { success: false, code: error.code, message: `డేటాబెస్ ఎర్రర్: ${error.message}` };
    }
    return { success: true, message: 'DBeaver / Supabase Cloud డేటాబేస్‌కి విజయవంతంగా కనెక్ట్ కాబడింది!' };
  } catch (err) {
    return { success: false, message: `నెట్‌వర్క్ / కనెక్షన్ ఎర్రర్: ${err.message}` };
  }
};
