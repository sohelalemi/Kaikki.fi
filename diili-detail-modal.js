(() => {
  const B = window.KaikkiBackend;
  if (!B?.enabled || !B?.client) return;

  const labels = {
    pending: 'Odottaa myyjää',
    accepted: 'Hyväksytty • Odottaa maksua',
    paid: 'Maksettu',
    shipped: 'Lähetetty',
    completed: 'Valmis',
    cancelled: 'Peruttu',
    rejected: 'Hylätty',
    disputed: 'Riita'
  };
  const hints = {
    pending: 'Myyjän hyväksyntää odotetaan.',
    accepted: 'Myyjä on hyväksynyt Diilin. Seuraava vaihe on maksu.',
    paid: 'Maksu on vahvistettu. Myyjä voi toimittaa tuotteen.',
    shipped: 'Tuote on merkitty lähetetyksi. Ostaja vahvistaa vastaanoton.',
    completed: 'Kauppa on valmis.',
    cancelled: 'Diili on peruttu.',
    rejected: 'Myyjä hylkäsi Diilin.',
    disputed: 'Diili on selvityksessä.'
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const euro = v => `${Number(v || 0).toLocaleString('fi-FI')} €`;

  const style = document.createElement('style');
  style.textContent = `
  #diiliDetailModal{position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.48);display:none;align-items:center;justify-content:center;padding:18px}
  #diiliDetailModal.show{display:flex}
  .diili-detail-panel{width:min(560px,96vw);max-height:88vh;overflow:auto;background:#fff;border-radius:22px;padding:20px;box-shadow:0 24px 70px rgba(15,23,42,.25)}
  .diili-detail-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.diili-detail-head h2{margin:0;font-size:23px}.diili-detail-close{width:38px;height:38px;border:0;border-radius:50%;background:#f1f5f9;color:#334155;font-size:23px;cursor:pointer}
  .diili-detail-product{display:grid;grid-template-columns:112px 1fr;gap:15px;align-items:center;padding:12px;border:1px solid #e5e7eb;border-radius:16px}.diili-detail-img{width:112px;height:112px;border-radius:13px;object-fit:cover;background:#f1f5f9}.diili-detail-fallback{width:112px;height:112px;border-radius:13px;background:#eef4ff;display:grid;place-items:center;font-size:38px}.diili-detail-title{font-size:19px;font-weight:900;color:#111827}.diili-detail-price{font-size:25px;font-weight:900;color:#1565d8;margin-top:6px}.diili-detail-sub{font-size:13px;color:#64748b;margin-top:4px}
  .diili-detail-status{margin-top:14px;padding:14px;border-radius:14px;background:#f8fafc;border:1px solid #e5e7eb}.diili-detail-badge{display:inline-block;padding:6px 10px;border-radius:999px;background:#eaf2ff;color:#1565d8;font-weight:800;font-size:12px}.diili-detail-status p{margin:8px 0 0;color:#475569;line-height:1.5}
  .diili-detail-people{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.diili-detail-box{padding:12px;border:1px solid #e5e7eb;border-radius:13px}.diili-detail-box small{display:block;color:#64748b;margin-bottom:4px}.diili-detail-box strong{color:#111827}
  .diili-detail-steps{margin-top:16px}.diili-detail-steps h3{margin:0 0 10px}.diili-step{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #eef2f7}.diili-step:last-child{border-bottom:0}.diili-step-dot{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#e5e7eb;color:#64748b;font-size:12px;font-weight:900;flex:0 0 24px}.diili-step.done .diili-step-dot{background:#1565d8;color:#fff}.diili-step.active .diili-step-dot{background:#dbeafe;color:#1565d8;border:2px solid #1565d8}.diili-step-copy b{display:block;font-size:14px}.diili-step-copy span{font-size:12px;color:#64748b}
  .diili-detail-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.diili-detail-actions button{flex:1;min-width:130px;padding:12px;border-radius:11px;border:0;background:#1565d8;color:#fff;font-weight:800;cursor:pointer}.diili-detail-actions .secondary{background:#eef4ff;color:#1565d8}.diili-detail-actions .danger{background:#fff;color:#dc2626;border:1px solid #fecaca}
  @media(max-width:560px){.diili-detail-product{grid-template-columns:82px 1fr}.diili-detail-img,.diili-detail-fallback{width:82px;height:82px}.diili-detail-people{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', '<div id="diiliDetailModal" aria-hidden="true"><div class="diili-detail-panel"><div id="diiliDetailContent"></div></div></div>');
  const modal = document.getElementById('diiliDetailModal');
  const content = document.getElementById('diiliDetailContent');
  const close = () => { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); };
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  function stepState(status){
    const order=['pending','accepted','paid','shipped','completed'];
    if (['cancelled','rejected','disputed'].includes(status)) return {index:-1, terminal:true};
    return {index:Math.max(0,order.indexOf(status)),terminal:false};
  }

  async function runAction(deal, kind){
    let name,args;
    if(kind==='accept'){name='seller_decide_deal';args={p_deal_id:deal.id,p_accept:true}}
    if(kind==='reject'){name='seller_decide_deal';args={p_deal_id:deal.id,p_accept:false}}
    if(kind==='cancel'){name='cancel_deal';args={p_deal_id:deal.id}}
    if(kind==='ship'){name='mark_deal_shipped';args={p_deal_id:deal.id}}
    if(kind==='received'){name='confirm_deal_received';args={p_deal_id:deal.id}}
    if(!name)return;
    const {error}=await B.client.rpc(name,args);if(error)throw error;
  }

  function actionButtons(deal,userId){
    const seller=deal.seller_id===userId,buyer=deal.buyer_id===userId,arr=[];
    if(seller&&deal.status==='pending')arr.push(['Hyväksy','accept',''],['Hylkää','reject','danger']);
    if(buyer&&['pending','accepted'].includes(deal.status))arr.push(['Peruuta','cancel','danger']);
    if(seller&&deal.status==='paid')arr.push(['Merkitse lähetetyksi','ship','']);
    if(buyer&&deal.status==='shipped')arr.push(['Vahvista vastaanotetuksi','received','']);
    return arr;
  }

  async function openById(id){
    content.innerHTML='<p>Ladataan Diiliä…</p>';modal.classList.add('show');modal.setAttribute('aria-hidden','false');
    try{
      const s=await B.session(); if(!s) throw new Error('Kirjaudu ensin sisään.');
      const {data:deal,error}=await B.client.from('deals').select('*').eq('id',id).single(); if(error)throw error;
      const {data:listing}=await B.client.from('listings').select('id,title,price,image_urls').eq('id',deal.listing_id).maybeSingle();
      const img=listing?.image_urls?.[0];
      const state=stepState(deal.status);
      const steps=[['Pyyntö','Diili lähetetty myyjälle'],['Hyväksyntä','Myyjä hyväksyy tai hylkää'],['Maksu','Maksu vahvistetaan'],['Toimitus','Myyjä toimittaa tuotteen'],['Valmis','Ostaja vahvistaa vastaanoton']];
      const stepHtml=steps.map((x,i)=>`<div class="diili-step ${!state.terminal&&i<state.index?'done':''} ${!state.terminal&&i===state.index?'active':''}"><div class="diili-step-dot">${!state.terminal&&i<state.index?'✓':i+1}</div><div class="diili-step-copy"><b>${x[0]}</b><span>${x[1]}</span></div></div>`).join('');
      const actions=actionButtons(deal,s.user.id);
      content.innerHTML=`<div class="diili-detail-head"><h2>🛡️ Kaikki Diili #${deal.id}</h2><button class="diili-detail-close" type="button">×</button></div><div class="diili-detail-product">${img?`<img class="diili-detail-img" src="${esc(img)}" alt="">`:'<div class="diili-detail-fallback">📦</div>'}<div><div class="diili-detail-title">${esc(listing?.title||`Ilmoitus #${deal.listing_id||'-'}`)}</div><div class="diili-detail-price">${euro(deal.amount||listing?.price)}</div><div class="diili-detail-sub">Ilmoitus #${deal.listing_id||'-'}</div></div></div><div class="diili-detail-status"><span class="diili-detail-badge">${esc(labels[deal.status]||deal.status)}</span><p>${esc(hints[deal.status]||'')}</p></div><div class="diili-detail-people"><div class="diili-detail-box"><small>Myyjä</small><strong>${deal.seller_id===s.user.id?'Sinä':esc(deal.seller_name||'Kaikki-käyttäjä')}</strong></div><div class="diili-detail-box"><small>Ostaja</small><strong>${deal.buyer_id===s.user.id?'Sinä':esc(deal.buyer_name||'Kaikki-käyttäjä')}</strong></div></div><div class="diili-detail-steps"><h3>Kaupan eteneminen</h3>${stepHtml}</div><div class="diili-detail-actions">${actions.map(([label,kind,cls])=>`<button type="button" data-diili-action="${kind}" class="${cls}">${label}</button>`).join('')}<button type="button" class="secondary" data-diili-close>Sulje</button></div>`;
      content.querySelector('.diili-detail-close').onclick=close;content.querySelector('[data-diili-close]').onclick=close;
      content.querySelectorAll('[data-diili-action]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await runAction(deal,b.dataset.diiliAction);close();document.querySelector('[data-account-tab="diili"]')?.click()}catch(e){alert(e?.message||'Toiminto epäonnistui.')}finally{b.disabled=false}});
    }catch(e){content.innerHTML=`<div class="diili-detail-head"><h2>Kaikki Diili</h2><button class="diili-detail-close" type="button">×</button></div><p>${esc(e?.message||'Diiliä ei voitu avata.')}</p>`;content.querySelector('.diili-detail-close').onclick=close;}
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('.diili-web-open'); if(!btn)return;
    const card=btn.closest('[data-diili-id]'); if(!card)return;
    e.preventDefault();e.stopImmediatePropagation();openById(card.dataset.diiliId);
  },true);
})();