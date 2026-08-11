// Kaikki.fi Supabase backend adapter.
// Configure window.KAIKKI_SUPABASE_URL and window.KAIKKI_SUPABASE_ANON_KEY in config.js.
(() => {
 const url=window.KAIKKI_SUPABASE_URL, key=window.KAIKKI_SUPABASE_ANON_KEY;
 const enabled=Boolean(url&&key&&window.supabase);
 const client=enabled?window.supabase.createClient(url,key):null;
 const emailRedirectTo='https://sohelalemi.github.io/Kaikki.fi/';
 function extFromMime(type=''){return {'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[type]||'jpg'}
 async function uploadDataUrlImages(list,session){
  if(!client||!session||!Array.isArray(list)||!list.length)return Array.isArray(list)?list:[];
  const out=[];
  for(let i=0;i<list.length;i++){
   const src=list[i];
   if(typeof src!=='string'||!src.startsWith('data:image/')){out.push(src);continue}
   const res=await fetch(src),blob=await res.blob();
   if(blob.size>10*1024*1024)throw new Error('Yksi kuva on liian suuri (enintään 10 Mt).');
   const ext=extFromMime(blob.type),path=`${session.user.id}/${Date.now()}-${i}-${Math.random().toString(36).slice(2,8)}.${ext}`;
   const {error}=await client.storage.from('listing-images').upload(path,blob,{contentType:blob.type||'image/jpeg',cacheControl:'3600',upsert:false});
   if(error)throw error;
   const {data}=client.storage.from('listing-images').getPublicUrl(path);out.push(data.publicUrl)
  }
  return out
 }
 window.KaikkiBackend={
  enabled, client,
  async session(){if(!client)return null;const {data}=await client.auth.getSession();return data.session},
  async signUp(email,password,displayName=''){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const {data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo,data:{display_name:displayName}}});if(error)throw error;return data},
  async signIn(email,password){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;return data},
  async signOut(){if(client)await client.auth.signOut()},
  async updateProfile(data){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const {data:res,error}=await client.auth.updateUser({data});if(error)throw error;return res.user},
  async loadListings(){if(!client)return null;const {data,error}=await client.from('listings').select('*').order('created_at',{ascending:false});if(error)throw error;return data},
  async createListing(listing){
   if(!client)throw new Error('Backend ei ole vielä yhdistetty.');
   const session=await this.session();if(!session)throw new Error('Kirjaudu ensin.');
   const rawPhotos=Array.isArray(listing.imageUrls)&&listing.imageUrls.length?listing.imageUrls:(Array.isArray(listing.photos)?listing.photos:(listing.photo?[listing.photo]:[]));
   const photos=await uploadDataUrlImages(rawPhotos,session);
   const extra={...(listing.extra||{}),vehicleExtra:{...(listing.vehicleExtra||{})},contact:listing.contact||'',amenities:Array.isArray(listing.amenities)?listing.amenities:[]};
   const row={user_id:session.user.id,title:listing.t,price:listing.p,category:listing.c,city:listing.city,address:listing.address||'',description:listing.desc||'',condition:listing.condition||'',housing_type:listing.housingType||'',extra,image_urls:photos};
   const {data,error}=await client.from('listings').insert(row).select().single();if(error)throw error;return data
  },
  async updateListingImages(id,imageUrls){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const {data,error}=await client.from('listings').update({image_urls:Array.isArray(imageUrls)?imageUrls:[]}).eq('id',id).select().single();if(error)throw error;return data},
  async myListings(){if(!client)return [];const session=await this.session();if(!session)return [];const {data,error}=await client.from('listings').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false});if(error)throw error;return data},
  async deleteListing(id){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const {error}=await client.from('listings').delete().eq('id',id);if(error)throw error},
  async favorites(){if(!client)return [];const session=await this.session();if(!session)return [];const {data,error}=await client.from('favorites').select('listing_id').eq('user_id',session.user.id);if(error)throw error;return (data||[]).map(x=>String(x.listing_id))},
  async addFavorite(listingId){if(!client)return;const session=await this.session();if(!session)throw new Error('Kirjaudu ensin.');const id=Number(listingId);if(!Number.isFinite(id))return;const {error}=await client.from('favorites').upsert({user_id:session.user.id,listing_id:id},{onConflict:'user_id,listing_id'});if(error)throw error},
  async removeFavorite(listingId){if(!client)return;const session=await this.session();if(!session)return;const id=Number(listingId);if(!Number.isFinite(id))return;const {error}=await client.from('favorites').delete().eq('user_id',session.user.id).eq('listing_id',id);if(error)throw error},
  async notifications(){if(!client)return [];const session=await this.session();if(!session)return [];const {data,error}=await client.from('notifications').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false}).limit(50);if(error)throw error;return data||[]},
  async unreadNotificationCount(){if(!client)return 0;const session=await this.session();if(!session)return 0;const {count,error}=await client.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',session.user.id).eq('is_read',false);if(error)throw error;return count||0},
  async markNotificationRead(id){if(!client)return;const {error}=await client.from('notifications').update({is_read:true}).eq('id',id);if(error)throw error},
  async markAllNotificationsRead(){if(!client)return;const session=await this.session();if(!session)return;const {error}=await client.from('notifications').update({is_read:true}).eq('user_id',session.user.id).eq('is_read',false);if(error)throw error},
  async sendMessage({recipientId,listingId,listingTitle,body}){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const session=await this.session();if(!session)throw new Error('Kirjaudu ensin.');if(!recipientId)throw new Error('Myyjän tietoja ei löytynyt.');if(recipientId===session.user.id)throw new Error('Et voi lähettää viestiä itsellesi.');const row={sender_id:session.user.id,recipient_id:recipientId,listing_id:String(listingId||''),listing_title:listingTitle||'',body:(body||'').trim()};const {data,error}=await client.from('messages').insert(row).select().single();if(error)throw error;return data},
  async messages(){if(!client)return [];const session=await this.session();if(!session)return [];const {data,error}=await client.from('messages').select('*').or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`).order('created_at',{ascending:false}).limit(200);if(error)throw error;return data||[]},
  async conversation(listingId,otherUserId){if(!client)return [];const session=await this.session();if(!session)return [];const {data,error}=await client.from('messages').select('*').eq('listing_id',String(listingId||'')).or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${session.user.id})`).order('created_at',{ascending:true});if(error)throw error;return data||[]},
  async markConversationRead(listingId,otherUserId){if(!client)return;const session=await this.session();if(!session)return;const {error}=await client.from('messages').update({is_read:true}).eq('listing_id',String(listingId||'')).eq('sender_id',otherUserId).eq('recipient_id',session.user.id).eq('is_read',false);if(error)throw error}
 };
})();
