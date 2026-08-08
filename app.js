const seedItems=[
{id:'seed-1',t:'iPhone 15 Pro 256GB',p:790,c:'Elektroniikka',city:'Lahti',icon:'📱',desc:'Hyväkuntoinen iPhone 15 Pro. Nouto Lahdesta.',created:Date.now()-1000*60*12},
{id:'seed-2',t:'Sohva, hyvä kunto',p:180,c:'Koti',city:'Helsinki',icon:'🛋️',desc:'Siisti kolmen istuttava sohva. Vain nouto.',created:Date.now()-1000*60*35},
{id:'seed-3',t:'Toyota Yaris 2016',p:8450,c:'Autot',city:'Espoo',icon:'🚗',desc:'Bensiinikäyttöinen Toyota Yaris, huollettu säännöllisesti.',created:Date.now()-1000*60*70},
{id:'seed-4',t:'2h + k, vuokrataan',p:790,c:'Asunnot',city:'Lahti',icon:'🏠',desc:'Kaksio Lahdessa. Vuokra 790 €/kk.',created:Date.now()-1000*60*120},
{id:'seed-5',t:'Muuttoapu viikonloppuna',p:60,c:'Palvelut',city:'Vantaa',icon:'🧰',desc:'Muuttoapua viikonloppuisin pääkaupunkiseudulla.',created:Date.now()-1000*60*180},
{id:'seed-6',t:'Varastotyöntekijä',p:0,c:'Työt',city:'Tampere',icon:'💼',desc:'Haetaan varastotyöntekijää kokoaikaiseen työhön.',created:Date.now()-1000*60*240}
];

const savedItems=JSON.parse(localStorage.getItem('kaikki-items')||'[]');
let items=[...savedItems,...seedItems];
let filter='';
let favorites=new Set(JSON.parse(localStorage.getItem('kaikki-favorites')||'[]'));
const cards=document.querySelector('#cards');

function iconFor(category){
 return {Elektroniikka:'📱',Koti:'🛋️',Autot:'🚗',Vaatteet:'👕',Työt:'💼',Palvelut:'🧰',Asunnot:'🏠'}[category]||'📦';
}
function priceText(x){return x.p?x.p.toLocaleString('fi-FI')+' €':'Sopimuksen mukaan'}
function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function persist(){localStorage.setItem('kaikki-items',JSON.stringify(items.filter(x=>!x.id.startsWith('seed-'))))}
function persistFavorites(){localStorage.setItem('kaikki-favorites',JSON.stringify([...favorites]))}

function render(){
 const q=document.querySelector('#q').value.trim().toLowerCase();
 const city=document.querySelector('#city').value;
 const list=items
   .filter(x=>(!filter||x.c===filter)&&(!q||(x.t+' '+x.desc).toLowerCase().includes(q))&&(city==='Kaikki Suomi'||x.city===city))
   .sort((a,b)=>(b.created||0)-(a.created||0));
 cards.innerHTML=list.map(x=>`<article class="card" data-id="${x.id}">
   <button class="fav ${favorites.has(x.id)?'active':''}" data-fav="${x.id}" aria-label="Suosikki">${favorites.has(x.id)?'♥':'♡'}</button>
   <div class="photo" data-open="${x.id}">${x.icon}</div>
   <div class="card-body" data-open="${x.id}"><h3>${escapeHtml(x.t)}</h3><div class="price">${priceText(x)}</div><div class="meta">${escapeHtml(x.city)} · ${escapeHtml(x.c)}</div><button class="reserve" data-open="${x.id}">Näytä ilmoitus</button></div>
 </article>`).join('')||'<p class="empty">Ei tuloksia. Kokeile toista hakua tai kaupunkia.</p>';
 document.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>openDetails(el.dataset.open));
 document.querySelectorAll('[data-fav]').forEach(el=>el.onclick=e=>{e.stopPropagation();toggleFavorite(el.dataset.fav)});
 document.querySelectorAll('[data-cat]').forEach(b=>b.classList.toggle('active',b.dataset.cat===filter));
}

function toggleFavorite(id){
 favorites.has(id)?favorites.delete(id):favorites.add(id);
 persistFavorites();
 render();
}

function ensureDetailsModal(){
 if(document.querySelector('#detailsModal'))return;
 document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="detailsModal" aria-hidden="true"><div class="panel details-panel"><button class="close" id="detailsClose" aria-label="Close">×</button><div id="detailsContent"></div></div></div>`);
 const m=document.querySelector('#detailsModal');
 document.querySelector('#detailsClose').onclick=()=>closeDetails();
 m.onclick=e=>{if(e.target===m)closeDetails()};
}
function openDetails(id){
 ensureDetailsModal();
 const x=items.find(i=>i.id===id); if(!x)return;
 document.querySelector('#detailsContent').innerHTML=`<div class="detail-hero">${x.icon}</div><span class="detail-cat">${escapeHtml(x.c)}</span><h2>${escapeHtml(x.t)}</h2><div class="detail-price">${priceText(x)}</div><p class="detail-location">📍 ${escapeHtml(x.city)}</p><p class="detail-desc">${escapeHtml(x.desc||'Ei kuvausta.')}</p><button class="contact" id="contactBtn">Ota yhteyttä / Varaa</button><p class="prototype-note">Maksut ja viestit lisätään seuraavassa backend-vaiheessa.</p>`;
 document.querySelector('#contactBtn').onclick=()=>alert('Tämä on vielä MVP-prototyyppi. Turvallinen viestintä ja varausmaksu lisätään seuraavassa vaiheessa.');
 const m=document.querySelector('#detailsModal');m.classList.add('show');m.setAttribute('aria-hidden','false');
}
function closeDetails(){const m=document.querySelector('#detailsModal');if(m){m.classList.remove('show');m.setAttribute('aria-hidden','true')}}

render();
document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{filter=filter===b.dataset.cat?'':b.dataset.cat;render()});
document.querySelector('#searchBtn').onclick=render;
document.querySelector('#q').addEventListener('keydown',e=>{if(e.key==='Enter')render()});
document.querySelector('#city').onchange=render;
document.querySelector('#all').onclick=()=>{filter='';document.querySelector('#q').value='';document.querySelector('#city').value='Kaikki Suomi';render()};

const modal=document.querySelector('#modal');
function openModal(){modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
function closeModal(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
document.querySelector('#sell').onclick=openModal;
document.querySelector('#homeBtn').onclick=()=>{openModal();document.querySelector('#category').value='Asunnot'};
document.querySelector('#close').onclick=closeModal;
modal.onclick=e=>{if(e.target===modal)closeModal()};

document.querySelector('#form').onsubmit=e=>{
 e.preventDefault();
 const title=document.querySelector('#title');
 const price=document.querySelector('#price');
 const category=document.querySelector('#category');
 const place=document.querySelector('#place');
 const desc=document.querySelector('#desc');
 const item={id:'user-'+Date.now(),t:title.value.trim(),p:+price.value,c:category.value,city:place.value.trim(),icon:iconFor(category.value),desc:desc.value.trim()||'Ei kuvausta.',created:Date.now()};
 items.unshift(item);persist();closeModal();filter='';render();e.target.reset();document.querySelector('#place').value='Lahti';alert('Ilmoitus tallennettiin tähän selaimeen!');
};

document.querySelector('#login').onclick=()=>alert('Kirjautuminen lisätään seuraavassa vaiheessa, kun backend ja käyttäjätilit otetaan käyttöön.');

const tr={
fi:{headline:'Kaikki mitä etsit, yhdestä paikasta.',sub:'Osta ja myy tavaroita sekä löydä koteja myyntiin ja vuokralle.'},
en:{headline:'Everything you need, in one place.',sub:'Buy and sell items and find homes for sale or rent.'},
fa:{headline:'هر چیزی که می‌خواهید، در یک جا.',sub:'خرید و فروش کالا و پیدا کردن خانه برای فروش یا اجاره.'},
ru:{headline:'Всё, что вам нужно, в одном месте.',sub:'Покупайте и продавайте товары, находите жильё для продажи и аренды.'}
};
document.querySelector('#lang').onchange=e=>{const a=tr[e.target.value];document.querySelector('#headline').textContent=a.headline;document.querySelector('#sub').textContent=a.sub;document.documentElement.dir=e.target.value==='fa'?'rtl':'ltr';document.documentElement.lang=e.target.value};
