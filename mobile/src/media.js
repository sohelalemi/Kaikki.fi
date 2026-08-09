import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

export async function pickImage({allowsEditing=false}={}){
  const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
  if(!permission.granted)throw new Error('Salli kuvien käyttö asetuksista.');
  const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],allowsEditing,quality:0.82});
  if(result.canceled)return null;
  return result.assets?.[0]||null;
}

async function uploadUri(bucket,path,asset){
  const response=await fetch(asset.uri);
  const blob=await response.blob();
  const contentType=asset.mimeType||'image/jpeg';
  const {error}=await supabase.storage.from(bucket).upload(path,blob,{upsert:true,contentType,cacheControl:'3600'});
  if(error)throw error;
  const {data}=supabase.storage.from(bucket).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function uploadAvatar(userId,asset){
  const ext=(asset.fileName||'avatar.jpg').split('.').pop()?.toLowerCase()||'jpg';
  return uploadUri('avatars',`${userId}/avatar.${ext}`,asset);
}

export async function uploadListingImage(userId,asset,index=0){
  const ext=(asset.fileName||`photo-${index}.jpg`).split('.').pop()?.toLowerCase()||'jpg';
  return uploadUri('listing-images',`${userId}/${Date.now()}-${index}.${ext}`,asset);
}
