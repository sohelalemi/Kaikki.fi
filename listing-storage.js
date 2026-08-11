(() => {
  const B = window.KaikkiBackend;
  if (!B?.enabled) return;

  const form = document.querySelector('#form');
  const photoInput = document.querySelector('#photos');
  const preview = document.querySelector('#photoPreview');
  if (!form || !photoInput || !preview) return;

  const allowed = new Set(['image/jpeg','image/png','image/webp']);

  async function fileToDataUrl(file) {
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onerror = () => reject(new Error('Kuvan lukeminen epäonnistui.'));
      r.onload = () => resolve(r.result);
      r.readAsDataURL(file);
    });
  }

  function renderPreview() {
    preview.innerHTML = pendingPhotos.map((p, i) => `<div class="preview-tile"><img src="${p}" alt="Esikatselu ${i + 1}"><button type="button" data-remove-supabase-photo="${i}" aria-label="Poista kuva">×</button></div>`).join('');
    preview.hidden = !pendingPhotos.length;
    preview.querySelectorAll('[data-remove-supabase-photo]').forEach(btn => {
      btn.onclick = () => {
        pendingPhotos.splice(Number(btn.dataset.removeSupabasePhoto), 1);
        renderPreview();
      };
    });
  }

  photoInput.addEventListener('change', async e => {
    e.stopImmediatePropagation();
    const files = [...photoInput.files].slice(0, 6);
    if (!files.length) {
      pendingPhotos = [];
      preview.hidden = true;
      preview.innerHTML = '';
      return;
    }
    if ([...photoInput.files].length > 6) alert('Voit lisätä enintään 6 kuvaa. Ensimmäiset 6 valittiin.');
    if (files.some(f => !allowed.has(f.type))) {
      alert('Valitse JPG-, PNG- tai WebP-kuvia.');
      photoInput.value = '';
      return;
    }
    if (files.some(f => f.size > 10 * 1024 * 1024)) {
      alert('Yhden kuvan enimmäiskoko on 10 Mt.');
      photoInput.value = '';
      return;
    }
    try {
      pendingPhotos = [];
      for (const f of files) pendingPhotos.push(await fileToDataUrl(f));
      renderPreview();
    } catch (err) {
      alert(err?.message || 'Kuvan käsittely epäonnistui.');
    }
  }, true);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const session = await B.session();
    if (!session) {
      alert('Kirjaudu sisään, jotta ilmoitus voidaan julkaista.');
      document.querySelector('#login')?.click();
      return;
    }

    const title = document.querySelector('#title')?.value.trim() || '';
    const price = Number(document.querySelector('#price')?.value || 0);
    const category = document.querySelector('#category')?.value || '';
    const city = document.querySelector('#place')?.value.trim() || '';
    const description = document.querySelector('#desc')?.value.trim() || '';
    const condition = document.querySelector('#condition')?.value || '';
    const contact = document.querySelector('#contact')?.value.trim() || '';
    const address = document.querySelector('#address')?.value.trim() || '';
    const housingType = category === 'Asunnot' ? (document.querySelector('#housingType')?.value || '') : '';

    if (title.length < 3 || !city) {
      alert('Täytä otsikko ja kaupunki.');
      return;
    }

    const extra = {};
    document.querySelectorAll('#categoryExtraFields [data-extra]').forEach(el => {
      extra[el.dataset.extra] = (el.value || '').trim();
    });
    const amenities = [...document.querySelectorAll('#categoryExtraFields [data-amenity]:checked')].map(el => el.value);

    const listing = {
      t: title,
      p: price,
      c: category,
      city,
      address,
      desc: description || 'Ei kuvausta.',
      condition,
      contact,
      housingType,
      extra,
      vehicleExtra: extra,
      amenities,
      photos: [...pendingPhotos],
      imageUrls: [...pendingPhotos]
    };

    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = pendingPhotos.length ? 'Kuvia ladataan...' : 'Tallennetaan...';
    }

    try {
      await B.createListing(listing);
      if (typeof loadRemoteListings === 'function') await loadRemoteListings();
      pendingPhotos = [];
      photoInput.value = '';
      preview.hidden = true;
      preview.innerHTML = '';
      form.reset();
      document.querySelector('#place').value = 'Lahti';
      if (typeof syncHousingType === 'function') syncHousingType();
      if (typeof closeModal === 'function') closeModal();
      alert('Ilmoitus ja kuvat tallennettiin Kaikki.fi:n tietokantaan.');
    } catch (err) {
      alert('Tallennus epäonnistui: ' + (err?.message || 'Tuntematon virhe'));
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Julkaise ilmoitus';
      }
    }
  }, true);
})();
