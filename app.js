const items=[
{t:'iPhone 15 Pro 256GB',p:790,c:'Elektroniikka',city:'Lahti',icon:'📱'},
{t:'Sohva, hyvä kunto',p:180,c:'Koti',city:'Helsinki',icon:'🛋️'},
{t:'Toyota Yaris 2016',p:8450,c:'Autot',city:'Espoo',icon:'🚗'},
{t:'2h + k, vuokrataan',p:790,c:'Asunnot',city:'Lahti',icon:'🏠'},
{t:'Muuttoapu viikonloppuna',p:60,c:'Palvelut',city:'Vantaa',icon:'🧰'},
{t:'Varastotyöntekijä',p:0,c:'Työt',city:'Tampere',icon:'💼'}
];
let filter='';
const cards=document.querySelector('#cards');
function render(){
 const q=document.querySelector('#q').value.toLowerCase();
 const city=document.querySelector('#city').value;
 const list=items.filter(x=>(!filter||x.c===filter)&&(!q||x.t.toLowerCase().includes(q))&&(city==='Kaikki Suomi'||x.city===city));
 cards.innerHTML=list.map(x=>`<article class="card"><div class="photo">${x.icon}</div><div class="card-body"><h3>${x.t}</h3><div class="price">${x.p?x.p.toLocaleString('fi-FI')+' €':'Sopimuksen mukaan'}</div><div class="meta">${x.city} · ${x.c}</div><button class="reserve" onclick="alert('Varaus on MVP-demossa. Turvalliset maksut lisätään seuraavassa vaiheessa.')">Varaa / Ota yhteyttä</button></div></article>`).join('')||'<p>Ei tuloksia.</p>';
}
render();
document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{filter=filter===b.dataset.cat?'':b.dataset.cat;render()});
document.querySelector('#searchBtn').onclick=render;
document.querySelector('#all').onclick=()=>{filter='';document.querySelector('#q').value='';document.querySelector('#city').value='Kaikki Suomi';render()};
const modal=document.querySelector('#modal');
function openModal(){modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
function closeModal(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
document.querySelector('#sell').onclick=openModal;
document.querySelector('#homeBtn').onclick=()=>{openModal();document.querySelector('#category').value='Asunnot'};
document.querySelector('#close').onclick=closeModal;
modal.onclick=e=>{if(e.target===modal)closeModal()};
document.querySelector('#form').onsubmit=e=>{e.preventDefault();const title=document.querySelector('#title');const price=document.querySelector('#price');const category=document.querySelector('#category');const place=document.querySelector('#place');items.unshift({t:title.value,p:+price.value,c:category.value,city:place.value,icon:category.value==='Asunnot'?'🏠':'📦'});closeModal();filter='';render();e.target.reset();alert('Ilmoitus lisätty tähän demo-versioon!')};
const tr={
fi:{headline:'Kaikki mitä etsit, yhdestä paikasta.',sub:'Osta ja myy tavaroita sekä löydä koteja myyntiin ja vuokralle.'},
en:{headline:'Everything you need, in one place.',sub:'Buy and sell items and find homes for sale or rent.'},
fa:{headline:'هر چیزی که می‌خواهید، در یک جا.',sub:'خرید و فروش کالا و پیدا کردن خانه برای فروش یا اجاره.'},
ru:{headline:'Всё, что вам нужно, в одном месте.',sub:'Покупайте и продавайте товары, находите жильё для продажи и аренды.'}
};
document.querySelector('#lang').onchange=e=>{const a=tr[e.target.value];document.querySelector('#headline').textContent=a.headline;document.querySelector('#sub').textContent=a.sub;document.documentElement.dir=e.target.value==='fa'?'rtl':'ltr';document.documentElement.lang=e.target.value};
