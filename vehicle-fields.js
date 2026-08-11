(() => {
  const category = document.querySelector('#category');
  const form = document.querySelector('#form');
  if (!category || !form) return;

  const vehicleConfigs = {
    'Moottoripyörät': [
      ['Tyyppi','type',['Sport','Naked','Touring','Adventure','Cruiser','Enduro','Cross','Skootteri','Muu']],
      ['Merkki','brand',null],['Malli','model',null],['Vuosimalli','year',null],['Ajettu (km)','mileage',null],
      ['Moottoritilavuus (cm³)','engineCc',null],['Käyttövoima','fuel',['Bensiini','Sähkö','Muu']],['Vaihteisto','gearbox',['Manuaali','Automaatti']],
      ['Teho (kW)','powerKw',null]
    ],
    'Mopot & skootterit': [
      ['Tyyppi','type',['Mopo','Skootteri','Sähkömopo','Mopoauto','Muu']],
      ['Merkki','brand',null],['Malli','model',null],['Vuosimalli','year',null],['Ajettu (km)','mileage',null],
      ['Moottoritilavuus (cm³)','engineCc',null],['Käyttövoima','fuel',['Bensiini','Sähkö','Muu']]
    ],
    'Matkailuautot & vaunut': [
      ['Tyyppi','type',['Matkailuauto','Retkeilyauto','Asuntovaunu','Muu']],
      ['Merkki','brand',null],['Malli','model',null],['Vuosimalli','year',null],['Ajettu (km)','mileage',null],
      ['Käyttövoima','fuel',['Diesel','Bensiini','Hybridi','Sähkö','Muu']],['Vuodepaikat','beds',['1','2','3','4','5','6+']],
      ['Kokonaismassa (kg)','weightKg',null]
    ],
    'Paketti- ja kuorma-autot': [
      ['Tyyppi','type',['Pakettiauto','Kevyt kuorma-auto','Kuorma-auto','Vetoauto','Muu']],
      ['Merkki','brand',null],['Malli','model',null],['Vuosimalli','year',null],['Ajettu (km)','mileage',null],
      ['Käyttövoima','fuel',['Diesel','Bensiini','Hybridi','Sähkö','Muu']],['Vaihteisto','gearbox',['Manuaali','Automaatti']],
      ['Kokonaismassa (kg)','weightKg',null]
    ],
    'Työkoneet': [
      ['Tyyppi','type',['Kaivinkone','Pyöräkuormaaja','Traktori','Trukki','Nosturi','Metsäkone','Muu']],
      ['Merkki','brand',null],['Malli','model',null],['Vuosimalli','year',null],['Käyttötunnit (h)','hours',null],
      ['Käyttövoima','fuel',['Diesel','Bensiini','Sähkö','Muu']],['Paino (kg)','weightKg',null]
    ],
    'Veneet': [
      ['Venetyyppi','type',['Moottorivene','Purjevene','Soutuvene','RIB','Kalastusvene','Kanootti / kajakki','Muu']],
      ['Merkki','brand',null],['Malli','model',null],['Vuosimalli','year',null],['Pituus (m)','lengthM',null],
      ['Moottorityyppi','engineType',['Perämoottori','Sisämoottori','Sähkömoottori','Ei moottoria','Muu']],
      ['Moottorin teho (hv)','engineHp',null],['Moottorin käyttötunnit (h)','engineHours',null],['Polttoaine','fuel',['Bensiini','Diesel','Sähkö','Muu']]
    ],
    'Vesijetit': [
      ['Tyyppi','type',['Seisottava','Istuttava','Sport','Touring','Muu']],
      ['Merkki','brand',['Sea-Doo','Yamaha','Kawasaki','Muu']],['Malli','model',null],['Vuosimalli','year',null],
      ['Moottorin teho (hv)','engineHp',null],['Käyttötunnit (h)','engineHours',null]
    ],
    'Perävaunut': [
      ['Tyyppi','type',['Kevyt perävaunu','Autotraileri','Venetraileri','Hevostraileri','Lavetti','Asuntovaunu','Muu']],
      ['Merkki','brand',null],['Malli','model',null],['Vuosimalli','year',null],['Kokonaismassa (kg)','weightKg',null],
      ['Akseleita','axles',['1','2','3','4+']]
    ],
    'Muut ajoneuvot': [
      ['Ajoneuvotyyppi','type',['Mönkijä','Moottorikelkka','Golfauto','Karting','Erikoisajoneuvo','Muu']],
      ['Merkki','brand',null],['Malli','model',null],['Vuosimalli','year',null],['Ajettu (km)','mileage',null],
      ['Käyttötunnit (h)','hours',null],['Käyttövoima','fuel',['Bensiini','Diesel','Sähkö','Muu']]
    ]
  };

  const wrap = document.createElement('div');
  wrap.id = 'vehicleExtraFields';
  const anchor = document.querySelector('#categoryExtraFields') || document.querySelector('#subtype')?.closest('label') || category.closest('label');
  anchor?.insertAdjacentElement('afterend', wrap);

  const numericKeys = new Set(['year','mileage','engineCc','powerKw','weightKg','hours','lengthM','engineHp','engineHours']);
  const placeholders = {
    year:'Esim. 2022', mileage:'Esim. 45000', engineCc:'Esim. 650', powerKw:'Esim. 55', weightKg:'Esim. 3500',
    hours:'Esim. 1200', lengthM:'Esim. 6.5', engineHp:'Esim. 150', engineHours:'Esim. 320'
  };

  function fieldHtml([label,key,options], index) {
    let control;
    if (options) {
      control = `<select data-vehicle="${key}"><option value="">Valitse</option>${options.map(x=>`<option>${x}</option>`).join('')}</select>`;
    } else if (numericKeys.has(key)) {
      const step = key === 'lengthM' ? '0.1' : '1';
      control = `<input data-vehicle="${key}" type="number" min="0" step="${step}" placeholder="${placeholders[key]||label}">`;
    } else {
      control = `<input data-vehicle="${key}" placeholder="${label}">`;
    }
    return `${index%2===0?'<div class="form-row">':''}<label>${label}${control}</label>${index%2===1?' </div>':''}`;
  }

  function renderVehicleFields() {
    const config = vehicleConfigs[category.value];
    wrap.hidden = !config;
    wrap.innerHTML = config ? config.map(fieldHtml).join('') + (config.length%2 ? '</div>' : '') : '';
  }

  category.addEventListener('change', renderVehicleFields);
  renderVehicleFields();

  const previousSubmit = form.onsubmit;
  form.onsubmit = function(e) {
    const activeCategory = category.value;
    const config = vehicleConfigs[activeCategory];
    const values = {};
    if (config) wrap.querySelectorAll('[data-vehicle]').forEach(el => values[el.dataset.vehicle] = el.value.trim());
    previousSubmit?.call(form, e);
    if (config && !e.defaultPrevented && typeof items !== 'undefined') {
      const newest = items.find(x => x.id?.startsWith('user-') && x.c === activeCategory && !x.vehicleExtra);
      if (newest) {
        newest.vehicleExtra = values;
        if (typeof persist === 'function') persist();
        if (typeof render === 'function') render();
      }
    }
  };
})();