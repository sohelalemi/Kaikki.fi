import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = 'https://nqbxzvaksnnblpbhxsol.supabase.co';
const anonKey = 'sb_publishable_XuXZLk-AaTQ9dEJPYvXVLg_MLEBew3p';

const client = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Supabase intentionally hides whether a confirmed account already exists.
// The default App.js only shows something when `error` is present, so signup
// could appear to do nothing. Normalize those successful-but-no-session cases
// into clear user-facing messages until the dedicated auth flow is added.
const originalSignUp = client.auth.signUp.bind(client.auth);
client.auth.signUp = async (credentials) => {
  const result = await originalSignUp(credentials);
  if (result.error || result.data?.session) return result;

  const identities = result.data?.user?.identities;
  if (Array.isArray(identities) && identities.length === 0) {
    return {
      ...result,
      error: {
        name: 'AuthApiError',
        message: 'Tällä sähköpostilla on jo tili. Kirjaudu sisään tai palauta salasana.',
        status: 400,
        code: 'user_already_exists',
      },
    };
  }

  return {
    ...result,
    error: {
      name: 'AuthApiError',
      message: 'Tili luotiin. Vahvista sähköpostiosoitteesi ja kirjaudu sitten sisään.',
      status: 200,
      code: 'signup_confirmation_required',
    },
  };
};

export const supabase = client;
