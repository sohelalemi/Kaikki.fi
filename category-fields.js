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
 function renderFields(){const c=configs[cat.value];wrap.hidden=!c;if(!c){wrap.innerHTML='';return}wrap.innerHTML=c.fields.map(([label,key,opts],i)=>{const real=optionsFor(opts);return `${i%2===0?'<div class="form-row">':''}<label>${label}${real?`<select data-extra="${key}"><option value="">Valitse</option>${real.map(x=>`<option>${x}</option>`).join('')}</select>`:`<input data-extra="${key}" placeholder="${label}">`}</label>${i%2===1||i===c.fields.length-1?'</div>':''}`}).join('');if(cat.value==='Asunnot'){wrap.insertAdjacentHTML('beforeend','<div style="margin-top:12px"><button type="button" id="showHousingMap" class="ghost" style="width:100%">📍 Näytä kartta / Valitse sijainti</button><div id="housingMap" style="display:none;margin-top:10px"><iframe title="Kartta" width="100%" height="260" style="border:0;border-radius:12px" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=24.7%2C60.8%2C26.2%2C61.3&amp;layer=mapnik"></iframe><small>Kirjoita tarkka osoite yllä. Kartta näyttää sijainnin Suomessa.</small></div></div>');document.querySelector('#showHousingMap')?.addEventListener('click',()=>{const m=document.querySelector('#housingMap');m.style.display=m.style.display==='none'?'block':'none';});}}
 cat.addEventListener('change',renderFields);sub.addEventListener('change',renderFields);renderFields();
 const old=form.onsubmit;form.onsubmit=e=>{const active=configs[cat.value],values={};if(active)wrap.querySelectorAll('[data-extra]').forEach(x=>values[x.dataset.extra]=x.value.trim());old?.call(form,e);if(active&&!e.defaultPrevented){const newest=items.find(x=>x.id?.startsWith('user-')&&x.c===cat.value&&!x.extra);if(newest){newest.extra=values;persist();render();}}};
})();