const seedItems=[
{id:'seed-1',t:'iPhone 15 Pro 256GB',p:790,c:'Elektroniikka',city:'Lahti',icon:'📱',desc:'Hyväkuntoinen iPhone 15 Pro. Nouto Lahdesta.',condition:'Hyvä',created:Date.now()-1000*60*12},
{id:'seed-2',t:'Sohva, hyvä kunto',p:180,c:'Koti',city:'Helsinki',icon:'🛋️',desc:'Siisti kolmen istuttava sohva. Vain nouto.',condition:'Hyvä',created:Date.now()-1000*60*35},
{id:'seed-3',t:'Toyota Yaris 2016',p:8450,c:'Autot',city:'Espoo',icon:'🚗',desc:'Bensiinikäyttöinen Toyota Yaris, huollettu säännöllisesti.',condition:'Hyvä',created:Date.now()-1000*60*70},
{id:'seed-4',t:'2h + k, vuokrataan',p:790,c:'Asunnot',city:'Lahti',icon:'🏠',desc:'Kaksio Lahdessa. Vuokra 790 €/kk.',condition:'Hyvä',housingType:'Vuokra',created:Date.now()-1000*60*120},
{id:'seed-5',t:'Muuttoapu viikonloppuna',p:60,c:'Palvelut',city:'Vantaa',icon:'🧰',desc:'Muuttoapua viikonloppuisin pääkaupunkiseudulla.',condition:'Hyvä',created:Date.now()-1000*60*180},
{id:'seed-6',t:'Varastotyöntekijä',p:0,c:'Työt',city:'Tampere',icon:'💼',desc:'Haetaan varastotyöntekijää kokoaikaiseen työhön.',condition:'Hyvä',created:Date.now()-1000*60*240},
{id:'seed-7',t:'3h + k, myydään',p:189000,c:'Asunnot',city:'Helsinki',icon:'🏠',desc:'Kolmio Helsingissä. Hyvä sijainti ja parveke.',condition:'Hyvä',housingType:'Myynti',created:Date.now()-1000*60*150}
];
const savedItems=JSON.parse(localStorage.getItem('kaikki-items')||'[]');
let items=[...savedItems,...seedItems],filter='',housingFilter='',pendingPhoto='';
let favorites=new Set(JSON.parse(localStorage.getItem('kaikki-favorites')||'[]'));
const cards=document.querySelector('#cards');
function iconFor(c){return {Elektroniikka:'📱',Koti:'🛋️',Autot:'🚗',Vaatteet:'👕',Työt:'💼',Palvelut:'🧰',Asunnot:'🏠'}[c]||'📦'}
function priceText(x){return x.p?x.p.toLocaleString('fi-FI')+' €':'Sopimuksen mukaan'}
function escapeHtml(s=''){return String(s).replace(/[&<>'\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[m]))}
function persist(){localStorage.setItem('kaikki-items',JSON.stringify(items.filter(x=>!x.id.startsWith('seed-'))))}
function persistFavorites(){localStorage.setItem('kaikki-favorites',JSON.stringify([...favorites]))}
function mediaMarkup(x,detail=false){return x.photo?`<img class="listing-image${detail?' detail-image':''}" src="${x.photo}" alt="${escapeHtml(x.t)}">`:`<span class="listing-icon">${x.icon}</span>`}
function render(){
 const q=document.querySelector('#q').value.trim().toLowerCase();
 const city=document.querySelector('#city').value.trim().toLowerCase();
 const list=items.filter(x=>(!filter||x.c===filter)&&(!housingFilter||x.c==='Asunnot'&&x.housingType===housingFilter)&&(!q||(x.t+' '+x.desc+' '+x.city).toLowerCase().includes(q))&&(!city||x.city.toLowerCase().includes(city))).sort((a,b)=>(b.created||0)-(a.created||0));
 cards.innerHTML=list.map(x=>`<article class="card" data-id="${x.id}"><button class="fav ${favorites.has(x.id)?'active':''}" data-fav="${x.id}" aria-label="Suosikki">${favorites.has(x.id)?'♥':'♡'}</button><div class="photo" data-open="${x.id}">${mediaMarkup(x)}</div><div class="card-body" data-open="${x.id}"><h3>${escapeHtml(x.t)}</h3><div class="price">${priceText(x)}</div><div class="meta">${escapeHtml(x.city)} · ${escapeHtml(x.c)}${x.housingType?' · '+escapeHtml(x.housingType):''}</div>${x.condition?`<div class="condition">${escapeHtml(x.condition)}</div>`:''}<button class="reserve" data-open="${x.id}">Näytä ilmoitus</button></div></article>`).join('')||'<p class="empty">Ei tuloksia. Kokeile toista hakua tai kaupunkia.</p>';
 document.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>openDetails(el.dataset.open));
 document.querySelectorAll('[data-fav]').forEach(el=>el.onclick=e=>{e.stopPropagation();toggleFavorite(el.dataset.fav)});
 document.querySelectorAll('[data-cat]').forEach(b=>b.classList.toggle('active',b.dataset.cat===filter));
 document.querySelector('#homesSale').classList.toggle('active',housingFilter==='Myynti');
 document.querySelector('#homesRent').classList.toggle('active',housingFilter==='Vuokra');
}
function toggleFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);persistFavorites();render()}
function ensureDetailsModal(){if(document.querySelector('#detailsModal'))return;document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="detailsModal" aria-hidden="true"><div class="panel details-panel"><button class="close" id="detailsClose" aria-label="Close">×</button><div id="detailsContent"></div></div></div>`);const m=document.querySelector('#detailsModal');document.querySelector('#detailsClose').onclick=closeDetails;m.onclick=e=>{if(e.target===m)closeDetails()}}
function openDetails(id){
 ensureDetailsModal();const x=items.find(i=>i.id===id);if(!x)return;
 document.querySelector('#detailsContent').innerHTML=`<div class="detail-hero">${mediaMarkup(x,true)}</div><span class="detail-cat">${escapeHtml(x.c)}${x.housingType?' · '+escapeHtml(x.housingType):''}</span><h2>${escapeHtml(x.t)}</h2><div class="detail-price">${priceText(x)}</div><div class="detail-facts"><span>📍 ${escapeHtml(x.city)}</span>${x.condition?`<span>✓ ${escapeHtml(x.condition)}</span>`:''}</div><section class="detail-presentation"><h3>Esittely</h3><p class="detail-desc">${escapeHtml(x.desc||'Ei kuvausta.')}</p></section>${x.contact?`<div class="seller-box"><strong>Myyjän yhteystieto</strong><span>${escapeHtml(x.contact)}</span></div>`:''}<button class="contact" id="contactBtn">Ota yhteyttä / Varaa</button><p class="prototype-note">Turvallinen viestintä ja maksu lisätään backend-vaiheessa.</p>`;
 document.querySelector('#contactBtn').onclick=()=>alert(x.contact?'Yhteystieto näkyy ilmoituksessa. Sisäinen viestintä lisätään seuraavassa vaiheessa.':'Sisäinen viestintä ja varausmaksu lisätään seuraavassa vaiheessa.');const m=document.querySelector('#detailsModal');m.classList.add('show');m.setAttribute('aria-hidden','false')
}
function closeDetails(){const m=document.querySelector('#detailsModal');if(m){m.classList.remove('show');m.setAttribute('aria-hidden','true')}}
render();
document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{filter=filter===b.dataset.cat?'':b.dataset.cat;if(filter!=='Asunnot')housingFilter='';render()});
document.querySelector('#homesSale').onclick=()=>{filter='Asunnot';housingFilter=housingFilter==='Myynti'?'':'Myynti';render();document.querySelector('#latest').scrollIntoView({behavior:'smooth',block:'start'})};
document.querySelector('#homesRent').onclick=()=>{filter='Asunnot';housingFilter=housingFilter==='Vuokra'?'':'Vuokra';render();document.querySelector('#latest').scrollIntoView({behavior:'smooth',block:'start'})};
document.querySelector('#searchBtn').onclick=render;
document.querySelector('#q').addEventListener('keydown',e=>{if(e.key==='Enter')render()});
document.querySelector('#city').addEventListener('input',render);
document.querySelector('#city').addEventListener('keydown',e=>{if(e.key==='Enter')render()});
document.querySelector('#all').onclick=()=>{filter='';housingFilter='';document.querySelector('#q').value='';document.querySelector('#city').value='';render()};
const modal=document.querySelector('#modal');function openModal(){modal.classList.add('show');modal.setAttribute('aria-hidden','false')}function closeModal(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');resetPhoto()}
const categorySelect=document.querySelector('#category'),housingTypeWrap=document.querySelector('#housingTypeWrap');
function syncHousingType(){housingTypeWrap.hidden=categorySelect.value!=='Asunnot'}
categorySelect.onchange=syncHousingType;
document.querySelector('#sell').onclick=()=>{openModal();syncHousingType()};document.querySelector('#homeBtn').onclick=()=>{openModal();categorySelect.value='Asunnot';syncHousingType()};document.querySelector('#close').onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};
const photoInput=document.querySelector('#photos'),preview=document.querySelector('#photoPreview');
function resetPhoto(){pendingPhoto='';photoInput.value='';preview.hidden=true;preview.innerHTML=''}
photoInput.onchange=()=>{const f=photoInput.files[0];if(!f){resetPhoto();return}if(f.size>1100000){alert('Kuva on liian suuri tähän MVP-versioon. Valitse alle noin 1 MB kuva.');resetPhoto();return}const r=new FileReader();r.onload=()=>{pendingPhoto=r.result;preview.innerHTML=`<img src="${pendingPhoto}" alt="Esikatselu"><button type="button" id="removePhoto">Poista kuva</button>`;preview.hidden=false;document.querySelector('#removePhoto').onclick=resetPhoto};r.readAsDataURL(f)};
document.querySelector('#form').onsubmit=e=>{
 e.preventDefault();const title=document.querySelector('#title').value.trim(),price=+document.querySelector('#price').value,category=categorySelect.value,place=document.querySelector('#place').value.trim(),desc=document.querySelector('#desc').value.trim(),condition=document.querySelector('#condition').value,contact=document.querySelector('#contact').value.trim(),housingType=category==='Asunnot'?document.querySelector('#housingType').value:'';
 if(title.length<3||!place){alert('Täytä otsikko ja kaupunki.');return}
 const item={id:'user-'+Date.now(),t:title,p:price,c:category,city:place,icon:iconFor(category),photo:pendingPhoto,desc:desc||'Ei kuvausta.',condition,contact,housingType,created:Date.now()};
 try{items.unshift(item);persist()}catch(err){items.shift();alert('Kuvan tallennus ei onnistunut selaimen tilarajoituksen vuoksi. Kokeile pienempää kuvaa.');return}
 closeModal();filter=category==='Asunnot'?'Asunnot':'';housingFilter=housingType;render();e.target.reset();document.querySelector('#place').value='Lahti';syncHousingType();alert('Ilmoitus julkaistiin tässä MVP-versiossa!')
};
document.querySelector('#login').onclick=()=>alert('Kirjautuminen lisätään seuraavassa vaiheessa, kun backend ja käyttäjätilit otetaan käyttöön.');
const tr={fi:{headline:'Kaikki mitä etsit, yhdestä paikasta.',sub:'Osta ja myy tavaroita sekä löydä koteja myyntiin ja vuokralle.'},en:{headline:'Everything you need, in one place.',sub:'Buy and sell items and find homes for sale or rent.'},fa:{headline:'هر چیزی که می‌خواهید، در یک جا.',sub:'خرید و فروش کالا و پیدا کردن خانه برای فروش یا اجاره.'},ru:{headline:'Всё, что вам нужно, в одном месте.',sub:'Покупайте и продавайте товары, находите жильё для продажи и аренды.'}};
document.querySelector('#lang').onchange=e=>{const a=tr[e.target.value];document.querySelector('#headline').textContent=a.headline;document.querySelector('#sub').textContent=a.sub;document.documentElement.dir=e.target.value==='fa'?'rtl':'ltr';document.documentElement.lang=e.target.value};
