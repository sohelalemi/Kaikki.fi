import {supabase} from './supabase';

export async function loadFavorites(userId){
  const {data,error}=await supabase.from('favorites').select('listing_id').eq('user_id',userId);
  if(error) throw error;
  return new Set((data||[]).map(x=>String(x.listing_id)));
}

export async function toggleFavorite(userId,listingId,isFavorite){
  if(isFavorite){
    const {error}=await supabase.from('favorites').delete().eq('user_id',userId).eq('listing_id',listingId);
    if(error) throw error;
    return false;
  }
  const {error}=await supabase.from('favorites').insert({user_id:userId,listing_id:listingId});
  if(error) throw error;
  return true;
}

export async function updateOwnListing(userId,listingId,patch){
  const {data,error}=await supabase.from('listings').update(patch).eq('id',listingId).eq('user_id',userId).select().single();
  if(error) throw error;
  return data;
}

export function listingImages(listing){
  return Array.isArray(listing?.image_urls)?listing.image_urls.filter(Boolean):[];
}
