import { createClient } from '@supabase/supabase-js';

// Auto-sanitize and extract proper API URL from user input or dashboard URL
export const sanitizeSupabaseUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let cleaned = url.trim();

  // If user pasted dashboard URL like https://supabase.com/dashboard/project/pnqxgyssphtwzmuqylhj
  const dashboardMatch = cleaned.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9]+)/i);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Ensure https:// prefix
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }

  // Strip trailing slashes
  return cleaned.replace(/\/+$/, '');
};

// Get Supabase credentials from localStorage or Vite environment variables
export const getSupabaseCredentials = () => {
  try {
    const saved = localStorage.getItem('sri_rama_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: sanitizeSupabaseUrl(parsed.url),
          anonKey: parsed.anonKey.trim(),
          rawUrl: parsed.url
        };
      }
    }
  } catch (e) {}

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return {
    url: sanitizeSupabaseUrl(envUrl),
    anonKey: envKey.trim(),
    rawUrl: envUrl
  };
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
  const cleanUrl = sanitizeSupabaseUrl(url);
  localStorage.setItem('sri_rama_supabase_config', JSON.stringify({ url: cleanUrl, anonKey: anonKey.trim() }));
  clientInstance = createClient(cleanUrl, anonKey.trim());
  currentClientUrl = cleanUrl;
};

export const testSupabaseConnection = async () => {
  const { url, anonKey, rawUrl } = getSupabaseCredentials();
  if (!url || !anonKey) {
    return { success: false, message: 'క్లౌడ్ డేటాబేస్ URL మరియు API Key నమోదు కాబడలేదు.' };
  }

  // Check if raw user input was a dashboard URL
  let dashboardNotice = '';
  if (rawUrl && rawUrl.includes('supabase.com/dashboard/project/')) {
    dashboardNotice = ` (గమనిక: మీరు నమోదు చేసిన డాష్‌బోర్డ్ URL ఆటోమేటిక్‌గా ` + url + ` గా మార్చబడింది)`;
  }

  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'క్లౌడ్ డేటాబేస్ క్లయింట్ ప్రారంభించడంలో లోపం జరిగింది.' };
  }

  try {
    const { data, error } = await client.from('devotees').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          code: 'NO_TABLE',
          message: `డేటాబేస్ కనెక్ట్ అయ్యింది!${dashboardNotice} కానీ 'devotees' టేబుల్ లభించలేదు. దయచేసి DBeaver SQL Editor లో dbeaver_schema.sql రన్ చేయండి.`
        };
      }
      if (error.code === '42501') {
        return {
          success: false,
          code: 'RLS_ERROR',
          message: `డేటాబేస్ కనెక్ట్ అయ్యింది!${dashboardNotice} కానీ RLS Permission అనుమతించబడలేదు. దయచేసి DBeaver లో RLS Policies సృష్టించండి.`
        };
      }
      return { success: false, code: error.code, message: `డేటాబేస్ ఎర్రర్ (${error.code}): ${error.message}${dashboardNotice}` };
    }
    return { success: true, message: `DBeaver / Supabase Cloud డేటాబేస్‌కి విజయవంతంగా కనెక్ట్ కాబడింది!${dashboardNotice}` };
  } catch (err) {
    return {
      success: false,
      message: `నెట్‌వర్క్ కనెక్షన్ ఎర్రర్: ${err.message}.${dashboardNotice} దయచేసి API URL (${url}) మరియు Anon Key సరిగ్గా ఉన్నాయో లేదో సరిచూసుకోండి.`
    };
  }
};
