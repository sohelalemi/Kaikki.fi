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
  async createListing(listing){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const session=await this.session();if(!session)throw new Error('Kirjaudu ensin.');const row={user_id:session.user.id,title:listing.t,price:listing.p,category:listing.c,city:listing.city,address:listing.address||'',description:listing.desc||'',condition:listing.condition||'',housing_type:listing.housingType||'',extra:listing.extra||{},image_urls:listing.imageUrls||[]};const {data,error}=await client.from('listings').insert(row).select().single();if(error)throw error;return data},
  async myListings(){if(!client)return [];const session=await this.session();if(!session)return [];const {data,error}=await client.from('listings').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false});if(error)throw error;return data},
  async deleteListing(id){if(!client)throw new Error('Backend ei ole vielä yhdistetty.');const {error}=await client.from('listings').delete().eq('id',id);if(error)throw error}
 };
})();
