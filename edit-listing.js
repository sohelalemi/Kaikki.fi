(() => {
 const B=window.KaikkiBackend;
 if(!B?.enabled)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const style=document.createElement('style');
 style.textContent=`.own-listing-actions{display:flex;gap:8px;flex-wrap:wrap}.own-listing-actions button{width:auto!important}.edit-own{background:#eef4ff!important;color:#1565d8!important;border:1px solid #bfdbfe!important}#editListingModal .panel{max-width:620px}#editListingForm{display:grid;gap:12px}#editListingForm label{display:grid;gap:6px}#editListingForm input,#editListingForm textarea,#editListingForm select{width:100%}#editListingForm textarea{min-height:120px}`;
 document.head.appendChild(style);
 document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="editListingModal" aria-hidden="true"><div class="panel"><button class="close" id="editListingClose" type="button">×</button><h2>Muokkaa ilmoitusta</h2><form id="editListingForm"><label>Otsikko<input id="editTitle" required maxlength="80"></label><label>Hinta (€)<input id="editPrice" type="number" min="0" required></label><label>Kaupunki<input id="editCity" required></label><label>Osoite<input id="editAddress"></label><label>Kunto<select id="editCondition"><option>Hyvä</option><option>Uudenveroinen</option><option>Tyydyttävä</option><option>Uusi</option></select></label><label>Kuvaus<textarea id="editDescription" maxlength="1000"></textarea></label><p class="auth-message" id="editListingMessage"></p><button class="publish-btn" type="submit">Tallenna muutokset</button></form></div></div>`);
 const modal=document.querySelector('#editListingModal'),form=document.querySelector('#editListingForm'),msg=document.querySelector('#editListingMessage');
 let currentId=null;
 function close(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');currentId=null;msg.textContent=''}
 document.querySelector('#editListingClose').onclick=close;
 modal.onclick=e=>{if(e.target===modal)close()};
 async function open(id){
  try{
   const s=await B.session();if(!s)throw new Error('Kirjaudu ensin.');
   const {data,error}=await B.client.from('listings').select('*').eq('id',id).eq('user_id',s.user.id).single();
   if(error)throw error;
   currentId=id;
   document.querySelector('#editTitle').value=data.title||'';
   document.querySelector('#editPrice').value=data.price||0;
   document.querySelector('#editCity').value=data.city||'';
   document.querySelector('#editAddress').value=data.address||'';
   document.querySelector('#editCondition').value=data.condition||'Hyvä';
   document.querySelector('#editDescription').value=data.description||'';
   msg.textContent='';modal.classList.add('show');modal.setAttribute('aria-hidden','false');
  }catch(e){alert('Ilmoitusta ei voitu avata muokattavaksi: '+(e.message||e))}
 }
 form.onsubmit=async e=>{
  e.preventDefault();if(!currentId)return;
  msg.textContent='Tallennetaan...';
  try{
   const s=await B.session();if(!s)throw new Error('Kirjaudu ensin.');
   const patch={title:document.querySelector('#editTitle').value.trim(),price:Number(document.querySelector('#editPrice').value)||0,city:document.querySelector('#editCity').value.trim(),address:document.querySelector('#editAddress').value.trim(),condition:document.querySelector('#editCondition').value,description:document.querySelector('#editDescription').value.trim()};
   const {data,error}=await B.client.from('listings').update(patch).eq('id',currentId).eq('user_id',s.user.id).select().single();
   if(error)throw error;
   msg.textContent='Muutokset tallennettu.';
   setTimeout(()=>{close();location.reload()},500);
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