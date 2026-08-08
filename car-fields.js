(() => {
  const categorySelect = document.querySelector('#category');
  const housingWrap = document.querySelector('#housingTypeWrap');
  const form = document.querySelector('#form');
  if (!categorySelect || !form) return;

  const carModels = {
    'Audi':['A1','A3','A4','A5','A6','A7','A8','Q2','Q3','Q4 e-tron','Q5','Q7','Q8','e-tron','TT'],
    'BMW':['1-sarja','2-sarja','3-sarja','4-sarja','5-sarja','6-sarja','7-sarja','X1','X2','X3','X4','X5','X6','X7','i3','i4','i5','i7','iX'],
    'Chevrolet':['Aveo','Camaro','Captiva','Corvette','Cruze','Orlando','Spark','Trax'],
    'Citroën':['C1','C2','C3','C4','C5','C5 Aircross','Berlingo','Jumpy','Jumper'],
    'Dacia':['Duster','Jogger','Logan','Sandero','Spring'],
    'Fiat':['500','500X','Panda','Punto','Tipo','Doblo','Ducato'],
    'Ford':['Fiesta','Focus','Mondeo','Mustang','Puma','Kuga','S-Max','Galaxy','Ranger','Transit'],
    'Honda':['Accord','Civic','CR-V','HR-V','Jazz','e','ZR-V'],
    'Hyundai':['i10','i20','i30','i40','Ioniq','Ioniq 5','Ioniq 6','Kona','Santa Fe','Tucson'],
    'Jaguar':['E-Pace','F-Pace','F-Type','I-Pace','XE','XF','XJ'],
    'Jeep':['Avenger','Cherokee','Compass','Grand Cherokee','Renegade','Wrangler'],
    'Kia':['Ceed','Niro','Picanto','Rio','Sorento','Soul','Sportage','Stonic','EV3','EV6','EV9'],
    'Land Rover':['Defender','Discovery','Discovery Sport','Range Rover','Range Rover Evoque','Range Rover Sport','Range Rover Velar'],
    'Lexus':['CT','ES','GS','IS','LBX','NX','RX','RZ','UX'],
    'Mazda':['2','3','6','CX-3','CX-30','CX-5','CX-60','MX-5','MX-30'],
    'Mercedes-Benz':['A-sarja','B-sarja','C-sarja','E-sarja','S-sarja','CLA','CLS','GLA','GLB','GLC','GLE','GLS','EQA','EQB','EQC','EQE','EQS','Vito','Sprinter'],
    'Mini':['Cooper','Clubman','Countryman','Paceman'],
    'Mitsubishi':['ASX','Colt','Eclipse Cross','L200','Outlander','Space Star'],
    'Nissan':['Almera','Juke','Leaf','Micra','Note','Qashqai','X-Trail','Ariya','Primastar'],
    'Opel':['Astra','Corsa','Insignia','Mokka','Grandland','Crossland','Combo','Vivaro','Zafira'],
    'Peugeot':['107','108','206','207','208','2008','307','308','3008','407','508','5008','Partner','Expert','Boxer'],
    'Polestar':['1','2','3','4'],
    'Porsche':['718','911','Cayenne','Macan','Panamera','Taycan'],
    'Renault':['Captur','Clio','Kadjar','Kangoo','Megane','Scenic','Talisman','Trafic','Master','Zoe'],
    'Saab':['9-3','9-5','900','9000'],
    'Seat':['Arona','Ateca','Ibiza','Leon','Tarraco'],
    'Škoda':['Citigo','Fabia','Kamiq','Karoq','Kodiaq','Octavia','Rapid','Scala','Superb','Enyaq'],
    'Subaru':['BRZ','Forester','Impreza','Legacy','Outback','Solterra','XV'],
    'Suzuki':['Across','Ignis','Jimny','S-Cross','Swift','Vitara'],
    'Tesla':['Model 3','Model S','Model X','Model Y'],
    'Toyota':['Auris','Avensis','Aygo','bZ4X','C-HR','Camry','Corolla','Highlander','Hilux','Land Cruiser','Prius','Proace','RAV4','Yaris','Yaris Cross'],
    'Volkswagen':['Arteon','Caddy','Crafter','Golf','ID.3','ID.4','ID.5','ID.7','Passat','Polo','T-Cross','T-Roc','Tiguan','Touareg','Touran','Transporter','Up!'],
    'Volvo':['C30','C40','EX30','EX40','EX90','S40','S60','S80','S90','V40','V50','V60','V70','V90','XC40','XC60','XC70','XC90'],
    'Muu':[]
  };

  const wrap = document.createElement('div');
  wrap.id = 'vehicleFields';
  wrap.hidden = true;
  wrap.innerHTML = `
    <div class="form-row">
      <label>Merkki<select id="carMake"><option value="">Valitse merkki</option>${Object.keys(carModels).map(x=>`<option>${x}</option>`).join('')}</select></label>
      <label>Malli<select id="carModel" disabled><option value="">Valitse ensin merkki</option></select></label>
    </div>
    <div class="form-row">
      <label>Vuosimalli<input id="carYear" type="number" min="1900" max="2100" placeholder="Esim. 2020"></label>
      <label>Ajettu (km)<input id="carMileage" type="number" min="0" step="1" placeholder="Esim. 85000"></label>
    </div>
    <div class="form-row">
      <label>Polttoaine<select id="carFuel"><option value="">Valitse</option><option>Bensiini</option><option>Diesel</option><option>Hybridi</option><option>Lataushybridi</option><option>Sähkö</option><option>Kaasu</option><option>Muu</option></select></label>
      <label>Vaihteisto<select id="carTransmission"><option value="">Valitse</option><option>Automaatti</option><option>Manuaali</option></select></label>
    </div>`;
  if (housingWrap) housingWrap.insertAdjacentElement('afterend', wrap);
  else categorySelect.closest('.form-row')?.insertAdjacentElement('afterend', wrap);

  const makeSelect=wrap.querySelector('#carMake'), modelSelect=wrap.querySelector('#carModel');
  makeSelect.addEventListener('change',()=>{
    const models=carModels[makeSelect.value]||[];
    modelSelect.disabled=!makeSelect.value;
    modelSelect.innerHTML=`<option value="">${makeSelect.value==='Muu'?'Muu / määritä kuvauksessa':'Valitse malli'}</option>`+models.map(x=>`<option>${x}</option>`).join('');
  });

  const style = document.createElement('style');
  style.textContent = `.vehicle-specs{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.vehicle-specs span{background:#f3f6fa;border:1px solid #e3e8ef;border-radius:999px;padding:5px 8px;font-size:12px;color:#475569}.detail-vehicle{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:14px 0}.detail-vehicle span{background:#f8fafc;border:1px solid #e5eaf0;border-radius:12px;padding:10px;font-size:14px}@media(max-width:600px){.detail-vehicle{grid-template-columns:1fr}}`;
  document.head.appendChild(style);

  function syncVehicleFields(){ wrap.hidden = categorySelect.value !== 'Autot'; }
  categorySelect.addEventListener('change', syncVehicleFields);
  syncVehicleFields();

  const oldSubmit = form.onsubmit;
  form.onsubmit = e => {
    const isCar = categorySelect.value === 'Autot';
    const car = isCar ? {make:makeSelect.value,model:modelSelect.value,year:document.querySelector('#carYear').value.trim(),mileage:document.querySelector('#carMileage').value.trim(),fuel:document.querySelector('#carFuel').value,transmission:document.querySelector('#carTransmission').value} : null;
    if (isCar && (!car.make || (car.make!=='Muu'&&!car.model) || !car.year || !car.mileage)) { e.preventDefault(); alert('Täytä auton merkki, malli, vuosimalli ja ajokilometrit.'); return; }
    oldSubmit?.call(form, e);
    if (isCar) { const newest=items.find(x=>x.id?.startsWith('user-')&&x.c==='Autot'&&!x.vehicle); if(newest){newest.vehicle=car;persist();render();} }
    syncVehicleFields();
  };

  const oldRender = render;
  render = function(){ oldRender(); document.querySelectorAll('#cards .card').forEach(card=>{const item=items.find(x=>x.id===card.dataset.id);if(!item?.vehicle||card.querySelector('.vehicle-specs'))return;const body=card.querySelector('.card-body'),reserve=body?.querySelector('.reserve');if(!body||!reserve)return;const v=item.vehicle;reserve.insertAdjacentHTML('beforebegin',`<div class="vehicle-specs">${v.make||v.model?`<span>${escapeHtml([v.make,v.model].filter(Boolean).join(' '))}</span>`:''}${v.year?`<span>📅 ${escapeHtml(v.year)}</span>`:''}${v.mileage?`<span>🛣️ ${Number(v.mileage).toLocaleString('fi-FI')} km</span>`:''}${v.fuel?`<span>⛽ ${escapeHtml(v.fuel)}</span>`:''}${v.transmission?`<span>⚙️ ${escapeHtml(v.transmission)}</span>`:''}</div>`);}); };

  const oldOpenDetails = openDetails;
  openDetails = function(id){ oldOpenDetails(id);const item=items.find(x=>x.id===id);if(!item?.vehicle)return;const v=item.vehicle,desc=document.querySelector('#detailsContent .detail-desc');if(!desc||document.querySelector('#detailsContent .detail-vehicle'))return;desc.insertAdjacentHTML('beforebegin',`<div class="detail-vehicle">${v.make?`<span><strong>Merkki:</strong> ${escapeHtml(v.make)}</span>`:''}${v.model?`<span><strong>Malli:</strong> ${escapeHtml(v.model)}</span>`:''}${v.year?`<span><strong>Vuosimalli:</strong> ${escapeHtml(v.year)}</span>`:''}${v.mileage?`<span><strong>Ajettu:</strong> ${Number(v.mileage).toLocaleString('fi-FI')} km</span>`:''}${v.fuel?`<span><strong>Polttoaine:</strong> ${escapeHtml(v.fuel)}</span>`:''}${v.transmission?`<span><strong>Vaihteisto:</strong> ${escapeHtml(v.transmission)}</span>`:''}</div>`); };
  render();
})();