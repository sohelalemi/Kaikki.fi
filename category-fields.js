(() => {
 const cat=document.querySelector('#category'), sub=document.querySelector('#subtype'), form=document.querySelector('#form'); if(!cat||!sub||!form)return;
 const homeTypes={
  'Sohvat & nojatuolit':['Sohva','Kulmasohva','Vuodesohva','Nojatuoli','Rahi','Sohvaryhmä','Muu'],
  'Pöydät & tuolit':['Ruokapöytä','Sohvapöytä','Työpöytä','Sivupöytä','Ruokatuoli','Toimistotuoli','Baarijakkara','Muu'],
  'Sängyt & patjat':['Sänky','Jenkkisänky','Runkopatja','Patja','Lastensänky','Kerrossänky','Sängynpääty','Muu'],
  'Kaapit & säilytys':['Vaatekaappi','Lipasto','Hylly','TV-taso','Kenkäkaappi','Vitriini','Säilytyslaatikko','Muu'],
  'Valaisimet':['Kattovalaisin','Pöytävalaisin','Lattiavalaisin','Seinävalaisin','Ulkovalaisin','LED-valaisin','Muu'],
  'Kodinkoneet':['Jääkaappi','Pakastin','Pyykinpesukone','Kuivausrumpu','Astianpesukone','Liesi','Uuni','Mikroaaltouuni','Imuri','Muu'],
  'Keittiö':['Keittiökalusteet','Keittiökaapit','Työtaso','Ruokailuvälineet','Astiat','Kattilat & pannut','Kahvinkeitin','Vedenkeitin','Leivänpaahdin','Tehosekoitin','Muu keittiötarvike'],
  'Sisustus':['Matto','Verhot','Peili','Taulu','Koriste-esine','Tyyny','Peitto','Kello','Muu'],
  'Piha & puutarha':['Puutarhakalusteet','Grilli','Ruohonleikkuri','Trimmeri','Kukkaruukku','Puutarhatyökalu','Kasvihuone','Muu'],
  'Työkalut':['Porakone','Saha','Hiomakone','Kompressori','Käsityökalu','Mittalaite','Työkalusarja','Muu']
 };
 const configs={
  Elektroniikka:{fields:[['Merkki','brand',['Apple','Samsung','Sony','LG','Huawei','Xiaomi','OnePlus','Nokia','Lenovo','Asus','Acer','HP','Dell','Microsoft','Canon','Nikon','JBL','Bose','Muu']],['Malli','model',null]]},
  Koti:{fields:[['Tyyppi','type','__HOME_TYPES__'],['Materiaali','material',['Puu','Metalli','Lasi','Muovi','Nahka','Kangas','MDF','Muu']],['Väri','color',['Musta','Valkoinen','Harmaa','Ruskea','Beige','Sininen','Vihreä','Punainen','Keltainen','Muu']],['Mitat','dimensions',null]]},
  Työt:{fields:[['Työsuhde','jobtype',['Kokoaikainen','Osa-aikainen','Keikkatyö','Määräaikainen','Vakituinen']],['Työpaikka / yritys','company',null]]},
  Palvelut:{fields:[['Hinnoittelu','pricing',['Kiinteä hinta','Tuntihinta','Sopimuksen mukaan']],['Palvelualue','area',null]]},
  Asunnot:{fields:[['Pinta-ala (m²)','area',null],['Huoneet','rooms',['1','2','3','4','5','6+']],['Rakennusvuosi','built',null]]}
 };
 const wrap=document.createElement('div');wrap.id='categoryExtraFields';sub.closest('label').insertAdjacentElement('afterend',wrap);
 function optionsFor(opts){if(opts==='__HOME_TYPES__')return homeTypes[sub.value]||['Muu'];return opts;}
 function renderFields(){const c=configs[cat.value];wrap.hidden=!c;if(!c){wrap.innerHTML='';return}wrap.innerHTML=c.fields.map(([label,key,opts],i)=>{const realOpts=optionsFor(opts);return `${i%2===0?'<div class="form-row">':''}<label>${label}${realOpts?`<select data-extra="${key}"><option value="">Valitse</option>${realOpts.map(x=>`<option>${x}</option>`).join('')}</select>`:`<input data-extra="${key}" placeholder="${label}">`}</label>${i%2===1||i===c.fields.length-1?'</div>':''}`}).join('')}
 cat.addEventListener('change',renderFields);sub.addEventListener('change',renderFields);renderFields();
 const old=form.onsubmit;form.onsubmit=e=>{const active=configs[cat.value];const values={};if(active)wrap.querySelectorAll('[data-extra]').forEach(x=>values[x.dataset.extra]=x.value.trim());old?.call(form,e);if(active&&!e.defaultPrevented){const newest=items.find(x=>x.id?.startsWith('user-')&&x.c===cat.value&&!x.extra);if(newest){newest.extra=values;persist();render();}}};
})();