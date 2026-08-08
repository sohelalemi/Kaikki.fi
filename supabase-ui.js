(() => {
 const B=window.KaikkiBackend;
 if(!B?.enabled){console.warn('Kaikki.fi: Supabase backend is not enabled');return;}

 const css=document.createElement('style');
 css.textContent=`
 #authModal .auth-tabs{display:flex;gap:8px;margin:8px 0 16px}#authModal .auth-tabs button{flex:1;background:#eef4ff;color:#1565d8}#authModal .auth-tabs button.active{background:#1565d8;color:#fff}
 #authModal .auth-message{font-size:13px;margin:10px 0;min-height:18px}.auth-user-menu{display:flex;gap:8px;align-items:center}.auth-email{font-size:12px;color:#64748b;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 `;document.head.appendChild(css);

 document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="authModal" aria-hidden="true"><div class="panel"><button class="close" id="authClose" aria-label="Close">×</button><h2 id="authTitle">Kirjaudu</h2><div class="auth-tabs"><button type="button" id="tabLogin" class="active">Kirjaudu</button><button type="button" id="tabSignup">Luo tili</button></div><form id="authForm"><label id="nameWrap" hidden>Nimi<input id="authName" autocomplete="name" placeholder="Nimi"></label><label>Sähköposti<input id="authEmail" type="email" required autocomplete="email" placeholder="nimi@email.com"></label><label>Salasana<input id="authPassword" type="password" required minlength="6" autocomplete="current-password" placeholder="Vähintään 6 merkkiä"></label><p class="auth-message" id="authMessage"></p><button class="publish-btn" id="authSubmit" type="submit">Kirjaudu</button></form></div></div>`);

 const modal=document.querySelector('#authModal'),loginBtn=document.querySelector('#login'),closeBtn=document.querySelector('#authClose'),form=document.querySelector('#authForm'),msg=document.querySelector('#authMessage'),nameWrap=document.querySelector('#nameWrap'),nameInput=document.querySelector('#authName'),emailInput=document.querySelector('#authEmail'),passInput=document.querySelector('#authPassword'),submit=document.querySelector('#authSubmit'),tabLogin=document.querySelector('#tabLogin'),tabSignup=document.querySelector('#tabSignup');
 let mode='login';
 function openAuth(){modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
 function closeAuth(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');msg.textContent=''}
 function setMode(next){mode=next;const signup=mode==='signup';tabLogin.classList.toggle('active',!signup);tabSignup.classList.toggle('active',signup);nameWrap.hidden=!signup;nameInput.required=signup;submit.textContent=signup?'Luo tili':'Kirjaudu';document.querySelector('#authTitle').textContent=signup?'Luo tili':'Kirjaudu';passInput.autocomplete=signup?'new-password':'current-password';msg.textContent=''}
 tabLogin.onclick=()=>setMode('login');tabSignup.onclick=()=>setMode('signup');closeBtn.onclick=closeAuth;modal.onclick=e=>{if(e.target===modal)closeAuth()};

 async function refreshAuthUI(){
  const session=await B.session();
  if(!session){loginBtn.textContent='Kirjaudu';loginBtn.onclick=openAuth;return}
  const email=session.user.email||'Käyttäjä';
  loginBtn.textContent='Oma tili';
  loginBtn.onclick=async()=>{if(confirm(`${email}\n\nHaluatko kirjautua ulos?`)){await B.signOut();await refreshAuthUI();alert('Kirjauduit ulos.')}};
 }

 form.onsubmit=async e=>{
  e.preventDefault();msg.textContent='Odota...';submit.disabled=true;
  try{
   if(mode==='signup'){
    const data=await B.signUp(emailInput.value.trim(),passInput.value,nameInput.value.trim());
    if(data.session){msg.textContent='Tili luotiin ja olet kirjautunut sisään.';setTimeout(closeAuth,600)}
    else msg.textContent='Tili luotiin. Tarkista sähköpostisi ja vahvista tili.';
   }else{
    await B.signIn(emailInput.value.trim(),passInput.value);msg.textContent='Kirjautuminen onnistui.';setTimeout(closeAuth,500);
   }
   await refreshAuthUI();
  }catch(err){msg.textContent=err?.message||'Toiminto epäonnistui.'}finally{submit.disabled=false}
 };

 function dbToItem(row){return {id:'db-'+row.id,dbId:row.id,t:row.title,p:Number(row.price)||0,c:row.category,city:row.city||'',address:row.address||'',icon:typeof iconFor==='function'?iconFor(row.category):'📦',desc:row.description||'',condition:row.condition||'',housingType:row.housing_type||'',extra:row.extra||{},imageUrls:row.image_urls||[],photo:(row.image_urls||[])[0]||'',photos:row.image_urls||[],created:new Date(row.created_at).getTime()}}
 async function loadRemoteListings(){
  try{const rows=await B.loadListings();if(!Array.isArray(rows))return;const remote=rows.map(dbToItem);const remoteIds=new Set(remote.map(x=>x.dbId));items=items.filter(x=>!x.dbId||!remoteIds.has(x.dbId));items=[...remote,...items];render()}catch(err){console.warn('Kaikki.fi listings load failed',err)}
 }

 // Keep the existing MVP publish flow, then also persist the freshly created listing to Supabase when signed in.
 const existingSubmit=form=>form;
 const listingForm=document.querySelector('#form');
 if(listingForm){
  const previous=listingForm.onsubmit;
  listingForm.onsubmit=async e=>{
   const before=new Set(items.map(x=>x.id));
   if(previous)await previous.call(listingForm,e);
   if(e.defaultPrevented){
    const created=items.find(x=>!before.has(x.id)&&String(x.id).startsWith('user-'));
    if(!created)return;
    try{
     const session=await B.session();
     if(!session){alert('Ilmoitus tallennettiin tähän selaimeen. Kirjaudu sisään, jotta ilmoitus tallentuu myös verkkopalveluun.');return}
     created.address=created.address||document.querySelector('#address')?.value?.trim()||'';
     const row=await B.createListing(created);created.dbId=row.id;persist();
     alert('Ilmoitus tallennettiin myös Kaikki.fi:n tietokantaan.');
    }catch(err){console.warn(err);alert('Ilmoitus näkyy tässä selaimessa, mutta tallennus tietokantaan epäonnistui: '+(err?.message||'tuntematon virhe'))}
   }
  };
 }

 B.client.auth.onAuthStateChange(()=>refreshAuthUI());
 refreshAuthUI();loadRemoteListings();
})();
