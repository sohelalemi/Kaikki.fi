(() => {
 const B=window.KaikkiBackend;
 if(!B?.enabled)return;
 const style=document.createElement('style');
 style.textContent=`.own-listing-actions{display:flex;gap:8px;flex-wrap:wrap}.own-listing-actions button{width:auto!important}.edit-own{background:#eef4ff!important;color:#1565d8!important;border:1px solid #bfdbfe!important}#editListingModal .panel{max-width:680px}#editListingForm{display:grid;gap:12px}#editListingForm label{display:grid;gap:6px}#editListingForm input,#editListingForm textarea,#editListingForm select{width:100%}#editListingForm textarea{min-height:120px}.edit-photo-preview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.edit-photo-tile{position:relative;border:1px solid #e5e7eb;border-radius:12px;padding:6px;background:#fff}.edit-photo-tile img{width:100%;height:120px;object-fit:cover;border-radius:8px;display:block}.edit-photo-controls{display:flex;gap:6px;margin-top:6px}.edit-photo-controls button{flex:1;padding:6px 8px;font-size:12px}.edit-photo-remove{background:#fff!important;color:#dc2626!important;border:1px solid #fecaca!important}.edit-photo-order{background:#eef4ff!important;color:#1565d8!important;border:1px solid #bfdbfe!important}.edit-photo-note{font-size:12px;color:#64748b}.edit-photo-count{font-size:12px;color:#475569}.edit-new-badge{position:absolute;top:10px;left:10px;background:#1565d8;color:white;border-radius:999px;padding:3px 7px;font-size:11px}@media(max-width:600px){.edit-photo-preview{grid-template-columns:repeat(2,minmax(0,1fr))}.edit-photo-tile img{height:105px}}`;
 document.head.appendChild(style);
 document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="editListingModal" aria-hidden="true"><div class="panel"><button class="close" id="editListingClose" type="button">×</button><h2>Muokkaa ilmoitusta</h2><form id="editListingForm"><label>Otsikko<input id="editTitle" required maxlength="80"></label><label>Hinta (€)<input id="editPrice" type="number" min="0" required></label><label>Kaupunki<input id="editCity" required></label><label>Osoite<input id="editAddress"></label><label>Kunto<select id="editCondition"><option>Hyvä</option><option>Uudenveroinen</option><option>Tyydyttävä</option><option>Uusi</option></select></label><label>Kuvat<input id="editPhotos" type="file" accept="image/jpeg,image/png,image/webp" multiple><small class="edit-photo-note">Voit säilyttää vanhat kuvat, lisätä uusia, poistaa kuvia ja vaihtaa järjestystä. Enintään 6 kuvaa, 10 Mt / kuva.</small></label><div class="edit-photo-count" id="editPhotoCount"></div><div id="editPhotoPreview" class="edit-photo-preview"></div><label>Kuvaus<textarea id="editDescription" maxlength="1000"></textarea></label><p class="auth-message" id="editListingMessage"></p><button class="publish-btn" type="submit">Tallenna muutokset</button></form></div></div>`);
 const modal=document.querySelector('#editListingModal'),form=document.querySelector('#editListingForm'),msg=document.querySelector('#editListingMessage'),photoInput=document.querySelector('#editPhotos'),preview=document.querySelector('#editPhotoPreview'),count=document.querySelector('#editPhotoCount');
 let currentId=null,photos=[];
 function revoke(item){if(item?.objectUrl)URL.revokeObjectURL(item.objectUrl)}
 function cleanup(){photos.forEach(revoke);photos=[]}
 function move(from,to){if(to<0||to>=photos.length)return;const [x]=photos.splice(from,1);photos.splice(to,0,x);renderPreview()}
 function renderPreview(){
  count.textContent=`${photos.length} / 6 kuvaa`;
  preview.innerHTML=photos.map((p,i)=>`<div class="edit-photo-tile" data-photo-index="${i}">${p.kind==='new'?'<span class="edit-new-badge">Uusi</span>':''}<img src="${p.url}" alt="Ilmoituksen kuva ${i+1}"><div class="edit-photo-controls"><button type="button" class="edit-photo-order" data-left="${i}" ${i===0?'disabled':''}>←</button><button type="button" class="edit-photo-order" data-right="${i}" ${i===photos.length-1?'disabled':''}>→</button><button type="button" class="edit-photo-remove" data-remove="${i}">Poista</button></div></div>`).join('');
  preview.querySelectorAll('[data-left]').forEach(b=>b.onclick=()=>move(+b.dataset.left,+b.dataset.left-1));
  preview.querySelectorAll('[data-right]').forEach(b=>b.onclick=()=>move(+b.dataset.right,+b.dataset.right+1));
  preview.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const i=+b.dataset.remove;revoke(photos[i]);photos.splice(i,1);renderPreview()});
 }
 function close(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');currentId=null;photoInput.value='';cleanup();preview.innerHTML='';count.textContent='';msg.textContent=''}
 document.querySelector('#editListingClose').onclick=close;
 modal.onclick=e=>{if(e.target===modal)close()};
 async function open(id){
  try{
   const s=await B.session();if(!s)throw new Error('Kirjaudu ensin.');
   const {data,error}=await B.client.from('listings').select('*').eq('id',id).eq('user_id',s.user.id).single();if(error)throw error;
   currentId=id;cleanup();photos=(Array.isArray(data.image_urls)?data.image_urls:[]).map(url=>({kind:'existing',url}));
   document.querySelector('#editTitle').value=data.title||'';document.querySelector('#editPrice').value=data.price||0;document.querySelector('#editCity').value=data.city||'';document.querySelector('#editAddress').value=data.address||'';document.querySelector('#editCondition').value=data.condition||'Hyvä';document.querySelector('#editDescription').value=data.description||'';
   photoInput.value='';renderPreview();msg.textContent='';modal.classList.add('show');modal.setAttribute('aria-hidden','false');
  }catch(e){alert('Ilmoitusta ei voitu avata muokattavaksi: '+(e.message||e))}
 }
 photoInput.onchange=()=>{
  const files=[...photoInput.files];
  const allowed=new Set(['image/jpeg','image/png','image/webp']);
  const valid=[];
  for(const f of files){if(!allowed.has(f.type)){alert('Valitse vain JPG-, PNG- tai WebP-kuvia.');continue}if(f.size>10*1024*1024){alert('Yksi kuva on liian suuri. Enimmäiskoko on 10 Mt.');continue}valid.push(f)}
  const room=Math.max(0,6-photos.length);if(valid.length>room)alert(`Voit lisätä vielä enintään ${room} kuvaa.`);
  valid.slice(0,room).forEach(file=>{const objectUrl=URL.createObjectURL(file);photos.push({kind:'new',file,url:objectUrl,objectUrl})});
  photoInput.value='';renderPreview();
 };
 async function uploadNew(item,session,index){const f=item.file,ext=(f.name.split('.').pop()||'jpg').toLowerCase(),path=`${session.user.id}/${Date.now()}-edit-${index}-${Math.random().toString(36).slice(2,8)}.${ext}`;const {error}=await B.client.storage.from('listing-images').upload(path,f,{contentType:f.type||'image/jpeg',cacheControl:'3600',upsert:false});if(error)throw error;const {data}=B.client.storage.from('listing-images').getPublicUrl(path);return data.publicUrl}
 form.onsubmit=async e=>{
  e.preventDefault();if(!currentId)return;msg.textContent='Tallennetaan...';const button=form.querySelector('button[type="submit"]');if(button)button.disabled=true;
  try{
   const s=await B.session();if(!s)throw new Error('Kirjaudu ensin.');
   const imageUrls=[];for(let i=0;i<photos.length;i++)imageUrls.push(photos[i].kind==='existing'?photos[i].url:await uploadNew(photos[i],s,i));
   const patch={title:document.querySelector('#editTitle').value.trim(),price:Number(document.querySelector('#editPrice').value)||0,city:document.querySelector('#editCity').value.trim(),address:document.querySelector('#editAddress').value.trim(),condition:document.querySelector('#editCondition').value,description:document.querySelector('#editDescription').value.trim(),image_urls:imageUrls};
   const {error}=await B.client.from('listings').update(patch).eq('id',currentId).eq('user_id',s.user.id).select().single();if(error)throw error;
   msg.textContent='Muutokset ja kuvat tallennettu.';setTimeout(()=>{close();location.reload()},500);
  }catch(err){msg.textContent='Tallennus epäonnistui: '+(err.message||err)}finally{if(button)button.disabled=false}
 };
 function addButtons(){document.querySelectorAll('#accountBody .my-listing').forEach(row=>{if(row.querySelector('.edit-own'))return;const del=row.querySelector('.delete-own');if(!del)return;const id=del.dataset.id,wrap=document.createElement('div');wrap.className='own-listing-actions';const edit=document.createElement('button');edit.type='button';edit.className='edit-own';edit.dataset.id=id;edit.textContent='Muokkaa';del.parentNode.insertBefore(wrap,del);wrap.appendChild(edit);wrap.appendChild(del);edit.onclick=()=>open(id)})}
 const observer=new MutationObserver(addButtons);observer.observe(document.body,{subtree:true,childList:true});addButtons();
})();