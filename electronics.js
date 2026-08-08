(() => {
  const electronicsTypes = [
    ['Puhelimet','📱'],
    ['Tabletit','📲'],
    ['Televisiot','📺'],
    ['Tietokoneet','💻'],
    ['Ääni & kuulokkeet','🎧'],
    ['Kamerat','📷'],
    ['Pelikonsolit','🎮'],
    ['Älykellot','⌚'],
    ['Tarvikkeet','🔌'],
    ['Muu elektroniikka','🔋']
  ];

  let electronicsFilter = '';

  const style = document.createElement('style');
  style.textContent = `
    .electronics-subcats{display:none;margin-top:14px;padding:16px;background:#fff;border:1px solid #e4e7eb;border-radius:16px}
    .electronics-subcats.show{display:block}
    .electronics-subcats h3{margin:0 0 12px;font-size:16px}
    .electronics-chips{display:flex;gap:8px;flex-wrap:wrap}
    .electronics-chips button{background:#f8fafc;color:#334155;border:1px solid #e2e8f0;padding:9px 12px;border-radius:999px;font-size:13px}
    .electronics-chips button:hover,.electronics-chips button.active{background:#1565d8;color:#fff;border-color:#1565d8}
    .electronics-type{display:inline-block;margin-top:8px;margin-left:6px;background:#eef4ff;color:#1565d8;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:800}
    @media(max-width:700px){.electronics-chips{gap:6px}.electronics-chips button{font-size:12px;padding:8px 10px}}
  `;
  document.head.appendChild(style);

  const categories = document.querySelector('.categories');
  if (!categories) return;

  const panel = document.createElement('div');
  panel.className = 'electronics-subcats';
  panel.id = 'electronicsSubcats';
  panel.innerHTML = `<h3>Elektroniikan alaluokat</h3><div class="electronics-chips">${electronicsTypes.map(([name,icon]) => `<button type="button" data-electronics="${name}">${icon} ${name}</button>`).join('')}</div>`;
  categories.insertAdjacentElement('afterend', panel);

  const categorySelect = document.querySelector('#category');
  const housingWrap = document.querySelector('#housingTypeWrap');
  const electronicsWrap = document.createElement('label');
  electronicsWrap.id = 'electronicsTypeWrap';
  electronicsWrap.hidden = true;
  electronicsWrap.innerHTML = `Elektroniikan tyyppi<select id="electronicsType">${electronicsTypes.map(([name]) => `<option value="${name}">${name}</option>`).join('')}</select>`;
  if (housingWrap) housingWrap.insertAdjacentElement('afterend', electronicsWrap);

  function syncElectronicsForm(){
    electronicsWrap.hidden = categorySelect.value !== 'Elektroniikka';
  }
  categorySelect.addEventListener('change', syncElectronicsForm);
  syncElectronicsForm();

  const oldRender = render;
  render = function(){
    oldRender();
    const isElectronics = filter === 'Elektroniikka';
    panel.classList.toggle('show', isElectronics);
    document.querySelectorAll('[data-electronics]').forEach(btn => btn.classList.toggle('active', btn.dataset.electronics === electronicsFilter));
    if (isElectronics && electronicsFilter) {
      document.querySelectorAll('#cards .card').forEach(card => {
        const item = items.find(x => x.id === card.dataset.id);
        if (!item || item.electronicsType !== electronicsFilter) card.style.display = 'none';
      });
      const visible = [...document.querySelectorAll('#cards .card')].some(card => card.style.display !== 'none');
      if (!visible) cards.innerHTML = '<p class="empty">Ei ilmoituksia tässä elektroniikan alaluokassa.</p>';
    }
    document.querySelectorAll('#cards .card').forEach(card => {
      const item = items.find(x => x.id === card.dataset.id);
      if (item?.electronicsType) {
        const body = card.querySelector('.card-body');
        const condition = body?.querySelector('.condition');
        if (condition && !body.querySelector('.electronics-type')) condition.insertAdjacentHTML('afterend', `<span class="electronics-type">${escapeHtml(item.electronicsType)}</span>`);
      }
    });
  };

  document.querySelectorAll('[data-electronics]').forEach(btn => {
    btn.onclick = () => {
      filter = 'Elektroniikka';
      housingFilter = '';
      electronicsFilter = electronicsFilter === btn.dataset.electronics ? '' : btn.dataset.electronics;
      render();
      document.querySelector('#latest')?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  });

  document.querySelectorAll('[data-cat]').forEach(btn => {
    const previous = btn.onclick;
    btn.onclick = e => {
      previous?.call(btn,e);
      if (btn.dataset.cat === 'Elektroniikka') {
        if (filter !== 'Elektroniikka') electronicsFilter = '';
      } else {
        electronicsFilter = '';
      }
      render();
    };
  });

  const form = document.querySelector('#form');
  const oldSubmit = form.onsubmit;
  form.onsubmit = e => {
    const selectedCategory = categorySelect.value;
    const selectedType = selectedCategory === 'Elektroniikka' ? document.querySelector('#electronicsType').value : '';
    oldSubmit(e);
    if (selectedCategory === 'Elektroniikka') {
      const newest = items.find(x => x.id?.startsWith('user-') && x.c === 'Elektroniikka' && !x.electronicsType);
      if (newest) {
        newest.electronicsType = selectedType;
        persist();
        electronicsFilter = selectedType;
        filter = 'Elektroniikka';
        render();
      }
    }
    syncElectronicsForm();
  };

  const oldOpenDetails = openDetails;
  openDetails = function(id){
    oldOpenDetails(id);
    const item = items.find(x => x.id === id);
    if (item?.electronicsType) {
      const cat = document.querySelector('#detailsContent .detail-cat');
      if (cat) cat.textContent += ' · ' + item.electronicsType;
    }
  };

  const allBtn = document.querySelector('#all');
  const oldAll = allBtn.onclick;
  allBtn.onclick = e => { electronicsFilter=''; oldAll?.call(allBtn,e); render(); };

  render();
})();