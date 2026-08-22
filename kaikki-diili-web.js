// Kaikki Diili for web listing details.
(() => {
  let currentListingId = null;
  let busy = false;

  const style = document.createElement('style');
  style.textContent = `
    .kaikki-diili-web-btn{width:100%;margin-top:10px;padding:14px 16px;border:0;border-radius:12px;background:#1565d8;color:#fff;font-size:16px;font-weight:800;cursor:pointer}
    .kaikki-diili-web-btn:disabled{opacity:.6;cursor:wait}
    .kaikki-diili-web-note{margin:8px 0 0;color:#64748b;font-size:13px;line-height:1.45}
  `;
  document.head.appendChild(style);

  document.addEventListener('click', e => {
    const el = e.target.closest?.('[data-open]');
    if (el?.dataset?.open) currentListingId = el.dataset.open;
  }, true);

  async function sendDiiliRequest(button) {
    if (busy) return;
    const id = Number(currentListingId);
    if (!Number.isFinite(id)) {
      alert('Kaikki Diili toimii verkossa julkaistuissa ilmoituksissa. Avaa oikea verkkopalveluun tallennettu ilmoitus.');
      return;
    }
    const backend = window.KaikkiBackend;
    if (!backend?.enabled || !backend?.client) {
      alert('Kaikki Diili ei ole vielä yhteydessä palvelimeen.');
      return;
    }
    const session = await backend.session();
    if (!session) {
      alert('Kirjaudu ensin sisään ja yritä uudelleen.');
      document.getElementById('login')?.click();
      return;
    }
    busy = true;
    button.disabled = true;
    button.textContent = 'Lähetetään…';
    try {
      const { data, error } = await backend.client.rpc('create_deal', { p_listing_id: id });
      if (error) throw error;
      button.textContent = '✓ Diili-pyyntö lähetetty';
      alert('Kaikki Diili -pyyntö lähetettiin myyjälle. Se näkyy Myynnit/Ostot-näkymässä.');
      window.dispatchEvent(new CustomEvent('kaikki:diili-created', { detail: data }));
    } catch (err) {
      console.error('Kaikki Diili web', err);
      button.disabled = false;
      button.textContent = '🛡️ Osta Kaikki Diilillä';
      alert(err?.message || 'Diili-pyyntöä ei voitu lähettää.');
    } finally {
      busy = false;
    }
  }

  function injectButton() {
    const content = document.getElementById('detailsContent');
    if (!content || content.querySelector('#kaikkiDiiliWebBtn')) return;
    const contact = content.querySelector('#contactBtn');
    if (!contact) return;
    const btn = document.createElement('button');
    btn.id = 'kaikkiDiiliWebBtn';
    btn.className = 'kaikki-diili-web-btn';
    btn.type = 'button';
    btn.textContent = '🛡️ Osta Kaikki Diilillä';
    btn.addEventListener('click', () => sendDiiliRequest(btn));
    const note = document.createElement('p');
    note.className = 'kaikki-diili-web-note';
    note.textContent = 'Myyjä hyväksyy pyynnön ennen maksua. Maksu vahvistetaan myöhemmin maksupalvelun kautta.';
    contact.insertAdjacentElement('afterend', note);
    contact.insertAdjacentElement('afterend', btn);
  }

  const observer = new MutationObserver(injectButton);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', injectButton);
})();
