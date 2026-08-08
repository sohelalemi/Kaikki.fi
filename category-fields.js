(() => {
 const cat=document.querySelector('#category'), sub=document.querySelector('#subtype'), form=document.querySelector('#form'); if(!cat||!sub||!form)return;
 const typeMaps={
  Koti:{
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
  },
  Elektroniikka:{
   'Puhelimet':['Älypuhelin','Peruspuhelin','Taitettava puhelin','Muu'],'Tabletit':['iPad','Android-tabletti','Windows-tabletti','Lasten tabletti','Muu'],'Televisiot':['LED TV','OLED TV','QLED TV','Mini-LED TV','Smart TV','Projektori','Muu'],'Tietokoneet':['Kannettava','Pöytäkone','Pelikone','Mac','Chromebook','Näyttö','Komponentti','Muu'],'Ääni & kuulokkeet':['Nappikuulokkeet','Sankakuulokkeet','Kaiutin','Soundbar','Vahvistin','Mikrofoni','Muu'],'Kamerat':['Järjestelmäkamera','Peilitön kamera','Kompaktikamera','Videokamera','Objektiivi','Drone-kamera','Muu'],'Pelikonsolit':['PlayStation','Xbox','Nintendo','Käsikonsoli','Ohjain','Peli','Muu'],'Älykellot':['Apple Watch','Samsung Galaxy Watch','Garmin','Fitbit','Muu'],'Tarvikkeet':['Laturi','Kaapeli','Suojakuori','Virtalähde','Muistikortti','Teline','Adapteri','Muu'],'Muu elektroniikka':['GPS','Tulostin','Reititin','Älykoti','Muu']
  },
  Asunnot:{
   'Kerrostalo':['Yksiö','Kaksio','Kolmio','4h+','Loft','Muu'],'Rivitalo':['Yksiö','Kaksio','Kolmio','4h+','Päätyasunto','Muu'],'Omakotitalo':['Omakotitalo','Erillistalo','Hirsitalo','Muu'],'Paritalo':['Paritaloasunto','Muu'],'Mökki':['Kesämökki','Ympärivuotinen mökki','Huvila','Muu'],'Tontti':['Omakotitontti','Vapaa-ajan tontti','Liiketontti','Muu'],'Autotalli & varasto':['Autotalli','Autohallipaikka','Varasto','Muu'],'Liiketila':['Myymälä','Toimisto','Ravintolatila','Varasto','Tuotantotila','Muu'],'Huone':['Huone kimppakämpästä','Kalustettu huone','Opiskelijahuone','Muu'],'Muu asunto':['Asumisoikeus','Osaomistus','Muu']
  }
 };
 const brands=['Apple','Samsung','Sony','LG','Huawei','Xiaomi','OnePlus','Nokia','Lenovo','Asus','Acer','HP','Dell','Microsoft','Canon','Nikon','JBL','Bose','Muu'];
 const phoneModels={
  Apple:['iPhone 16e','iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max','iPhone 15','iPhone 15 Plus','iPhone 15 Pro','iPhone 15 Pro Max','iPhone 14','iPhone 14 Plus','iPhone 14 Pro','iPhone 14 Pro Max','iPhone 13','iPhone 13 mini','iPhone 13 Pro','iPhone 13 Pro Max','iPhone 12','iPhone 12 mini','iPhone 12 Pro','iPhone 12 Pro Max','iPhone 11','iPhone 11 Pro','iPhone 11 Pro Max','iPhone SE','Muu iPhone'],
  Samsung:['Galaxy S25','Galaxy S25+','Galaxy S25 Ultra','Galaxy S24','Galaxy S24+','Galaxy S24 Ultra','Galaxy S23','Galaxy S23+','Galaxy S23 Ultra','Galaxy S22','Galaxy S22+','Galaxy S22 Ultra','Galaxy Z Fold6','Galaxy Z Flip6','Galaxy Z Fold5','Galaxy Z Flip5','Galaxy A56','Galaxy A55','Galaxy A36','Galaxy A35','Galaxy A26','Galaxy A25','Galaxy A16','Galaxy A15','Muu Galaxy'],
  Xiaomi:['Xiaomi 15','Xiaomi 15 Ultra','Xiaomi 14','Xiaomi 14 Ultra','Xiaomi 13','Xiaomi 13T','Xiaomi 13T Pro','Redmi Note 14','Redmi Note 14 Pro','Redmi Note 13','Redmi Note 13 Pro','POCO F7','POCO X7','POCO X6','Muu Xiaomi'],
  OnePlus:['OnePlus 13','OnePlus 13R','OnePlus 12','OnePlus 12R','OnePlus 11','OnePlus 10 Pro','OnePlus Nord 4','OnePlus Nord 3','OnePlus Nord CE4','Muu OnePlus'],
  Huawei:['Pura 70','Pura 70 Pro','Mate 70','Mate 60 Pro','P60 Pro','P50 Pro','Nova 13','Nova 12','Muu Huawei'],
  Nokia:['Nokia G42','Nokia G22','Nokia C32','Nokia C22','Nokia XR21','Nokia 2660 Flip','Nokia 105','Muu Nokia'],
  Sony:['Xperia 1 VI','Xperia 5 V','Xperia 10 VI','Xperia 1 V','Xperia 10 V','Muu Xperia'],
  LG:['Velvet','Wing','G8','V60 ThinQ','Muu LG']
 };
 const colors=['Musta','Valkoinen','Harmaa','Ruskea','Beige','Sininen','Vihreä','Punainen','Keltainen','Oranssi','Vaaleanpunainen','Violetti','Monivärinen','Muu'];
 const configs={
  Elektroniikka:{fields:[['Tyyppi','type','__TYPE__'],['Merkki','brand',brands],['Malli','model',null]]},
  Koti:{fields:[['Tyyppi','type','__TYPE__'],['Materiaali','material',['Puu','Metalli','Lasi','Muovi','Nahka','Kangas','MDF','Muu']],['Väri','color',colors],['Mitat','dimensions',null]]},
  Työt:{fields:[['Työsuhde','jobtype',['Kokoaikainen','Osa-aikainen','Keikkatyö','Määräaikainen','Vakituinen']],['Työpaikka / yritys','company',null]]},
  Palvelut:{fields:[['Hinnoittelu','pricing',['Kiinteä hinta','Tuntihinta','Sopimuksen mukaan']],['Palvelualue','area',null]]},
  Asunnot:{fields:[['Tyyppi','type','__TYPE__'],['Pinta-ala (m²)','area',null],['Huoneet','rooms',['1','2','3','4','5','6+']],['Rakennusvuosi','built',null],['Osoite','address',null]]}
 };
 const wrap=document.createElement('div');wrap.id='categoryExtraFields';sub.closest('label').insertAdjacentElement('afterend',wrap);
 function optionsFor(opts){if(opts==='__TYPE__')return typeMaps[cat.value]?.[sub.value]||['Muu'];return opts;}
 function updatePhoneModelField(){
  if(cat.value!=='Elektroniikka'||sub.value!=='Puhelimet')return;
  const brand=wrap.querySelector('[data-extra="brand"]'), current=wrap.querySelector('[data-extra="model"]'); if(!brand||!current)return;
  const makeModel=()=>{
   const models=phoneModels[brand.value]; const oldValue=current.value||'';
   if(models){
    const sel=document.createElement('select');sel.dataset.extra='model';sel.innerHTML='<option value="">Valitse malli</option>'+models.map(x=>`<option>${x}</option>`).join('');current.replaceWith(sel);
   }else if(current.tagName!=='INPUT'){
    const inp=document.createElement('input');inp.dataset.extra='model';inp.placeholder='Malli';current.replaceWith(inp);
   }
  };
  brand.addEventListener('change',()=>{const m=wrap.querySelector('[data-extra="model"]');const models=phoneModels[brand.value];if(models){const sel=document.createElement('select');sel.dataset.extra='model';sel.innerHTML='<option value="">Valitse malli</option>'+models.map(x=>`<option>${x}</option>`).join('');m.replaceWith(sel);}else{const inp=document.createElement('input');inp.dataset.extra='model';inp.placeholder='Malli';m.replaceWith(inp);}});
  makeModel();
 }
 function renderFields(){const c=configs[cat.value];wrap.hidden=!c;if(!c){wrap.innerHTML='';return}wrap.innerHTML=c.fields.map(([label,key,opts],i)=>{const real=optionsFor(opts);return `${i%2===0?'<div class="form-row">':''}<label>${label}${real?`<select data-extra="${key}"><option value="">Valitse</option>${real.map(x=>`<option>${x}</option>`).join('')}</select>`:`<input data-extra="${key}" placeholder="${label}">`}</label>${i%2===1||i===c.fields.length-1?'</div>':''}`}).join('');updatePhoneModelField();if(cat.value==='Asunnot'){wrap.insertAdjacentHTML('beforeend','<div style="margin-top:12px"><button type="button" id="showHousingMap" class="ghost" style="width:100%">📍 Näytä kartta / Valitse sijainti</button><div id="housingMap" style="display:none;margin-top:10px"><iframe title="Kartta" width="100%" height="260" style="border:0;border-radius:12px" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=24.7%2C60.8%2C26.2%2C61.3&amp;layer=mapnik"></iframe><small>Kirjoita tarkka osoite yllä. Kartta näyttää sijainnin Suomessa.</small></div></div>');document.querySelector('#showHousingMap')?.addEventListener('click',()=>{const m=document.querySelector('#housingMap');m.style.display=m.style.display==='none'?'block':'none';});}}
 cat.addEventListener('change',renderFields);sub.addEventListener('change',renderFields);renderFields();
 const old=form.onsubmit;form.onsubmit=e=>{const active=configs[cat.value],values={};if(active)wrap.querySelectorAll('[data-extra]').forEach(x=>values[x.dataset.extra]=x.value.trim());old?.call(form,e);if(active&&!e.defaultPrevented){const newest=items.find(x=>x.id?.startsWith('user-')&&x.c===cat.value&&!x.extra);if(newest){newest.extra=values;persist();render();}}};
})();