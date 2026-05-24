// ============================================================
// CaliPlanner — Google Sheets sync  (google-sync.js)
// ============================================================

(function () {
  const STORAGE_KEY   = 'skillplanner.v1';
  const WEBHOOK_KEY   = 'skillplanner.sheetsUrl';
  const LASTSYNC_KEY  = 'skillplanner.lastSync';
  const PULLED_KEY    = 'skillplanner.autoPulled'; // sessionStorage — reset ad ogni nuova tab
  const DEFAULT_URL   = 'https://script.google.com/macros/s/AKfycbzF2gbqU0AXJgjbqXC6Ovg5bE4ViY8mrOGBE5K5cnYTLG8wi6B9MRwp3eLAsrfQZfMQ4Q/exec';

  // Preimposta l'URL se non è ancora salvato
  if (!localStorage.getItem(WEBHOOK_KEY)) {
    localStorage.setItem(WEBHOOK_KEY, DEFAULT_URL);
  }

  // ── URL webhook ───────────────────────────────────────────
  function getWebhookUrl(force) {
    let url = localStorage.getItem(WEBHOOK_KEY);
    if (!url || force) {
      url = prompt(
        '📋 Incolla qui l\'URL del tuo Apps Script Web App\n' +
        '(Apps Script → Deploy → Gestisci deployment → copia URL):',
        url || ''
      );
      if (!url || !url.startsWith('https://')) {
        alert('URL non valido. Operazione annullata.');
        return null;
      }
      url = url.trim();
      localStorage.setItem(WEBHOOK_KEY, url);
    }
    return url;
  }

  // ── Payload per il push ───────────────────────────────────
  function buildPayload() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('Nessun dato trovato in locale (skillplanner.v1).');
    const state = JSON.parse(raw);
    const exerciseNames = {};
    if (window.SP_BY_ID) {
      for (const [id, ex] of Object.entries(window.SP_BY_ID)) {
        exerciseNames[id] = ex.name;
      }
    }
    return { ...state, exerciseNames };
  }

  // ── Fetch dati da Sheets (usato sia dall'auto-pull che dal pull manuale) ──
  async function fetchFromSheets(url) {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Risposta non valida dal server');
    if (!data.state) throw new Error('Backup vuoto — esegui prima un sync (⬆)');
    return data.state;
  }

  // ── AUTO-PULL all'avvio ───────────────────────────────────
  // Viene chiamata subito quando il file carica, prima che React monti.
  // Se i dati su Sheets sono diversi da quelli locali aggiorna e ricarica.
  // Il flag in sessionStorage evita loop: si resetta alla chiusura della tab.
  async function autoPull() {
    if (sessionStorage.getItem(PULLED_KEY)) return; // già fatto in questa sessione
    const url = localStorage.getItem(WEBHOOK_KEY);
    if (!url) return; // non ancora configurato

    try {
      const remoteState = await fetchFromSheets(url);
      sessionStorage.setItem(PULLED_KEY, '1');

      const remoteJson = JSON.stringify(remoteState);
      const localJson  = localStorage.getItem(STORAGE_KEY) || '';

      if (remoteJson !== localJson) {
        // Dati diversi: aggiorna silenziosamente e ricarica
        localStorage.setItem(STORAGE_KEY, remoteJson);
        localStorage.setItem(LASTSYNC_KEY,
          new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
        );
        location.reload();
        // Il reload imposta subito PULLED_KEY, quindi il secondo caricamento non ri-fetcherà
      }
    } catch (_) {
      // Errore silenzioso — la webapp continua con i dati locali
      sessionStorage.setItem(PULLED_KEY, '1'); // non riprovare in questa sessione
    }
  }

  // ── PUSH: webapp → Sheets ─────────────────────────────────
  async function pushToSheets({ silent = false, forceConfig = false } = {}) {
    const url = getWebhookUrl(forceConfig);
    if (!url) return false;

    let payload;
    try {
      payload = buildPayload();
    } catch (err) {
      if (!silent) alert('❌ ' + err.message);
      return false;
    }

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      const now = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem(LASTSYNC_KEY, now);
      // Dopo un push consideriamo i dati "freschi" per questa sessione
      sessionStorage.setItem(PULLED_KEY, '1');

      if (!silent) alert('✅ Dati salvati su Google Sheets!');
      return true;
    } catch (err) {
      if (!silent) alert('❌ Errore di rete: ' + err.message);
      return false;
    }
  }

  // ── PULL manuale: forza il refresh da Sheets ──────────────
  async function pullFromSheets() {
    const url = getWebhookUrl(false);
    if (!url) return;

    if (!confirm('⬇ Caricare i dati da Google Sheets?\nI dati locali verranno sostituiti.')) return;

    try {
      const remoteState = await fetchFromSheets(url);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteState));
      localStorage.setItem(LASTSYNC_KEY,
        new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      );
      sessionStorage.setItem(PULLED_KEY, '1');
      location.reload();
    } catch (err) {
      alert('❌ ' + err.message);
    }
  }

  // ── API pubblica ──────────────────────────────────────────
  window.SP_SYNC = {
    push:         pushToSheets,
    pull:         pullFromSheets,
    configureUrl: () => getWebhookUrl(true),
    clearUrl:     () => { localStorage.removeItem(WEBHOOK_KEY); alert('URL rimosso.'); },
    getUrl:       () => localStorage.getItem(WEBHOOK_KEY),
    getLastSync:  () => localStorage.getItem(LASTSYNC_KEY),
  };

  // ── Componente React: pulsanti ⬆ ⬇ ⚙ ─────────────────────
  function SyncButton() {
    const [pushing, setPushing] = React.useState(false);
    const [pulling, setPulling] = React.useState(false);
    const [lastSync, setLastSync] = React.useState(window.SP_SYNC.getLastSync);
    const hasUrl = !!window.SP_SYNC.getUrl();
    const busy = pushing || pulling;

    async function handlePush() {
      setPushing(true);
      const ok = await window.SP_SYNC.push({ silent: false });
      if (ok) setLastSync(window.SP_SYNC.getLastSync());
      setPushing(false);
    }

    async function handlePull() {
      setPulling(true);
      await window.SP_SYNC.pull(); // ricarica la pagina → setPulling(false) non serve
      setPulling(false);
    }

    return React.createElement('div', {
      className: 'sync-wrap',
      title: lastSync ? `Ultimo sync: ${lastSync}` : 'Nessun sync ancora',
    },
      React.createElement('button', {
        className: `btn btn--sm sync-btn ${pushing ? 'sync-btn--syncing' : ''} ${!hasUrl ? 'sync-btn--unconfigured' : ''}`,
        onClick: handlePush,
        disabled: busy,
        title: hasUrl ? 'Salva su Google Sheets' : 'Clicca per configurare l\'URL',
      }, pushing ? '↻' : '⬆'),

      React.createElement('button', {
        className: `btn btn--sm sync-btn ${pulling ? 'sync-btn--syncing' : ''}`,
        onClick: handlePull,
        disabled: busy || !hasUrl,
        title: hasUrl ? 'Forza caricamento da Sheets' : 'Configura prima l\'URL (⬆)',
        style: { opacity: hasUrl ? 1 : 0.35 },
      }, pulling ? '↻' : '⬇'),

      React.createElement('button', {
        className: 'btn btn--sm btn--ghost sync-config-btn',
        onClick: (e) => { e.stopPropagation(); window.SP_SYNC.configureUrl(); },
        title: 'Cambia URL Sheets',
      }, '⚙')
    );
  }

  window.SyncButton = SyncButton;

  // ── Avvia l'auto-pull immediatamente ─────────────────────
  autoPull();
})();
