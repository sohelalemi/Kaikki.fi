(() => {
 const minP=document.querySelector('#housingMinPrice'),maxP=document.querySelector('#housingMaxPrice'),minA=document.querySelector('#housingMinArea'),maxA=document.querySelector('#housingMaxArea'),rooms=document.querySelector('#housingRooms'),ptype=document.querySelector('#housingPropertyType');
 if(!minP||!maxP||!minA||!maxA||!rooms||!ptype)return;
 const baseRender=render;
 const parseArea=v=>{if(!v)return 0;const m=String(v).match(/\d+/g);if(!m)return 0;return m.length>1?(+m[0]+ +m[1])/2:+m[0]};
 const originalItemsFilter=()=>{
  const q=document.querySelector('#q').value.trim().toLowerCase(), city=document.querySelector('#city').value.trim().toLowerCase();
  const minPrice=+minP.value||0,maxPrice=+maxP.value||Infinity,minArea=+minA.value||0,maxArea=+maxA.value||Infinity,room=rooms.value,type=ptype.value;
  return items.filter(x=>(!filter||x.c===filter)&&(!housingFilter||x.c==='Asunnot'&&x.housingType===housingFilter)&&(!q||(x.t+' '+x.desc+' '+x.city).toLowerCase().includes(q))&&(!city||x.city.toLowerCase().includes(city))&&(x.c!=='Asunnot'||((x.p||0)>=minPrice&&(x.p||0)<=maxPrice&&parseArea(x.extra?.area)>=minArea&&parseArea(x.extra?.area)<=maxArea&&(!room||x.extra?.rooms===room)&&(!type||x.subtype===type||x.extra?.propertyType===type)))).sort((a,b)=>(b.created||0)-(a.created||0));
 };
 render=function(){
  const list=originalItemsFilter();
  cards.innerHTML=list.map(x=>`<article class="card" data-id="${x.id}"><button class="fav ${favorites.has(x.id)?'active':''}" data-fav="${x.id}" aria-label="Suosikki">${favorites.has(x.id)?'♥':'♡'}</button><div class="photo" data-open="${x.id}">${mediaMarkup(x)}</div><div class="card-body" data-open="${x.id}"><h3>${escapeHtml(x.t)}</h3><div class="price">${priceText(x)}</div><div class="meta">${escapeHtml(x.city)} · ${escapeHtml(x.c)}${x.housingType?' · '+escapeHtml(x.housingType):''}${x.extra?.area?' · '+escapeHtml(x.extra.area):''}</div>${x.condition?`<div class="condition">${escapeHtml(x.condition)}</div>`:''}<button class="reserve" data-open="${x.id}">Näytä ilmoitus</button></div></article>`).join('')||'<p class="empty">Ei tuloksia. Kokeile toista hakua tai muuta suodattimia.</p>';
  document.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>openDetails(el.dataset.open));
  document.querySelectorAll('[data-fav]').forEach(el=>el.onclick=e=>{e.stopPropagation();toggleFavorite(el.dataset.fav)});
  document.querySelectorAll('[data-cat]').forEach(b=>b.classList.toggle('active',b.dataset.cat===filter));
  document.querySelector('#homesSale').classList.toggle('active',housingFilter==='Myynti');document.querySelector('#homesRent').classList.toggle('active',housingFilter==='Vuokra');
 };
 const baseOpen=openDetails;
 openDetails=function(id){baseOpen(id);const x=items.find(i=>i.id===id);if(!x||x.c!=='Asunnot'||!x.extra)return;const target=document.querySelector('#detailsContent .detail-presentation');if(!target)return;const facts=document.createElement('div');facts.className='detail-facts';facts.style.margin='12px 0';facts.innerHTML=`${x.extra.area?`<span>📐 ${escapeHtml(x.extra.area)}</span>`:''}${x.extra.rooms?`<span>🚪 ${escapeHtml(x.extra.rooms)} huonetta</span>`:''}${x.extra.built?`<span>🏗️ ${escapeHtml(x.extra.built)}</span>`:''}${x.extra.address?`<span>📍 ${escapeHtml(x.extra.address)}</span>`:''}`;target.parentNode.insertBefore(facts,target);};
 document.querySelector('#applyHousingFilters').onclick=()=>{filter='Asunnot';render();document.querySelector('#latest').scrollIntoView({behavior:'smooth',block:'start'})};
 [minP,maxP,minA,maxA,rooms,ptype].forEach(el=>el.addEventListener('change',()=>{if(filter==='Asunnot')render()}));
 document.querySelector('#clearHousingFilters').onclick=()=>{[minP,maxP,minA,maxA].forEach(x=>x.value='');rooms.value='';ptype.value='';render()};
 const form=document.querySelector('#form');let captured=null;
 form.addEventListener('submit',()=>{if(document.querySelector('#category').value!=='Asunnot')return;captured={};document.querySelectorAll('#categoryExtraFields [data-extra]').forEach(x=>captured[x.dataset.extra]=x.value.trim());captured.propertyType=document.querySelector('#subtype')?.value||'';},true);
 form.addEventListener('submit',()=>{setTimeout(()=>{if(!captured)return;const newest=items.find(x=>x.id?.startsWith('user-')&&x.c==='Asunnot'&&!x.extra);if(newest){newest.extra=captured;newest.subtype=captured.propertyType;persist();render()}captured=null;},0)});
})();