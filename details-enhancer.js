(() => {
 const labels={type:'Tyyppi',brand:'Merkki',model:'Malli',material:'Materiaali',color:'Väri',dimensions:'Mitat',jobtype:'Työsuhde',company:'Työpaikka / yritys',pricing:'Hinnoittelu',area:'Pinta-ala / alue',priceRange:'Hintaluokka',rooms:'Huoneet',built:'Rakennusvuosi',address:'Osoite',fuel:'Polttoaine',year:'Vuosimalli',mileage:'Ajokilometrit',gearbox:'Vaihteisto'};
 const icons={type:'🏷️',brand:'🏢',model:'📱',material:'🧱',color:'🎨',dimensions:'📏',jobtype:'💼',company:'🏢',pricing:'💶',area:'📐',priceRange:'💰',rooms:'🚪',built:'🏗️',address:'📍',fuel:'⛽',year:'📅',mileage:'🛣️',gearbox:'⚙️'};
 function completeFactsMarkup(x){
  const ex=x.extra||{};
  const skip=new Set(['contact','amenities']);
  const rows=[];
  if(x.address&&!ex.address)rows.push(['📍','Osoite',x.address]);
  Object.entries(ex).forEach(([k,v])=>{if(skip.has(k)||v===null||v===undefined||v===''||Array.isArray(v))return;rows.push([icons[k]||'•',labels[k]||k,v])});
  if(!rows.length)return '';
  return `<section class="detail-all-info"><h3>Ilmoituksen tiedot</h3><div class="detail-info-grid">${rows.map(([i,l,v])=>`<div class="detail-info-row"><span>${i}</span><div><small>${escapeHtml(l)}</small><strong>${escapeHtml(v)}</strong></div></div>`).join('')}</div></section>`;
 }
 function completeAmenitiesMarkup(x){const a=Array.isArray(x.amenities)&&x.amenities.length?x.amenities:(Array.isArray(x.extra?.amenities)?x.extra.amenities:[]);return a.length?`<section class="detail-amenities"><h3>Varusteet ja ominaisuudet</h3><div class="amenity-chips">${a.map(v=>`<span>✓ ${escapeHtml(v)}</span>`).join('')}</div></section>`:''}
 function contactOf(x){return x.contact||x.extra?.contact||''}
 openDetails=function(id){
  ensureDetailsModal();const x=items.find(i=>i.id===id);if(!x)return;const contact=contactOf(x);
  document.querySelector('#detailsContent').innerHTML=`${galleryMarkup(x)}<span class="detail-cat">${escapeHtml(x.c)}${x.housingType?' · '+escapeHtml(x.housingType):''}</span><h2>${escapeHtml(x.t)}</h2><div class="detail-price">${priceText(x)}</div><div class="detail-facts"><span>📍 ${escapeHtml(x.city)}</span>${x.condition?`<span>✓ ${escapeHtml(x.condition)}</span>`:''}${x.housingType?`<span>🏠 ${escapeHtml(x.housingType)}</span>`:''}</div>${completeFactsMarkup(x)}${completeAmenitiesMarkup(x)}<section class="detail-presentation"><h3>Esittely</h3><p class="detail-desc">${escapeHtml(x.desc||'Ei kuvausta.')}</p></section>${contact?`<div class="seller-box"><strong>Myyjän yhteystieto</strong><span>${escapeHtml(contact)}</span></div>`:''}<button class="contact" id="contactBtn">Ota yhteyttä / Varaa</button>`;
  document.querySelectorAll('[data-gallery-index]').forEach(btn=>btn.onclick=()=>{const photos=itemPhotos(x),i=+btn.dataset.galleryIndex,main=document.querySelector('#detailMainImage');if(main&&photos[i])main.src=photos[i];document.querySelectorAll('.detail-thumb').forEach(t=>t.classList.toggle('active',t===btn));});
  document.querySelector('#contactBtn').onclick=()=>{if(window.KaikkiMessages?.open)window.KaikkiMessages.open(x);else alert(contact?'Myyjän yhteystieto: '+contact:'Kirjaudu sisään lähettääksesi viestin.')};
  const m=document.querySelector('#detailsModal');m.classList.add('show');m.setAttribute('aria-hidden','false');
 };
})();
