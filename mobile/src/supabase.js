import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = 'https://nqbxzvaksnnblpbhxsol.supabase.co';
const anonKey = 'sb_publishable_XuXZLk-AaTQ9dEJPYvXVLg_MLEBew3p';

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
