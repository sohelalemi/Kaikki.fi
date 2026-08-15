(() => {
  const backend = window.KaikkiBackend;
  const client = backend && backend.client;
  if (!client) return;

  const css = document.createElement('style');
  css.textContent = `
    .password-reset-overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9999;display:none;align-items:center;justify-content:center;padding:20px}
    .password-reset-overlay.show{display:flex}
    .password-reset-card{width:min(460px,100%);background:#fff;border-radius:24px;padding:24px;box-shadow:0 24px 80px rgba(15,23,42,.25)}
    .password-reset-card h2{margin:0 0 8px;font-size:28px}
    .password-reset-card p{color:#64748b;margin:0 0 18px;line-height:1.5}
    .password-reset-card label{display:block;font-weight:700;margin:12px 0 6px}
    .password-reset-card input{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:14px;padding:14px;font-size:16px}
    .password-reset-card button{width:100%;margin-top:16px;border:0;border-radius:14px;padding:14px;background:#1565d8;color:#fff;font-weight:800;font-size:16px}
    .password-reset-status{margin-top:12px;font-weight:700}
  `;
  document.head.appendChild(css);

  const wrap = document.createElement('div');
  wrap.className = 'password-reset-overlay';
  wrap.innerHTML = `
    <div class="password-reset-card" role="dialog" aria-modal="true" aria-labelledby="resetTitle">
      <h2 id="resetTitle">Aseta uusi salasana</h2>
      <p>Kirjoita uusi salasana. Sen tulee olla vähintään 6 merkkiä.</p>
      <label for="newPassword">Uusi salasana</label>
      <input id="newPassword" type="password" minlength="6" autocomplete="new-password">
      <label for="newPassword2">Toista salasana</label>
      <input id="newPassword2" type="password" minlength="6" autocomplete="new-password">
      <button id="saveNewPassword" type="button">Tallenna uusi salasana</button>
      <div id="passwordResetStatus" class="password-reset-status" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(wrap);

  const status = wrap.querySelector('#passwordResetStatus');
  const save = wrap.querySelector('#saveNewPassword');
  const pass1 = wrap.querySelector('#newPassword');
  const pass2 = wrap.querySelector('#newPassword2');

  function showReset(){
    wrap.classList.add('show');
    setTimeout(() => pass1.focus(), 50);
  }

  async function savePassword(){
    const a = pass1.value;
    const b = pass2.value;
    status.style.color = '#dc2626';
    if (a.length < 6) { status.textContent = 'Salasanan tulee olla vähintään 6 merkkiä.'; return; }
    if (a !== b) { status.textContent = 'Salasanat eivät täsmää.'; return; }
    save.disabled = true;
    save.textContent = 'Tallennetaan...';
    const { error } = await client.auth.updateUser({ password: a });
    if (error) {
      status.textContent = error.message;
      save.disabled = false;
      save.textContent = 'Tallenna uusi salasana';
      return;
    }
    status.style.color = '#15803d';
    status.textContent = 'Salasana vaihdettu. Voit nyt kirjautua uudella salasanalla.';
    save.textContent = 'Valmis';
    history.replaceState({}, document.title, location.pathname);
    setTimeout(() => wrap.classList.remove('show'), 2200);
  }

  save.addEventListener('click', savePassword);

  client.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') showReset();
  });

  (async () => {
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const query = new URLSearchParams(location.search);
    const accessToken = hash.get('access_token');
    const refreshToken = hash.get('refresh_token');
    const recoveryType = hash.get('type');
    const code = query.get('code');

    try {
      if (accessToken && refreshToken) {
        const { error } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (!error && (recoveryType === 'recovery' || accessToken)) showReset();
        return;
      }

      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (!error) showReset();
        return;
      }

      if (recoveryType === 'recovery') showReset();
    } catch (e) {
      console.warn('password recovery', e);
    }
  })();
})();
