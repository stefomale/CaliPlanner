# CaliPlanner → Google Sheets — Guida Setup

## Cosa ottieni

Ogni volta che premi **⬆ Sheets** nella topbar, la webapp scrive su 5 tab del tuo Google Sheet:

| Tab | Contenuto |
|-----|-----------|
| ⚙️ Info | Riepilogo mesociclo + timestamp ultimo sync |
| 📋 Piano | Una riga per ogni esercizio in ogni giorno/settimana |
| ✅ Completati | Gli esercizi marcati come completati nella tab Oggi |
| 💪 Esercizi Custom | Gli esercizi che hai creato tu |
| 🎯 Livelli Custom | I tuoi override RPE/intensità personalizzati |

---

## Passo 1 — Crea il Google Sheet

1. Vai su [sheets.google.com](https://sheets.google.com) e crea un **nuovo foglio vuoto**.
2. Dagli un nome (es. *CaliPlanner Sync*).
3. Tieni aperta questa scheda — ti servirà l'URL più avanti.

---

## Passo 2 — Apri Apps Script

1. Nel Google Sheet: menu **Estensioni → Apps Script**.
2. Si apre l'editor di codice.

---

## Passo 3 — Incolla il codice

1. **Cancella** tutto il contenuto nell'editor (c'è una funzione vuota di default).
2. Apri il file `Code.gs` che trovi nella cartella della webapp.
3. **Copia** tutto il contenuto e **incollalo** nell'editor di Apps Script.
4. Clicca su **Salva** (icona floppy disk 💾 oppure `Cmd/Ctrl + S`).

---

## Passo 4 — Configura i tab del foglio

1. In Apps Script, nel menu a tendina delle funzioni, seleziona **`setupSheet`**.
2. Clicca **▶ Esegui**.
3. La prima volta ti chiederà di autorizzare l'accesso → clicca **Rivedi autorizzazioni** → scegli il tuo account Google → clicca **Consenti**.
4. Torna al Google Sheet: vedrai 5 tab creati automaticamente con le intestazioni.

---

## Passo 5 — Fai il Deploy come Web App

1. In Apps Script: menu **Deploy → Nuova distribuzione**.
2. Clicca sull'icona ⚙ accanto a "Tipo" → seleziona **App web**.
3. Configura così:
   - **Descrizione**: `CaliPlanner Sync` (opzionale)
   - **Esegui come**: `Me (il tuo account)`
   - **Chi può accedere**: `Chiunque`
4. Clicca **Deploy**.
5. La prima volta ti chiede di autorizzare di nuovo → **Consenti**.
6. Copia l'**URL dell'app web** (inizia con `https://script.google.com/macros/s/...`).

> ⚠️ Tieni questo URL privato — chiunque lo abbia può scrivere nel tuo foglio.

---

## Passo 6 — Configura la webapp

1. Ricarica la webapp CaliPlanner nel browser.
2. Nella topbar vedrai il pulsante **⬆ Sheets ·** (con il punto che indica che non è ancora configurato).
3. Clicca il pulsante → ti apparirà un popup che chiede l'URL.
4. **Incolla l'URL** copiato al Passo 5 → OK.
5. L'URL viene salvato in localStorage — non dovrai reinserirlo.

---

## Utilizzo quotidiano

- **⬆ Sheets** nel topbar → sincronizza tutto in un click.
- Il pulsante **⚙** accanto a Sheets → cambia l'URL (es. se rifai il deploy).
- Dopo il click, attendi 5–10 secondi e ricarica il Google Sheet.

> La webapp usa `fetch` con `mode: no-cors` (richiesto da Apps Script), quindi non può leggere la risposta del server. Se i dati non appaiono nel foglio, vedi la sezione Troubleshooting.

---

## Troubleshooting

### I dati non arrivano nel foglio

1. Verifica che il deploy sia impostato su **"Chiunque"** (non "Solo io").
2. Verifica che l'URL inizi con `https://script.google.com/macros/s/` e finisca con `/exec`.
3. In Apps Script → **Esecuzioni** (barra laterale sinistra): controlla se ci sono errori nelle ultime esecuzioni.
4. Prova a incollare l'URL direttamente nel browser (otterrai un errore "Richiesta non valida" — è normale, significa che il server risponde).

### "Autorizzazione richiesta" dopo un aggiornamento del codice

Ogni volta che modifichi il codice in Apps Script devi creare un **nuovo deployment** (non aggiornare quello esistente) e usare il nuovo URL. Oppure crea un deployment di tipo "Versione testa" per test.

### Voglio aggiungere più dati

Modifica `Code.gs` aggiungendo nuove colonne nelle funzioni `write*` corrispondenti. Poi crea un nuovo deployment e aggiorna l'URL nella webapp.
