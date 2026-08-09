// Kaikki.fi Supabase backend adapter.
// Configure window.KAIKKI_SUPABASE_URL and window.KAIKKI_SUPABASE_ANON_KEY in config.js.
(() => {
 const url=window.KAIKKI_SUPABASE_URL, key=window.KAIKKI_SUPABASE_ANON_KEY;
 const enabled=Boolean(url&&key&&window.supabase);
 const client=enabled?window.supabase.createClient(url,key):null;
 const emailRedirectTo='https://sohelalemi.github.io/Kaikki.fi/';
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
   const photos=Array.isArray(listing.imageUrls)&&listing.imageUrls.length?listing.imageUrls:(Array.isArray(listing.photos)?listing.photos:(listing.photo?[listing.photo]:[]));
   const extra={...(listing.extra||{}),contact:listing.contact||'',amenities:Array.isArray(listing.amenities)?listing.amenities:[]};
   const row={user_id:session.user.id,title:listing.t,price:listing.p,category:listing.c,city:listing.city,address:listing.address||'',description:listing.desc||'',condition:listing.condition||'',housing_type:listing.housingType||'',extra,image_urls:photos};
   const {data,error}=await client.from('listings').insert(row).select().single();if(error)throw error;return data
  },
  async updateListingImages(id,imageUrls){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const {data,error}=await client.from('listings').update({image_urls:Array.isArray(imageUrls)?imageUrls:[]}).eq('id',id).select().single();if(error)throw error;return data},
  async myListings(){if(!client)return [];const session=await this.session();if(!session)return [];const {data,error}=await client.from('listings').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false});if(error)throw error;return data},
  async deleteListing(id){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const {error}=await client.from('listings').delete().eq('id',id);if(error)throw error},
  async notifications(){if(!client)return [];const session=await this.session();if(!session)return [];const {data,error}=await client.from('notifications').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false}).limit(50);if(error)throw error;return data||[]},
  async unreadNotificationCount(){if(!client)return 0;const session=await this.session();if(!session)return 0;const {count,error}=await client.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',session.user.id).eq('is_read',false);if(error)throw error;return count||0},
  async markNotificationRead(id){if(!client)return;const {error}=await client.from('notifications').update({is_read:true}).eq('id',id);if(error)throw error},
  async markAllNotificationsRead(){if(!client)return;const session=await this.session();if(!session)return;const {error}=await client.from('notifications').update({is_read:true}).eq('user_id',session.user.id).eq('is_read',false);if(error)throw error}
 };
})();
