(() => {
  const style=document.createElement('style');
  style.textContent=`
  #accountModal .panel{width:min(760px,calc(100vw - 32px));max-height:min(88vh,860px);overflow-y:auto;padding:28px!important}
  #accountModal #accountBody{min-width:0}
  .settings-wrap{margin-top:8px;display:grid;gap:18px}
  .settings-section{background:#fff;border:1px solid #e6ebf2;border-radius:18px;padding:18px 20px;box-shadow:0 8px 24px rgba(15,23,42,.04)}
  .settings-section h3{font-size:19px;line-height:1.25;margin:0 0 5px;color:#172033}
  .settings-section>p{color:#64748b;margin:0 0 16px;font-size:14px;line-height:1.5}
  .theme-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0}
  .theme-choice{position:relative;display:flex;align-items:center;gap:10px;border:1px solid #dbe3ee;border-radius:14px;padding:13px 14px;cursor:pointer;background:#f8fafc;min-height:58px;transition:.16s ease}
  .theme-choice:hover{border-color:#9ab8ef;background:#f3f7ff}
  .theme-choice:has(input:checked){border-color:#1565d8;background:#eaf2ff;box-shadow:0 0 0 2px rgba(21,101,216,.08)}
  .theme-choice input{position:absolute;opacity:0;pointer-events:none}
  .theme-icon{font-size:22px;line-height:1}
  .theme-copy{display:flex;flex-direction:column;gap:2px;min-width:0}
  .theme-copy strong{font-size:14px;color:#1f2937}
  .theme-copy small{font-size:11.5px;color:#7b8798}
  .setting-list{border:1px solid #e8edf4;border-radius:14px;overflow:hidden;background:#fff}
  .setting-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 15px;border-bottom:1px solid #eef2f7;min-height:58px}
  .setting-row:last-child{border-bottom:0}
  .setting-copy{min-width:0;flex:1}
  .setting-copy strong{display:block;font-size:14px;color:#1f2937;margin-bottom:2px}
  .setting-copy small{display:block;color:#7b8798;font-size:12px;line-height:1.35}
  .settings-link{background:#eef4ff!important;color:#1565d8!important;border:0!important;border-radius:10px!important;padding:9px 14px!important;min-width:74px;font-weight:800!important}
  .settings-link:hover{background:#e2edff!important}
  .switch{position:relative;width:48px;height:28px;flex:0 0 48px}
  .switch input{opacity:0;width:0;height:0}
  .slider{position:absolute;inset:0;background:#cbd5e1;border-radius:999px;cursor:pointer;transition:.2s}
  .slider:before{content:'';position:absolute;width:22px;height:22px;left:3px;top:3px;background:white;border-radius:50%;transition:.2s;box-shadow:0 1px 4px rgba(0,0,0,.18)}
  .switch input:checked+.slider{background:#1565d8}
  .switch input:checked+.slider:before{transform:translateX(20px)}
  .settings-saved{font-size:12px;color:#15803d;min-height:18px;margin-top:8px}
  body.kaikki-dark{background:#0f172a;color:#f8fafc}
  body.kaikki-dark header,body.kaikki-dark .panel,body.kaikki-dark section,body.kaikki-dark .settings-wrap{background:#111827;color:#f8fafc}
  body.kaikki-dark .settings-section,body.kaikki-dark .setting-list,body.kaikki-dark .setting-row{background:#172033;border-color:#2a3649}
  body.kaikki-dark .settings-section h3,body.kaikki-dark .setting-copy strong,body.kaikki-dark .theme-copy strong{color:#f8fafc}
  body.kaikki-dark .settings-section>p,body.kaikki-dark .setting-copy small,body.kaikki-dark .theme-copy small,body.kaikki-dark .account-email{color:#b9c4d4}
  body.kaikki-dark .theme-choice{background:#111827;border-color:#334155}
  body.kaikki-dark .theme-choice:has(input:checked){background:#17315e;border-color:#4f8cf7}
  body.kaikki-dark input,body.kaikki-dark select,body.kaikki-dark textarea{background:#1f2937;color:#fff;border-color:#374151}
  @media(max-width:640px){#accountModal .panel{width:calc(100vw - 16px);padding:18px!important}.theme-options{grid-template-columns:1fr}.settings-section{padding:16px}.setting-row{padding:13px 12px}.account-tabs{display:grid!important;grid-template-columns:repeat(2,1fr)}.account-tabs button{min-width:0!important}}
  `;
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
    body.innerHTML=`
      <div class="settings-wrap">
        <section class="settings-section">
          <h3>Ulkoasu</h3>
          <p>Valitse Kaikki.fi:n ulkoasu. Muutos näkyy heti.</p>
          <div class="theme-options">
            <label class="theme-choice"><input type="radio" name="kaikkiTheme" value="system" ${theme==='system'?'checked':''}><span class="theme-icon">◐</span><span class="theme-copy"><strong>Laitteen teema</strong><small>Seuraa laitteen asetusta</small></span></label>
            <label class="theme-choice"><input type="radio" name="kaikkiTheme" value="light" ${theme==='light'?'checked':''}><span class="theme-icon">☀️</span><span class="theme-copy"><strong>Vaalea</strong><small>Vaalea käyttöliittymä</small></span></label>
            <label class="theme-choice"><input type="radio" name="kaikkiTheme" value="dark" ${theme==='dark'?'checked':''}><span class="theme-icon">🌙</span><span class="theme-copy"><strong>Tumma</strong><small>Tumma käyttöliittymä</small></span></label>
          </div>
        </section>

        <section class="settings-section">
          <h3>Ilmoitusasetukset</h3>
          <p>Valitse, mistä tapahtumista haluat saada ilmoituksia.</p>
          <div class="setting-list">
            <div class="setting-row"><div class="setting-copy"><strong>Viestit</strong><small>Uudet viestit ja vastaukset</small></div><label class="switch"><input data-notify-pref="kaikki-notify-messages" type="checkbox" ${pref('kaikki-notify-messages')?'checked':''}><span class="slider"></span></label></div>
            <div class="setting-row"><div class="setting-copy"><strong>Varaukset</strong><small>Varauksen tila ja muutokset</small></div><label class="switch"><input data-notify-pref="kaikki-notify-reservations" type="checkbox" ${pref('kaikki-notify-reservations')?'checked':''}><span class="slider"></span></label></div>
            <div class="setting-row"><div class="setting-copy"><strong>Ilmoitukset ja myynti</strong><small>Myyntiin ja omiin ilmoituksiin liittyvät tapahtumat</small></div><label class="switch"><input data-notify-pref="kaikki-notify-listings" type="checkbox" ${pref('kaikki-notify-listings')?'checked':''}><span class="slider"></span></label></div>
          </div>
          <div class="settings-saved" id="settingsSaved"></div>
        </section>

        <section class="settings-section">
          <h3>Tuki ja tietosuoja</h3>
          <p>Hallitse vikaraportteja ja avaa palvelun tärkeät tiedot.</p>
          <div class="setting-list">
            <div class="setting-row"><div class="setting-copy"><strong>Vikaraportin lähetys</strong><small>Auttaa löytämään teknisiä ongelmia ilman profiilitietoja</small></div><label class="switch"><input id="errorReports" type="checkbox" ${pref('kaikki-error-reports')?'checked':''}><span class="slider"></span></label></div>
            <div class="setting-row"><div class="setting-copy"><strong>Asiakaspalvelu</strong><small>Ohjeet ja yhteydenotto</small></div><button type="button" class="settings-link" id="customerService">Avaa</button></div>
            <div class="setting-row"><div class="setting-copy"><strong>Käyttöehdot</strong></div><button type="button" class="settings-link" data-legal="terms">Avaa</button></div>
            <div class="setting-row"><div class="setting-copy"><strong>Tietosuojakäytäntö</strong></div><button type="button" class="settings-link" data-legal="privacy">Avaa</button></div>
            <div class="setting-row"><div class="setting-copy"><strong>Evästeasetukset</strong></div><button type="button" class="settings-link" data-legal="cookies">Avaa</button></div>
          </div>
        </section>
      </div>`;

    const saved=body.querySelector('#settingsSaved');
    const flashSaved=()=>{saved.textContent='Asetus tallennettu ✓';clearTimeout(flashSaved.t);flashSaved.t=setTimeout(()=>saved.textContent='',1400)};
    body.querySelectorAll('input[name="kaikkiTheme"]').forEach(x=>x.onchange=()=>{applyTheme(x.value);flashSaved()});
    body.querySelectorAll('[data-notify-pref]').forEach(x=>x.onchange=()=>{savePref(x.dataset.notifyPref,x.checked);flashSaved()});
    body.querySelector('#errorReports').onchange=e=>{savePref('kaikki-error-reports',e.target.checked);flashSaved()};
    body.querySelector('#customerService').onclick=()=>alert('Asiakaspalvelu: ota yhteyttä Kaikki.fi-tukeen. Tukilomake lisätään tähän näkymään.');
    body.querySelectorAll('[data-legal]').forEach(b=>b.onclick=()=>alert(b.dataset.legal==='terms'?'Käyttöehdot avataan tähän näkymään.':b.dataset.legal==='privacy'?'Tietosuojakäytäntö avataan tähän näkymään.':'Evästeasetukset avataan tähän näkymään.'));
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
