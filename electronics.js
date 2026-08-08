(() => {
  const subcategories = {
    Autot: [['Henkilöautot','🚗'],['Pakettiautot','🚐'],['Moottoripyörät','🏍️'],['Mopot & skootterit','🛵'],['Veneet','🛥️'],['Matkailuautot & vaunut','🚐'],['Renkaat & vanteet','🛞'],['Varaosat','⚙️'],['Autotarvikkeet','🧰'],['Muut ajoneuvot','🚜']],
    Koti: [['Sohvat & nojatuolit','🛋️'],['Pöydät & tuolit','🪑'],['Sängyt & patjat','🛏️'],['Kaapit & säilytys','🗄️'],['Valaisimet','💡'],['Kodinkoneet','🧺'],['Keittiö','🍽️'],['Sisustus','🖼️'],['Piha & puutarha','🌿'],['Työkalut','🛠️']],
    Elektroniikka: [['Puhelimet','📱'],['Tabletit','📲'],['Televisiot','📺'],['Tietokoneet','💻'],['Ääni & kuulokkeet','🎧'],['Kamerat','📷'],['Pelikonsolit','🎮'],['Älykellot','⌚'],['Tarvikkeet','🔌'],['Muu elektroniikka','🔋']],
    Vaatteet: [['Naisten vaatteet','👗'],['Miesten vaatteet','👔'],['Lasten vaatteet','🧒'],['Kengät','👟'],['Laukut','👜'],['Korut & kellot','💍'],['Urheiluvaatteet','🏃'],['Asusteet','🧢'],['Juhlavaatteet','✨'],['Muut vaatteet','👕']],
    Työt: [['Kuljetus & logistiikka','🚚'],['Rakennus','🏗️'],['Ravintola & hotelli','🍽️'],['Myynti & asiakaspalvelu','🛍️'],['Siivous','🧹'],['Hoito & terveys','🩺'],['IT & teknologia','💻'],['Toimisto','🗂️'],['Teollisuus','🏭'],['Muut työt','💼']],
    Palvelut: [['Muuttoapu','📦'],['Siivous','🧹'],['Remontti','🔨'],['Autopalvelut','🔧'],['Kuljetus','🚚'],['Kauneus & hyvinvointi','💇'],['Opetus & kurssit','📚'],['IT-apu','🖥️'],['Valokuvaus','📸'],['Muut palvelut','🧰']],
    Asunnot: [['Kerrostalo','🏢'],['Rivitalo','🏘️'],['Omakotitalo','🏡'],['Paritalo','🏠'],['Mökki','🌲'],['Tontti','📐'],['Autotalli & varasto','🚪'],['Liiketila','🏬'],['Huone','🛏️'],['Muu asunto','🏠']]
  };

  let subtypeFilter = '';

  const style = document.createElement('style');
  style.textContent = `
    .subcategory-panel{display:none;margin-top:14px;padding:16px;background:#fff;border:1px solid #e4e7eb;border-radius:16px}
    .subcategory-panel.show{display:block}
    .subcategory-panel h3{margin:0 0 12px;font-size:16px}
    .subcategory-chips{display:flex;gap:8px;flex-wrap:wrap}
    .subcategory-chips button{background:#f8fafc;color:#334155;border:1px solid #e2e8f0;padding:9px 12px;border-radius:999px;font-size:13px}
    .subcategory-chips button:hover,.subcategory-chips button.active{background:#1565d8;color:#fff;border-color:#1565d8}
    .subcategory-tag{display:inline-block;margin-top:8px;margin-left:6px;background:#eef4ff;color:#1565d8;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:800}
    .housing-choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .housing-choice{min-height:92px;border-radius:16px!important;font-size:17px!important;display:flex;align-items:center;justify-content:center;gap:8px;background:#f8fafc!important;color:#17202a!important;border:1px solid #dbe3ee!important}
    .housing-choice:hover,.housing-choice.active{background:#1565d8!important;color:#fff!important;border-color:#1565d8!important;box-shadow:0 8px 22px #1565d825}
    @media(max-width:700px){.subcategory-chips{gap:6px}.subcategory-chips button{font-size:12px;padding:8px 10px}.housing-choice-grid{grid-template-columns:1fr 1fr}.housing-choice{min-height:76px;font-size:15px!important}}
  `;
  document.head.appendChild(style);

  const categories = document.querySelector('.categories');
  const categorySelect = document.querySelector('#category');
  const housingWrap = document.querySelector('#housingTypeWrap');
  if (!categories || !categorySelect) return;

  const panel = document.createElement('div');
  panel.className = 'subcategory-panel';
  panel.id = 'subcategoryPanel';
  categories.insertAdjacentElement('afterend', panel);

  const subtypeWrap = document.createElement('label');
  subtypeWrap.id = 'subtypeWrap';
  subtypeWrap.innerHTML = `Alaluokka<select id="subtype"></select>`;
  if (housingWrap) housingWrap.insertAdjacentElement('afterend', subtypeWrap);
  const subtypeSelect = document.querySelector('#subtype');

  function currentTypes(){ return subcategories[categorySelect.value] || []; }
  function syncSubtypeForm(){
    const types = currentTypes();
    subtypeWrap.hidden = !types.length;
    subtypeSelect.innerHTML = types.map(([name]) => `<option value="${name}">${name}</option>`).join('');
  }
  categorySelect.addEventListener('change', syncSubtypeForm);
  syncSubtypeForm();

  function renderPanel(){
    if (filter === 'Asunnot') {
      panel.innerHTML = `<h3>Asunnot</h3><div class="housing-choice-grid"><button type="button" class="housing-choice ${housingFilter==='Myynti'?'active':''}" data-housing-choice="Myynti">🏡 Myytävät asunnot</button><button type="button" class="housing-choice ${housingFilter==='Vuokra'?'active':''}" data-housing-choice="Vuokra">🔑 Vuokra-asunnot</button></div>`;
      panel.classList.add('show');
      panel.querySelectorAll('[data-housing-choice]').forEach(btn => btn.onclick = () => {
        subtypeFilter = '';
        housingFilter = housingFilter === btn.dataset.housingChoice ? '' : btn.dataset.housingChoice;
        filter = 'Asunnot';
        render();
        document.querySelector('#latest')?.scrollIntoView({behavior:'smooth',block:'start'});
      });
      return;
    }
    const types = subcategories[filter] || [];
    if (!types.length){ panel.classList.remove('show'); panel.innerHTML=''; return; }
    panel.innerHTML = `<h3>${escapeHtml(filter)} – alaluokat</h3><div class="subcategory-chips">${types.map(([name,icon]) => `<button type="button" data-subtype="${name}" class="${subtypeFilter===name?'active':''}">${icon} ${name}</button>`).join('')}</div>`;
    panel.classList.add('show');
    panel.querySelectorAll('[data-subtype]').forEach(btn => btn.onclick = () => {
      subtypeFilter = subtypeFilter === btn.dataset.subtype ? '' : btn.dataset.subtype;
      render();
      document.querySelector('#latest')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  const oldRender = render;
  render = function(){
    oldRender();
    renderPanel();
    if (subtypeFilter) {
      document.querySelectorAll('#cards .card').forEach(card => {
        const item = items.find(x => x.id === card.dataset.id);
        if (!item || item.subtype !== subtypeFilter) card.style.display = 'none';
      });
      const visible = [...document.querySelectorAll('#cards .card')].some(card => card.style.display !== 'none');
      if (!visible) cards.innerHTML = '<p class="empty">Ei ilmoituksia tässä alaluokassa.</p>';
    }
    document.querySelectorAll('#cards .card').forEach(card => {
      const item = items.find(x => x.id === card.dataset.id);
      if (item?.subtype) {
        const body = card.querySelector('.card-body');
        const condition = body?.querySelector('.condition');
        if (condition && !body.querySelector('.subcategory-tag')) condition.insertAdjacentHTML('afterend', `<span class="subcategory-tag">${escapeHtml(item.subtype)}</span>`);
      }
    });
  };

  document.querySelectorAll('[data-cat]').forEach(btn => {
    const previous = btn.onclick;
    btn.onclick = e => {
      const oldFilter = filter;
      previous?.call(btn,e);
      if (filter !== oldFilter || filter !== btn.dataset.cat) subtypeFilter='';
      if (btn.dataset.cat === 'Asunnot' && filter === 'Asunnot') subtypeFilter='';
      render();
    };
  });

  const homeSale = document.querySelector('#homesSale');
  const homeRent = document.querySelector('#homesRent');
  [homeSale,homeRent].forEach(btn => { if(!btn) return; const old=btn.onclick; btn.onclick=e=>{subtypeFilter='';old?.call(btn,e);render();}; });

  const form = document.querySelector('#form');
  const oldSubmit = form.onsubmit;
  form.onsubmit = e => {
    const selectedCategory = categorySelect.value;
    const selectedSubtype = (subcategories[selectedCategory]||[]).length ? subtypeSelect.value : '';
    oldSubmit(e);
    const newest = items.find(x => x.id?.startsWith('user-') && x.c === selectedCategory && !x.subtype);
    if (newest && selectedSubtype) {
      newest.subtype = selectedSubtype;
      persist();
      filter = selectedCategory;
      subtypeFilter = selectedCategory === 'Asunnot' ? '' : selectedSubtype;
      render();
    }
    syncSubtypeForm();
  };

  const oldOpenDetails = openDetails;
  openDetails = function(id){
    oldOpenDetails(id);
    const item = items.find(x => x.id === id);
    if (item?.subtype) {
      const cat = document.querySelector('#detailsContent .detail-cat');
      if (cat && !cat.textContent.includes(item.subtype)) cat.textContent += ' · ' + item.subtype;
    }
  };

  const allBtn = document.querySelector('#all');
  const oldAll = allBtn.onclick;
  allBtn.onclick = e => { subtypeFilter=''; oldAll?.call(allBtn,e); render(); };

  render();
})();