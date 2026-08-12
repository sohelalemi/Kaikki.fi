import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

export async function pickImage({allowsEditing=false}={}){
  const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
  if(!permission.granted)throw new Error('Salli kuvien käyttö asetuksista.');
  const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],allowsEditing,quality:0.82});
  if(result.canceled)return null;
  return result.assets?.[0]||null;
}

export async function pickListingImages(limit=8){
  const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
  if(!permission.granted)throw new Error('Salli kuvien käyttö asetuksista.');
  const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],allowsMultipleSelection:true,selectionLimit:limit,quality:0.82});
  if(result.canceled)return [];
  return (result.assets||[]).slice(0,limit);
}

async function uploadUri(bucket,path,asset){
  const response=await fetch(asset.uri);
  const arrayBuffer=await response.arrayBuffer();
  const contentType=asset.mimeType||'image/jpeg';
  const {error}=await supabase.storage.from(bucket).upload(path,arrayBuffer,{contentType,cacheControl:'3600'});
  if(error)throw error;
  const {data}=supabase.storage.from(bucket).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function uploadAvatar(userId,asset){
  const ext=(asset.fileName||'avatar.jpg').split('.').pop()?.toLowerCase()||'jpg';
  return uploadUri('Avatars',`${userId}/${Date.now()}-avatar.${ext}`,asset);
}

export async function uploadListingImage(userId,asset,index=0){
  const ext=(asset.fileName||`photo-${index}.jpg`).split('.').pop()?.toLowerCase()||'jpg';
  return uploadUri('listing-images',`${userId}/${Date.now()}-${index}.${ext}`,asset);
}

export async function uploadListingImages(userId,assets=[]){
  return Promise.all(assets.map((asset,index)=>uploadListingImage(userId,asset,index)));
}
