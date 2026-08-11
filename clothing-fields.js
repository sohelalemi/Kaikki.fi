(() => {
  const category = document.querySelector('#category');
  const subtype = document.querySelector('#subtype');
  const form = document.querySelector('#form');
  if (!category || !subtype || !form) return;

  const types = {
    'Naisten vaatteet':['Alusvaatteet','Housut','Paidat & puserot','T-paidat','Mekot','Hameet','Takit','Neuleet','Shortsit','Farkut','Yöasut','Uima-asut','Urheiluvaatteet','Muut naisten vaatteet'],
    'Miesten vaatteet':['Alusvaatteet','Housut','Paidat','T-paidat','Puvut','Takit','Neuleet','Shortsit','Farkut','Yöasut','Uima-asut','Urheiluvaatteet','Muut miesten vaatteet'],
    'Lasten vaatteet':['Bodyt','Paidat','Housut','Mekot','Takit','Haalarit','Neuleet','Yöasut','Alusvaatteet','Urheiluvaatteet','Muut lasten vaatteet']
  };
  const colors=['Musta','Valkoinen','Harmaa','Sininen','Tummansininen','Punainen','Vihreä','Keltainen','Oranssi','Ruskea','Beige','Vaaleanpunainen','Violetti','Turkoosi','Kulta','Hopea','Monivärinen','Muu'];
  const adultSizes=['XXS','XS','S','M','L','XL','XXL','3XL','32','34','36','38','40','42','44','46','48','50','52','54','Muu'];
  const childSizes=['50','56','62','68','74','80','86','92','98','104','110','116','122','128','134','140','146','152','158','164','170','Muu'];

  const wrap=document.createElement('div');
  wrap.id='clothingFields'; wrap.hidden=true;
  wrap.innerHTML=`<div class="form-row"><label>Vaatetyyppi<select id="clothingType"></select></label><label>Koko<select id="clothingSize"></select></label></div><div class="form-row"><label>Väri<select id="clothingColor"><option value="">Valitse väri</option>${colors.map(x=>`<option>${x}</option>`).join('')}</select></label></div>`;
  subtype.closest('label').insertAdjacentElement('afterend',wrap);
  const typeSelect=wrap.querySelector('#clothingType');
  const sizeSelect=wrap.querySelector('#clothingSize');

  function sync(){
    const group=subtype.value;
    const list=types[group]||[];
    wrap.hidden=category.value!=='Vaatteet'||!list.length;
    typeSelect.innerHTML='<option value="">Valitse vaatetyyppi</option>'+list.map(x=>`<option>${x}</option>`).join('');
    const sizes=group==='Lasten vaatteet'?childSizes:adultSizes;
    sizeSelect.innerHTML='<option value="">Valitse koko</option>'+sizes.map(x=>`<option>${x}</option>`).join('');
  }
  category.addEventListener('change',()=>setTimeout(sync));
  subtype.addEventListener('change',sync);
  sync();

  const oldSubmit=form.onsubmit;
  form.onsubmit=e=>{
    const active=category.value==='Vaatteet'&&types[subtype.value];
    const detail=active?{type:typeSelect.value,size:sizeSelect.value,color:wrap.querySelector('#clothingColor').value}:null;
    if(active&&!detail.type){e.preventDefault();alert('Valitse vaatetyyppi.');return;}
    if(active&&!detail.size){e.preventDefault();alert('Valitse koko.');return;}
    oldSubmit?.call(form,e);
    if(active){const newest=items.find(x=>x.id?.startsWith('user-')&&x.c==='Vaatteet'&&!x.clothing);if(newest){newest.clothing=detail;persist();render();}}
  };
})();