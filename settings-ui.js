(() => {
  const style=document.createElement('style');
  style.textContent=`.settings-wrap{margin-top:6px}.settings-wrap h3{font-size:22px;margin:20px 0 6px}.settings-wrap p{color:#64748b;margin:0 0 14px}.setting-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid #eef2f7}.setting-row strong{display:block}.theme-options{display:grid;gap:8px;margin-bottom:10px}.theme-options label{display:flex;align-items:center;justify-content:space-between;padding:10px 0}.settings-link{background:none!important;color:#1565d8!important;padding:4px!important}.switch{position:relative;width:48px;height:28px;flex:0 0 48px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;inset:0;background:#cbd5e1;border-radius:999px;cursor:pointer}.slider:before{content:'';position:absolute;width:22px;height:22px;left:3px;top:3px;background:white;border-radius:50%;transition:.2s}.switch input:checked+.slider{background:#1565d8}.switch input:checked+.slider:before{transform:translateX(20px)}body.kaikki-dark{background:#0f172a;color:#f8fafc}body.kaikki-dark header,body.kaikki-dark .panel,body.kaikki-dark section,body.kaikki-dark .settings-wrap{background:#111827;color:#f8fafc}body.kaikki-dark input,body.kaikki-dark select,body.kaikki-dark textarea{background:#1f2937;color:#fff;border-color:#374151}body.kaikki-dark .account-email,body.kaikki-dark .settings-wrap p{color:#cbd5e1}`;
  document.head.appendChild(style);

  function applyTheme(theme){
    const dark=theme==='dark'||(theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.classList.toggle('kaikki-dark',dark);
    localStorage.setItem('kaikki-theme',theme);
  }
  applyTheme(localStorage.getItem('kaikki-theme')||'system');
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if((localStorage.getItem('kaikki-theme')||'system')==='system')applyTheme('system')});

  const pref=(key,def=true)=>localStorage.getItem(key)==null?def:localStorage.getItem(key)!=='off';
  const savePref=(key,on)=>localStorage.setItem(key,on?'on':'off');

  function renderSettings(){
    const body=document.querySelector('#accountBody');
    const tabs=document.querySelector('.account-tabs');
    if(!body||!tabs)return;
    tabs.querySelectorAll('[data-account-tab]').forEach(b=>b.classList.toggle('active',b.dataset.accountTab==='settings'));
    const theme=localStorage.getItem('kaikki-theme')||'system';
    body.innerHTML=`<section class="settings-wrap"><h3>Ulkoasu</h3><p>Teeman vaihtaminen vaikuttaa sovelluksen ulkonäköön välittömästi.</p><div class="theme-options"><label><strong>Käytä laitteen teemaa</strong><input type="radio" name="kaikkiTheme" value="system" ${theme==='system'?'checked':''}></label><label><strong>Vaalea teema</strong><input type="radio" name="kaikkiTheme" value="light" ${theme==='light'?'checked':''}></label><label><strong>Tumma teema</strong><input type="radio" name="kaikkiTheme" value="dark" ${theme==='dark'?'checked':''}></label></div><h3>Ilmoitusasetukset</h3><p>Valitse, mistä tapahtumista haluat saada ilmoituksia.</p><div class="setting-row"><strong>Viestit</strong><label class="switch"><input data-notify-pref="kaikki-notify-messages" type="checkbox" ${pref('kaikki-notify-messages')?'checked':''}><span class="slider"></span></label></div><div class="setting-row"><strong>Varaukset</strong><label class="switch"><input data-notify-pref="kaikki-notify-reservations" type="checkbox" ${pref('kaikki-notify-reservations')?'checked':''}><span class="slider"></span></label></div><div class="setting-row"><strong>Ilmoitukset ja myynti</strong><label class="switch"><input data-notify-pref="kaikki-notify-listings" type="checkbox" ${pref('kaikki-notify-listings')?'checked':''}><span class="slider"></span></label></div><h3>Vikaraportit</h3><p>Lähettämällä vikaraportteja autat nopeuttamaan sovellukseen liittyvien vikojen korjaamista. Raportteihin ei sisällytetä profiili- tai henkilötietoja.</p><div class="setting-row"><strong>Vikaraportin lähetys</strong><label class="switch"><input id="errorReports" type="checkbox" ${pref('kaikki-error-reports')?'checked':''}><span class="slider"></span></label></div><div class="setting-row"><strong>Asiakaspalvelu</strong><button type="button" class="settings-link" id="customerService">Avaa</button></div><h3>Käyttöehdot ja yksityisyys</h3><div class="setting-row"><strong>Käyttöehdot</strong><button type="button" class="settings-link" data-legal="terms">Avaa</button></div><div class="setting-row"><strong>Tietosuojakäytäntö</strong><button type="button" class="settings-link" data-legal="privacy">Avaa</button></div><div class="setting-row"><strong>Evästeasetukset</strong><button type="button" class="settings-link" data-legal="cookies">Avaa</button></div></section>`;
    body.querySelectorAll('input[name="kaikkiTheme"]').forEach(x=>x.onchange=()=>applyTheme(x.value));
    body.querySelectorAll('[data-notify-pref]').forEach(x=>x.onchange=()=>savePref(x.dataset.notifyPref,x.checked));
    body.querySelector('#errorReports').onchange=e=>savePref('kaikki-error-reports',e.target.checked);
    body.querySelector('#customerService').onclick=()=>alert('Asiakaspalvelu lisätään tähän.');
    body.querySelectorAll('[data-legal]').forEach(b=>b.onclick=()=>alert(b.dataset.legal==='terms'?'Käyttöehdot lisätään tähän.':b.dataset.legal==='privacy'?'Tietosuojakäytäntö lisätään tähän.':'Evästeasetukset lisätään tähän.'));
  }

  function ensureSettingsTab(){
    const tabs=document.querySelector('.account-tabs');
    if(!tabs)return;
    let btn=tabs.querySelector('[data-account-tab="settings"]');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.dataset.accountTab='settings';btn.textContent='⚙️ Asetukset';tabs.appendChild(btn)}
    btn.onclick=renderSettings;
  }

  new MutationObserver(ensureSettingsTab).observe(document.body,{subtree:true,childList:true});
  ensureSettingsTab();
})();
