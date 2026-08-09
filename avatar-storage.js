(() => {
 const B=window.KaikkiBackend;
 if(!B?.client)return;
 const allowed=new Set(['image/jpeg','image/png','image/webp','image/gif']);
 function extFor(file){const byType={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};return byType[file.type]||'jpg'}
 async function uploadAvatar(file,user){
  if(!allowed.has(file.type))throw new Error('Valitse JPG-, PNG-, WebP- tai GIF-kuva.');
  if(file.size>5*1024*1024)throw new Error('Profiilikuvan enimmäiskoko on 5 Mt.');
  const path=`${user.id}/avatar.${extFor(file)}`;
  const {error}=await B.client.storage.from('avatars').upload(path,file,{upsert:true,contentType:file.type,cacheControl:'3600'});
  if(error)throw error;
  const {data}=B.client.storage.from('avatars').getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
 }
 document.addEventListener('submit',async e=>{
  const form=e.target;
  if(form?.id!=='profileForm')return;
  const input=form.querySelector('#profilePhoto'),file=input?.files?.[0];
  if(!file)return;
  e.preventDefault();e.stopImmediatePropagation();
  const pm=form.querySelector('#profileMessage'),button=form.querySelector('button[type="submit"]');
  if(pm)pm.textContent='Kuvaa ladataan...';if(button)button.disabled=true;
  try{
   const session=await B.session();if(!session)throw new Error('Kirjaudu ensin.');
   const avatarUrl=await uploadAvatar(file,session.user);
   await B.updateProfile({display_name:form.querySelector('#profileName')?.value.trim()||'',phone:form.querySelector('#profilePhone')?.value.trim()||'',city:form.querySelector('#profileCity')?.value.trim()||'',avatar_url:avatarUrl});
   const preview=form.querySelector('#profilePhotoPreview');if(preview?.tagName==='IMG')preview.src=avatarUrl;
   if(pm)pm.textContent='Profiilikuva ja profiili tallennettu.';
   setTimeout(()=>document.querySelector('[data-account-tab="profile"]')?.click(),500);
  }catch(err){if(pm)pm.textContent=err?.message||'Kuvan tallennus epäonnistui.'}
  finally{if(button)button.disabled=false}
 },true);
})();
