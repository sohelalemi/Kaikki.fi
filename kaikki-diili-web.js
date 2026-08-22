// Kaikki Diili for web listing details only.
(() => {
  let currentListingId=null,busy=false;
  const style=document.createElement('style');
  style.textContent=`.kaikki-diili-web-btn{width:100%;margin-top:8px;padding:12px 14px;border:0;border-radius:10px;background:#0f766e;color:#fff;font-size:14px;font-weight:800;cursor:pointer}.kaikki-diili-web-btn:disabled{opacity:.6;cursor:wait}.kaikki-diili-web-note{margin:8px 0 0;color:#64748b;font-size:13px;line-height:1.45}`;
  document.head.appendChild(style);

  function numericId(raw){const n=Number(String(raw||'').replace(/^db-/,''));return Number.isFinite(n)?n:null}
  document.addEventListener('click',e=>{const el=e.target.closest?.('[data-open]');if(el?.dataset?.open)currentListingId=el.dataset.open},true);

  async function sendDiiliRequest(button,rawId){
    if(busy)return;
    const id=numericId(rawId||currentListingId);
    if(!id){alert('Kaikki Diili toimii vain verkkopalveluun tallennetuissa ilmoituksissa.');return}
    const backend=window.KaikkiBackend;
    if(!backend?.enabled||!backend?.client){alert('Kaikki Diili ei ole vielä yhteydessä palvelimeen.');return}
    const session=await backend.session();
    if(!session){alert('Kirjaudu ensin sisään ja yritä uudelleen.');document.getElementById('login')?.click();return}
    busy=true;button.disabled=true;const old=button.textContent;button.textContent='Lähetetään…';
    try{
      const{data,error}=await backend.client.rpc('create_deal',{p_listing_id:id});if(error)throw error;
      button.textContent='✓ Diili lähetetty';
      alert('Kaikki Diili -pyyntö lähetettiin myyjälle.');
      window.dispatchEvent(new CustomEvent('kaikki:diili-created',{detail:data}));
    }catch(err){button.disabled=false;button.textContent=old;alert(err?.message||'Diili-pyyntöä ei voitu lähettää.')}finally{busy=false}
  }

  function makeButton(rawId){const b=document.createElement('button');b.type='button';b.className='kaikki-diili-web-btn';b.textContent='🛡️ Kaikki Diili';b.onclick=e=>{e.stopPropagation();sendDiiliRequest(b,rawId)};return b}

  function removeCardButtons(){
    document.querySelectorAll('.card .kaikki-diili-web-btn,.card .listing-diili').forEach(el=>el.remove());
  }

  function injectDetails(){
    const content=document.getElementById('detailsContent');
    if(!content||content.querySelector('#kaikkiDiiliWebBtn'))return;
    const modal=document.getElementById('detailsModal');
    if(modal&&!modal.classList.contains('show'))return;
    const actions=content.querySelector('.detail-listing-actions');
    const contact=content.querySelector('#contactBtn');
    const target=actions||contact?.parentElement||content;
    const btn=makeButton(currentListingId);btn.id='kaikkiDiiliWebBtn';target.appendChild(btn);
    const note=document.createElement('p');note.className='kaikki-diili-web-note';note.textContent='Myyjä hyväksyy pyynnön ennen maksua.';target.appendChild(note);
  }

  function inject(){removeCardButtons();injectDetails()}
  const observer=new MutationObserver(inject);observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',inject);setTimeout(inject,300);setTimeout(inject,1200);
})();
