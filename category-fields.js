(() => {
 const cat=document.querySelector('#category'), sub=document.querySelector('#subtype'), form=document.querySelector('#form'); if(!cat||!sub||!form)return;
 const configs={
  Elektroniikka:{fields:[['Merkki','brand',['Apple','Samsung','Sony','LG','Huawei','Xiaomi','OnePlus','Nokia','Lenovo','Asus','Acer','HP','Dell','Microsoft','Canon','Nikon','JBL','Bose','Muu']],['Malli','model',null]]},
  Koti:{fields:[['Materiaali','material',['Puu','Metalli','Lasi','Muovi','Nahka','Kangas','MDF','Muu']],['Väri','color',['Musta','Valkoinen','Harmaa','Ruskea','Beige','Sininen','Vihreä','Punainen','Muu']],['Mitat','dimensions',null]]},
  Työt:{fields:[['Työsuhde','jobtype',['Kokoaikainen','Osa-aikainen','Keikkatyö','Määräaikainen','Vakituinen']],['Työpaikka / yritys','company',null]]},
  Palvelut:{fields:[['Hinnoittelu','pricing',['Kiinteä hinta','Tuntihinta','Sopimuksen mukaan']],['Palvelualue','area',null]]},
  Asunnot:{fields:[['Pinta-ala (m²)','area',null],['Huoneet','rooms',['1','2','3','4','5','6+']],['Rakennusvuosi','built',null]]}
 };
 const wrap=document.createElement('div');wrap.id='categoryExtraFields';sub.closest('label').insertAdjacentElement('afterend',wrap);
 function renderFields(){const c=configs[cat.value];wrap.hidden=!c;if(!c){wrap.innerHTML='';return}wrap.innerHTML=c.fields.map(([label,key,opts],i)=>`${i%2===0?'<div class="form-row">':''}<label>${label}${opts?`<select data-extra="${key}"><option value="">Valitse</option>${opts.map(x=>`<option>${x}</option>`).join('')}</select>`:`<input data-extra="${key}" placeholder="${label}">`}</label>${i%2===1||i===c.fields.length-1?'</div>':''}`).join('')}
 cat.addEventListener('change',renderFields);renderFields();
 const old=form.onsubmit;form.onsubmit=e=>{const active=configs[cat.value];const values={};if(active)wrap.querySelectorAll('[data-extra]').forEach(x=>values[x.dataset.extra]=x.value.trim());old?.call(form,e);if(active&&!e.defaultPrevented){const newest=items.find(x=>x.id?.startsWith('user-')&&x.c===cat.value&&!x.extra);if(newest){newest.extra=values;persist();render();}}};
})();