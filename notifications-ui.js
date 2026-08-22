(() => {
 const B=window.KaikkiBackend;
 if(!B?.client)return;
 const css=document.createElement('style');
 css.textContent=`.notify-wrap{position:relative;display:inline-flex;align-items:center}.notify-btn{position:relative;background:#fff!important;color:#111827!important;border:1px solid #e5e7eb!important;border-radius:12px!important;padding:10px 12px!important}.notify-badge{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#dc2626;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center}.notify-panel{position:absolute;right:0;top:48px;width:min(380px,92vw);max-height:520px;overflow:auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 18px 45px rgba(15,23,42,.18);z-index:9999;padding:12px}.notify-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:4px 4px 10px}.notify-head h3{margin:0;font-size:18px}.notify-all{background:none!important;color:#1565d8!important;padding:4px!important}.notify-item{width:100%;text-align:left;background:#fff!important;color:#111827!important;border:0!important;border-top:1px solid #eef2f7!important;border-radius:0!important;padding:12px 8px!important;display:block!important;cursor:pointer}.notify-item:hover{background:#f8fafc!important}.notify-item.unread{background:#eff6ff!important}.notify-title{font-weight:700;margin-bottom:4px}.notify-body{font-size:14px;color:#475569}.notify-time{font-size:12px;color:#94a3b8;margin-top:6px}.notify-empty{padding:24px 8px;text-align:center;color:#64748b}body.kaikki-dark .notify-btn,body.kaikki-dark .notify-panel,body.kaikki-dark .notify-item{background:#111827!important;color:#f8fafc!important;border-color:#374151!important}body.kaikki-dark .notify-item.unread{background:#1e3a5f!important}body.kaikki-dark .notify-body{color:#cbd5e1}`;
 document.head.appendChild(css);
 let panel,btn,badge;
 function fmtTime(v){try{return new Intl.DateTimeFormat('fi-FI',{dateStyle:'short',timeStyle:'short'}).format(new Date(v))}catch{return ''}}
 async function refreshBadge(){try{const n=await B.unreadNotificationCount();if(!badge)return;badge.textContent=n>99?'99+':String(n);badge.hidden=!n}catch{if(badge)badge.hidden=true}}
 function hidePanel(){if(panel)panel.hidden=true}
 function clickText(re){
  const nodes=[...document.querySelectorAll('button,a,[role="button"]')];
  const el=nodes.find(x=>re.test((x.textContent||'').trim()));
  if(el){el.click();return true}return false;
 }
 function openAccountTab(names,hash){
  hidePanel();
  if(hash)location.hash=hash.replace(/^#/,'');
  document.querySelector('#login')?.click();
  let tries=0;
  const timer=setInterval(()=>{
   for(const name of names){
    const direct=document.querySelector(`[data-account-tab="${name}"]`);
    if(direct){clearInterval(timer);direct.click();return}
   }
   const patterns={reservations:/Varaukset|Varaus/i,messages:/Viestit|Messages/i,diili:/Kaikki Diili|Diili/i};
   for(const name of names){if(clickText(patterns[name]||new RegExp(name,'i'))){clearInterval(timer);return}}
   if(++tries>=30)clearInterval(timer);
  },70);
 }
 function openMessages(){openAccountTab(['messages'],'#messages')}
 function openReservations(){openAccountTab(['reservations','bookings'],'#reservations')}
 function openDiili(){
  hidePanel();
  window.dispatchEvent(new CustomEvent('kaikki:open-diili'));
  openAccountTab(['diili','deals'],'#diili');
 }
 function routeNotification(n){
  const title=String(n?.title||'');
  const body=String(n?.body||'');
  const type=String(n?.type||'').toLowerCase();
  const link=String(n?.link||'');
  const text=`${title} ${body}`;
  if(type==='message'||link==='#messages'||/Uusi viesti|viesti/i.test(text)){openMessages();return}
  if(/diili|deal/i.test(type)||/Kaikki Diili|Diili/i.test(text)||/#diili|#deals/.test(link)){openDiili();return}
  if(/reservation|booking|varaus/i.test(type)||/Uusi varaus|Varauksen tila|varaus/i.test(text)||/#reservations|#bookings/.test(link)){openReservations();return}
  if(link){hidePanel();location.href=link;return}
  document.querySelector('#login')?.click();
 }
 async function renderPanel(){
  if(!panel)return;panel.innerHTML='<div class="notify-empty">Ladataan...</div>';
  try{
   const items=await B.notifications();
   panel.innerHTML=`<div class="notify-head"><h3>Ilmoitukset</h3><button class="notify-all" type="button">Merkitse kaikki luetuiksi</button></div>${items.length?'':'<div class="notify-empty">Ei ilmoituksia vielä.</div>'}`;
   panel.querySelector('.notify-all').onclick=async e=>{e.stopPropagation();await B.markAllNotificationsRead();await renderPanel();await refreshBadge()};
   for(const n of items){
    const el=document.createElement('button');el.type='button';el.className=`notify-item${n.is_read?'':' unread'}`;
    el.innerHTML=`<div class="notify-title"></div><div class="notify-body"></div><div class="notify-time"></div>`;
    el.querySelector('.notify-title').textContent=n.title||'Ilmoitus';
    el.querySelector('.notify-body').textContent=n.body||'';
    el.querySelector('.notify-time').textContent=fmtTime(n.created_at);
    el.onclick=async()=>{
     if(!n.is_read){await B.markNotificationRead(n.id);n.is_read=true;el.classList.remove('unread');await refreshBadge()}
     routeNotification(n);
    };
    panel.appendChild(el);
   }
  }catch{panel.innerHTML='<div class="notify-empty">Ilmoituksia ei voitu ladata.</div>'}
 }
 function mount(){
  const actions=document.querySelector('.nav-actions');if(!actions||document.querySelector('.notify-wrap'))return;
  const wrap=document.createElement('div');wrap.className='notify-wrap';
  btn=document.createElement('button');btn.type='button';btn.className='notify-btn';btn.setAttribute('aria-label','Ilmoitukset');btn.textContent='🔔';
  badge=document.createElement('span');badge.className='notify-badge';badge.hidden=true;
  panel=document.createElement('div');panel.className='notify-panel';panel.hidden=true;
  wrap.append(btn,badge,panel);actions.insertBefore(wrap,actions.querySelector('#login'));
  btn.onclick=async e=>{e.stopPropagation();panel.hidden=!panel.hidden;if(!panel.hidden)await renderPanel()};
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))panel.hidden=true});
  refreshBadge();setInterval(refreshBadge,30000);
  B.client.auth.onAuthStateChange(()=>setTimeout(refreshBadge,100));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();