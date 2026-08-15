(() => {
  const B = window.KaikkiBackend;
  if (!B) return;

  const style = document.createElement('style');
  style.textContent = `
    .listing-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
    .listing-actions button{width:100%;margin:0}
    .listing-message{background:#eef4ff;color:#1565d8}
    .listing-reserve{background:#1565d8;color:#fff}
    .detail-listing-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
    .detail-listing-actions button{width:100%}
    @media(max-width:520px){.listing-actions,.detail-listing-actions{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);

  function byId(id){
    try { return items.find(x => String(x.id) === String(id)); }
    catch { return null; }
  }

  async function requireSession(){
    const session = await B.session();
    if (session) return session;
    document.querySelector('#login')?.click();
    return null;
  }

  async function reserveListing(listing){
    try {
      const session = await requireSession();
      if (!session) return;
      const sellerId = listing?.ownerId;
      const listingId = Number(listing?.dbId || String(listing?.id || '').replace(/^db-/,''));
      if (!sellerId || !Number.isFinite(listingId)) {
        alert('Tälle demoilmoitukselle ei voi vielä tehdä varausta.');
        return;
      }
      if (sellerId === session.user.id) {
        alert('Et voi varata omaa ilmoitustasi.');
        return;
      }
      const {data:existing,error:checkError} = await B.client
        .from('reservations')
        .select('id,status')
        .eq('listing_id',listingId)
        .eq('buyer_id',session.user.id)
        .in('status',['pending','accepted'])
        .limit(1);
      if (checkError) throw checkError;
      if (existing?.length) {
        alert(existing[0].status === 'accepted' ? 'Varaus on jo hyväksytty.' : 'Varauspyyntö on jo lähetetty.');
        return;
      }
      const {error} = await B.client.from('reservations').insert({
        listing_id: listingId,
        buyer_id: session.user.id,
        seller_id: sellerId,
        status: 'pending'
      });
      if (error) throw error;
      alert('Varauspyyntö lähetettiin myyjälle.');
    } catch (e) {
      alert(e?.message || 'Varauksen tekeminen epäonnistui.');
    }
  }

  async function messageListing(listing){
    if (!listing) return;
    if (window.KaikkiMessages?.open) {
      await window.KaikkiMessages.open(listing);
      return;
    }
    alert('Viestit eivät ole vielä käytettävissä.');
  }

  function addCardActions(){
    document.querySelectorAll('.card').forEach(card => {
      if (card.querySelector('.listing-actions')) return;
      const listing = byId(card.dataset.id);
      if (!listing) return;
      const body = card.querySelector('.card-body');
      if (!body) return;
      const wrap = document.createElement('div');
      wrap.className = 'listing-actions';
      const msg = document.createElement('button');
      msg.type = 'button'; msg.className = 'listing-message'; msg.textContent = '💬 Viesti';
      msg.onclick = e => { e.stopPropagation(); messageListing(listing); };
      const reserve = document.createElement('button');
      reserve.type = 'button'; reserve.className = 'listing-reserve'; reserve.textContent = 'Varaa';
      reserve.onclick = e => { e.stopPropagation(); reserveListing(listing); };
      wrap.append(msg,reserve);
      body.appendChild(wrap);
    });
  }

  function addDetailActions(){
    const content = document.querySelector('#detailsContent');
    if (!content || content.querySelector('.detail-listing-actions')) return;
    const modal = document.querySelector('#detailsModal');
    if (!modal?.classList.contains('show')) return;
    let listing = null;
    const title = content.querySelector('h2')?.textContent;
    try { listing = items.find(x => x.t === title); } catch {}
    if (!listing) return;

    // details-enhancer already creates contact/reserve controls. Hide both so
    // this module can render one consistent Viesti + Varaa action row only.
    const oldContact = content.querySelector('#contactBtn');
    const oldReserve = content.querySelector('#reserveBtn');
    if (oldContact) oldContact.style.display = 'none';
    if (oldReserve) oldReserve.style.display = 'none';
    const oldActions = oldContact?.parentElement;
    if (oldActions && oldActions === oldReserve?.parentElement) oldActions.style.display = 'none';
    const note = content.querySelector('.prototype-note');
    if (note) note.style.display = 'none';

    const wrap = document.createElement('div');
    wrap.className = 'detail-listing-actions';
    const msg = document.createElement('button');
    msg.type='button'; msg.className='listing-message'; msg.textContent='💬 Viesti';
    msg.onclick=()=>messageListing(listing);
    const reserve=document.createElement('button');
    reserve.type='button'; reserve.className='listing-reserve'; reserve.textContent='Varaa';
    reserve.onclick=()=>reserveListing(listing);
    wrap.append(msg,reserve);
    content.appendChild(wrap);
  }

  const observer = new MutationObserver(() => { addCardActions(); addDetailActions(); });
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{ if(e.target.closest?.('[data-open]')) setTimeout(addDetailActions,20); });
  addCardActions();
})();