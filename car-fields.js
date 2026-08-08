(() => {
  const categorySelect = document.querySelector('#category');
  const housingWrap = document.querySelector('#housingTypeWrap');
  const form = document.querySelector('#form');
  if (!categorySelect || !form) return;

  const wrap = document.createElement('div');
  wrap.id = 'vehicleFields';
  wrap.hidden = true;
  wrap.innerHTML = `
    <div class="form-row">
      <label>Merkki<input id="carMake" maxlength="50" placeholder="Esim. Toyota"></label>
      <label>Malli<input id="carModel" maxlength="50" placeholder="Esim. Corolla"></label>
    </div>
    <div class="form-row">
      <label>Vuosimalli<input id="carYear" type="number" min="1900" max="2100" placeholder="Esim. 2020"></label>
      <label>Ajettu (km)<input id="carMileage" type="number" min="0" step="1" placeholder="Esim. 85000"></label>
    </div>
    <div class="form-row">
      <label>Polttoaine<select id="carFuel"><option value="">Valitse</option><option>Bensiini</option><option>Diesel</option><option>Hybridi</option><option>Sähkö</option><option>Kaasu</option><option>Muu</option></select></label>
      <label>Vaihteisto<select id="carTransmission"><option value="">Valitse</option><option>Automaatti</option><option>Manuaali</option></select></label>
    </div>`;
  if (housingWrap) housingWrap.insertAdjacentElement('afterend', wrap);
  else categorySelect.closest('.form-row')?.insertAdjacentElement('afterend', wrap);

  const style = document.createElement('style');
  style.textContent = `.vehicle-specs{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.vehicle-specs span{background:#f3f6fa;border:1px solid #e3e8ef;border-radius:999px;padding:5px 8px;font-size:12px;color:#475569}.detail-vehicle{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:14px 0}.detail-vehicle span{background:#f8fafc;border:1px solid #e5eaf0;border-radius:12px;padding:10px;font-size:14px}@media(max-width:600px){.detail-vehicle{grid-template-columns:1fr}}`;
  document.head.appendChild(style);

  function syncVehicleFields(){ wrap.hidden = categorySelect.value !== 'Autot'; }
  categorySelect.addEventListener('change', syncVehicleFields);
  syncVehicleFields();

  const oldSubmit = form.onsubmit;
  form.onsubmit = e => {
    const isCar = categorySelect.value === 'Autot';
    const car = isCar ? {
      make: document.querySelector('#carMake').value.trim(),
      model: document.querySelector('#carModel').value.trim(),
      year: document.querySelector('#carYear').value.trim(),
      mileage: document.querySelector('#carMileage').value.trim(),
      fuel: document.querySelector('#carFuel').value,
      transmission: document.querySelector('#carTransmission').value
    } : null;
    if (isCar && (!car.make || !car.model || !car.year || !car.mileage)) {
      e.preventDefault();
      alert('Täytä auton merkki, malli, vuosimalli ja ajokilometrit.');
      return;
    }
    oldSubmit?.call(form, e);
    if (isCar) {
      const newest = items.find(x => x.id?.startsWith('user-') && x.c === 'Autot' && !x.vehicle);
      if (newest) {
        newest.vehicle = car;
        persist();
        render();
      }
    }
    syncVehicleFields();
  };

  const oldRender = render;
  render = function(){
    oldRender();
    document.querySelectorAll('#cards .card').forEach(card => {
      const item = items.find(x => x.id === card.dataset.id);
      if (!item?.vehicle || card.querySelector('.vehicle-specs')) return;
      const body = card.querySelector('.card-body');
      const reserve = body?.querySelector('.reserve');
      if (!body || !reserve) return;
      const v = item.vehicle;
      const html = `<div class="vehicle-specs">${v.make||v.model?`<span>${escapeHtml([v.make,v.model].filter(Boolean).join(' '))}</span>`:''}${v.year?`<span>📅 ${escapeHtml(v.year)}</span>`:''}${v.mileage?`<span>🛣️ ${Number(v.mileage).toLocaleString('fi-FI')} km</span>`:''}${v.fuel?`<span>⛽ ${escapeHtml(v.fuel)}</span>`:''}${v.transmission?`<span>⚙️ ${escapeHtml(v.transmission)}</span>`:''}</div>`;
      reserve.insertAdjacentHTML('beforebegin', html);
    });
  };

  const oldOpenDetails = openDetails;
  openDetails = function(id){
    oldOpenDetails(id);
    const item = items.find(x => x.id === id);
    if (!item?.vehicle) return;
    const v = item.vehicle;
    const desc = document.querySelector('#detailsContent .detail-desc');
    if (!desc || document.querySelector('#detailsContent .detail-vehicle')) return;
    desc.insertAdjacentHTML('beforebegin', `<div class="detail-vehicle">${v.make?`<span><strong>Merkki:</strong> ${escapeHtml(v.make)}</span>`:''}${v.model?`<span><strong>Malli:</strong> ${escapeHtml(v.model)}</span>`:''}${v.year?`<span><strong>Vuosimalli:</strong> ${escapeHtml(v.year)}</span>`:''}${v.mileage?`<span><strong>Ajettu:</strong> ${Number(v.mileage).toLocaleString('fi-FI')} km</span>`:''}${v.fuel?`<span><strong>Polttoaine:</strong> ${escapeHtml(v.fuel)}</span>`:''}${v.transmission?`<span><strong>Vaihteisto:</strong> ${escapeHtml(v.transmission)}</span>`:''}</div>`);
  };

  render();
})();