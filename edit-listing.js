(() => {
 const B=window.KaikkiBackend;
 if(!B?.enabled)return;
 const style=document.createElement('style');
 style.textContent=`.own-listing-actions{display:flex;gap:8px;flex-wrap:wrap}.own-listing-actions button{width:auto!important}.edit-own{background:#eef4ff!important;color:#1565d8!important;border:1px solid #bfdbfe!important}#editListingModal .panel{max-width:620px}#editListingForm{display:grid;gap:12px}#editListingForm label{display:grid;gap:6px}#editListingForm input,#editListingForm textarea,#editListingForm select{width:100%}#editListingForm textarea{min-height:120px}.edit-photo-preview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.edit-photo-preview img{width:100%;height:110px;object-fit:cover;border-radius:10px;border:1px solid #e5e7eb}`;
 document.head.appendChild(style);
 document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="editListingModal" aria-hidden="true"><div class="panel"><button class="close" id="editListingClose" type="button">×</button><h2>Muokkaa ilmoitusta</h2><form id="editListingForm"><label>Otsikko<input id="editTitle" required maxlength="80"></label><label>Hinta (€)<input id="editPrice" type="number" min="0" required></label><label>Kaupunki<input id="editCity" required></label><label>Osoite<input id="editAddress"></label><label>Kunto<select id="editCondition"><option>Hyvä</option><option>Uudenveroinen</option><option>Tyydyttävä</option><option>Uusi</option></select></label><label>Kuvat<input id="editPhotos" type="file" accept="image/jpeg,image/png,image/webp" multiple><small>Voit lisätä tai vaihtaa kuvat. Enintään 6 kuvaa.</small></label><div id="editPhotoPreview" class="edit-photo-preview"></div><label>Kuvaus<textarea id="editDescription" maxlength="1000"></textarea></label><p class="auth-message" id="editListingMessage"></p><button class="publish-btn" type="submit">Tallenna muutokset</button></form></div></div>`);
 const modal=document.querySelector('#editListingModal'),form=document.querySelector('#editListingForm'),msg=document.querySelector('#editListingMessage'),photoInput=document.querySelector('#editPhotos'),preview=document.querySelector('#editPhotoPreview');
 let currentId=null,currentImages=[];
 function renderPreview(urls){preview.innerHTML=(urls||[]).map(u=>`<img src="${u}" alt="Ilmoituksen kuva">`).join('')}
 function close(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');currentId=null;currentImages=[];photoInput.value='';preview.innerHTML='';msg.textContent=''}
 document.querySelector('#editListingClose').onclick=close;
 modal.onclick=e=>{if(e.target===modal)close()};
 async function open(id){
  try{
   const s=await B.session();if(!s)throw new Error('Kirjaudu ensin.');
   const {data,error}=await B.client.from('listings').select('*').eq('id',id).eq('user_id',s.user.id).single();
   if(error)throw error;
   currentId=id;currentImages=Array.isArray(data.image_urls)?data.image_urls:[];
   document.querySelector('#editTitle').value=data.title||'';
   document.querySelector('#editPrice').value=data.price||0;
   document.querySelector('#editCity').value=data.city||'';
   document.querySelector('#editAddress').value=data.address||'';
   document.querySelector('#editCondition').value=data.condition||'Hyvä';
   document.querySelector('#editDescription').value=data.description||'';
   photoInput.value='';renderPreview(currentImages);
   msg.textContent='';modal.classList.add('show');modal.setAttribute('aria-hidden','false');
  }catch(e){alert('Ilmoitusta ei voitu avata muokattavaksi: '+(e.message||e))}
 }
 photoInput.onchange=()=>{
  const files=[...photoInput.files].slice(0,6);
  if(files.length!==photoInput.files.length)alert('Voit valita enintään 6 kuvaa.');
  files.forEach(f=>{if(f.size>10*1024*1024)alert('Yksi kuva on liian suuri. Enimmäiskoko on 10 Mt.');});
  const urls=files.filter(f=>f.size<=10*1024*1024).map(f=>URL.createObjectURL(f));renderPreview(urls.length?urls:currentImages)
 };
 async function uploadFiles(files,session){
  const out=[];
  for(let i=0;i<files.length;i++){
   const f=files[i];if(f.size>10*1024*1024)throw new Error('Yksi kuva on liian suuri (enintään 10 Mt).');
   const ext=(f.name.split('.').pop()||'jpg').toLowerCase();
   const path=`${session.user.id}/${Date.now()}-edit-${i}-${Math.random().toString(36).slice(2,8)}.${ext}`;
   const {error}=await B.client.storage.from('listing-images').upload(path,f,{contentType:f.type||'image/jpeg',cacheControl:'3600',upsert:false});
   if(error)throw error;
   const {data}=B.client.storage.from('listing-images').getPublicUrl(path);out.push(data.publicUrl)
  }
  return out
 }
 form.onsubmit=async e=>{
  e.preventDefault();if(!currentId)return;
  msg.textContent='Tallennetaan...';
  try{
   const s=await B.session();if(!s)throw new Error('Kirjaudu ensin.');
   const selected=[...photoInput.files].slice(0,6);
   const imageUrls=selected.length?await uploadFiles(selected,s):currentImages;
   const patch={title:document.querySelector('#editTitle').value.trim(),price:Number(document.querySelector('#editPrice').value)||0,city:document.querySelector('#editCity').value.trim(),address:document.querySelector('#editAddress').value.trim(),condition:document.querySelector('#editCondition').value,description:document.querySelector('#editDescription').value.trim(),image_urls:imageUrls};
   const {error}=await B.client.from('listings').update(patch).eq('id',currentId).eq('user_id',s.user.id).select().single();
   if(error)throw error;
   msg.textContent='Muutokset ja kuvat tallennettu.';
   setTimeout(()=>{close();location.reload()},600);
  }catch(err){msg.textContent='Tallennus epäonnistui: '+(err.message||err)}
 };
 function addButtons(){
  document.querySelectorAll('#accountBody .my-listing').forEach(row=>{
   if(row.querySelector('.edit-own'))return;
   const del=row.querySelector('.delete-own');if(!del)return;
   const id=del.dataset.id;
   const wrap=document.createElement('div');wrap.className='own-listing-actions';
   const edit=document.createElement('button');edit.type='button';edit.className='edit-own';edit.dataset.id=id;edit.textContent='Muokkaa';
   del.parentNode.insertBefore(wrap,del);wrap.appendChild(edit);wrap.appendChild(del);
   edit.onclick=()=>open(id);
  });
 }
 const observer=new MutationObserver(addButtons);observer.observe(document.body,{subtree:true,childList:true});addButtons();
})();