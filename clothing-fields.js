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

  const wrap=document.createElement('div');
  wrap.id='clothingFields'; wrap.hidden=true;
  wrap.innerHTML=`<div class="form-row"><label>Vaatetyyppi<select id="clothingType"></select></label><label>Väri<select id="clothingColor"><option value="">Valitse väri</option>${colors.map(x=>`<option>${x}</option>`).join('')}</select></label></div>`;
  subtype.closest('label').insertAdjacentElement('afterend',wrap);
  const typeSelect=wrap.querySelector('#clothingType');

  function sync(){
    const group=subtype.value;
    const list=types[group]||[];
    wrap.hidden=category.value!=='Vaatteet'||!list.length;
    typeSelect.innerHTML='<option value="">Valitse vaatetyyppi</option>'+list.map(x=>`<option>${x}</option>`).join('');
  }
  category.addEventListener('change',()=>setTimeout(sync));
  subtype.addEventListener('change',sync);
  sync();

  const oldSubmit=form.onsubmit;
  form.onsubmit=e=>{
    const active=category.value==='Vaatteet'&&types[subtype.value];
    const detail=active?{type:typeSelect.value,color:wrap.querySelector('#clothingColor').value}:null;
    if(active&&!detail.type){e.preventDefault();alert('Valitse vaatetyyppi.');return;}
    oldSubmit?.call(form,e);
    if(active){const newest=items.find(x=>x.id?.startsWith('user-')&&x.c==='Vaatteet'&&!x.clothing);if(newest){newest.clothing=detail;persist();render();}}
  };
})();