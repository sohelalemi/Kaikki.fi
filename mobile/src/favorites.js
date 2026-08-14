import { supabase } from './supabase';

export async function loadFavoriteIds(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => row.listing_id);
}

export async function addFavorite(userId, listingId) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, listing_id: listingId });
  if (error && error.code !== '23505') throw error;
}

export async function removeFavorite(userId, listingId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('listing_id', listingId);
  if (error) throw error;
}

export async function toggleFavorite(userId, listingId, isFavorite) {
  if (isFavorite) {
    await removeFavorite(userId, listingId);
    return false;
  }
  await addFavorite(userId, listingId);
  return true;
}
