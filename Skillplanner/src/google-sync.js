// ============================================================
// CaliPlanner — Google Sheets sync  (google-sync.js)
// ============================================================
// Caricato DOPO store.js nell'HTML. Non richiede JSX.
// ============================================================

(function () {
  const STORAGE_KEY  = 'skillplanner.v1';
  const WEBHOOK_KEY  = 'skillplanner.sheetsUrl';

  // ── Legge l'URL webhook salvato (o chiede all'utente) ─────
  function getWebhookUrl(force) {
    let url = localStorage.getItem(WEBHOOK_KEY);
    if (!url || force) {
      url = prompt(
        '📋 Incolla qui l\'URL del tuo Apps Script Web App\n' +
        '(lo trovi su Apps Script → Deploy → Gestisci deployment):',
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

  // ── Costruisce il payload da sincronizzare ─────────────────
  function buildPayload() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('Nessun dato trovato in locale (skillplanner.v1).');

    const state = JSON.parse(raw);

    // Aggiunge i nomi degli esercizi per leggibilità nel foglio
    const exerciseNames = {};
    if (window.SP_BY_ID) {
      for (const [id, ex] of Object.entries(window.SP_BY_ID)) {
        exerciseNames[id] = ex.name;
      }
    }

    return { ...state, exerciseNames };
  }

  // ── Invio via fetch ────────────────────────────────────────
  // Apps Script non manda CORS headers su POST → usiamo no-cors.
  // La risposta è opaca (non leggibile), ma i dati arrivano al server.
  // Per verificare il successo: apri il Google Sheet dopo il sync.
  async function syncToSheets({ silent = false, forceConfig = false } = {}) {
    const url = getWebhookUrl(forceConfig);
    if (!url) return;

    let payload;
    try {
      payload = buildPayload();
    } catch (err) {
      alert('❌ ' + err.message);
      return;
    }

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',          // richiesto da Apps Script
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      if (!silent) {
        alert(
          '✅ Dati inviati al Google Sheet!\n\n' +
          'Apri il foglio per verificare — il sync è asincrono,\n' +
          'attendi 5-10 secondi se i dati non appaiono subito.'
        );
      }
    } catch (err) {
      alert('❌ Errore di rete: ' + err.message + '\n\nControlla la connessione o l\'URL del deployment.');
    }
  }

  // ── Esporta nello scope globale ────────────────────────────
  window.SP_SYNC = {
    sync:          syncToSheets,
    configureUrl:  () => getWebhookUrl(true),
    clearUrl:      () => { localStorage.removeItem(WEBHOOK_KEY); alert('URL rimosso.'); },
    getUrl:        () => localStorage.getItem(WEBHOOK_KEY),
  };

  // ── Componente React: pulsante Sync nel topbar ─────────────
  // Usato in SkillPlanner.html nel componente App principale.
  function SyncButton() {
    const [syncing, setSyncing] = React.useState(false);
    const [lastSync, setLastSync] = React.useState(() => {
      // Mostra l'orario dell'ultimo sync se disponibile
      return localStorage.getItem('skillplanner.lastSync') || null;
    });

    async function handleSync() {
      setSyncing(true);
      await window.SP_SYNC.sync({ silent: true });
      const now = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('skillplanner.lastSync', now);
      setLastSync(now);
      setSyncing(false);
    }

    function handleConfig(e) {
      e.stopPropagation();
      window.SP_SYNC.configureUrl();
    }

    const hasUrl = !!window.SP_SYNC.getUrl();

    return React.createElement('div', { className: 'sync-wrap', title: hasUrl ? `Ultimo sync: ${lastSync || '—'}` : 'Configura URL Sheets' },
      React.createElement('button', {
        className: `btn btn--sm sync-btn ${syncing ? 'sync-btn--syncing' : ''} ${!hasUrl ? 'sync-btn--unconfigured' : ''}`,
        onClick: handleSync,
        disabled: syncing,
        title: hasUrl ? 'Sincronizza con Google Sheets' : 'Clicca per configurare l\'URL Sheets',
      },
        syncing ? '↻ Sync…' : (hasUrl ? '⬆ Sheets' : '⬆ Sheets ·')
      ),
      hasUrl && React.createElement('button', {
        className: 'btn btn--sm btn--ghost sync-config-btn',
        onClick: handleConfig,
        title: 'Cambia URL Sheets',
      }, '⚙')
    );
  }

  window.SyncButton = SyncButton;
})();
