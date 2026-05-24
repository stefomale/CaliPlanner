// ============================================================
// CaliPlanner → Google Sheets  |  Apps Script  (Code.gs)
// ============================================================
// Deploy: Extensions → Apps Script → Deploy → New deployment
//   Type: Web app  |  Execute as: Me  |  Who has access: Anyone
// Copia l'URL del deployment e incollalo nella webapp.
// ============================================================

// ── doPost — webapp → Sheets (scrittura) ─────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    writeBackup(ss, payload);       // JSON grezzo per il ripristino
    writeInfo(ss, payload);
    writePiano(ss, payload);
    writeCompletati(ss, payload);
    writeEserciziCustom(ss, payload);
    writeLivelliCustom(ss, payload);

    return ok({ syncedAt: new Date().toISOString() });
  } catch (err) {
    return ko(err.toString());
  }
}

// ── doGet — Sheets → webapp (lettura) ────────────────────────
// La webapp fa GET allo stesso URL del deployment per recuperare
// il backup JSON e ripristinarlo in localStorage.
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName('_Backup');

    if (!sh) {
      return ko('Nessun backup trovato. Esegui prima almeno un sync dalla webapp (⬆).');
    }

    const raw = sh.getRange('A1').getValue();
    if (!raw) {
      return ko('Il backup è vuoto. Esegui prima un sync dalla webapp (⬆).');
    }

    const state = JSON.parse(raw);
    return ok({ state: state });
  } catch (err) {
    return ko(err.toString());
  }
}

// ── Setup iniziale (eseguire una sola volta dall'editor) ──────
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Spreadsheet: ' + ss.getName());

  const tabs = [
    { name: 'Info',            headers: ['Chiave', 'Valore'] },
    { name: 'Piano',           headers: ['Settimana','Giorno','Label Giorno','Sezione','Esercizio ID','Nome Esercizio','Sets','Reps/Hold','RPE','Rest (s)','+Peso (kg)','-Band (kg)','Superset Group'] },
    { name: 'Completati',      headers: ['UID','Completato'] },
    { name: 'Esercizi Custom', headers: ['ID','Nome','Skill','Livello','Stimolo','Categoria','Fatigue Load','Default Sets','Default Reps','Default RPE','Default Rest (s)'] },
    { name: 'Livelli Custom',  headers: ['Esercizio ID','Nome Esercizio','Livello Custom'] },
  ];

  tabs.forEach(function(tab) {
    var sh = ss.getSheetByName(tab.name);
    if (!sh) {
      sh = ss.insertSheet(tab.name);
      Logger.log('Creato tab: ' + tab.name);
    } else {
      Logger.log('Tab già esistente, aggiornato: ' + tab.name);
    }
    sh.clearContents();
    sh.appendRow(tab.headers);
    sh.getRange(1, 1, 1, tab.headers.length)
      .setFontWeight('bold')
      .setBackground('#f3f3f3');
    sh.setFrozenRows(1);
  });

  // Crea il tab _Backup (nascosto, usato dal doGet)
  var backup = ss.getSheetByName('_Backup');
  if (!backup) {
    backup = ss.insertSheet('_Backup');
    backup.hideSheet();
    Logger.log('Creato tab _Backup (nascosto)');
  }

  // Porta "Info" come primo tab visibile
  var info = ss.getSheetByName('Info');
  if (info) {
    ss.setActiveSheet(info);
    ss.moveActiveSheet(1);
  }

  // Rinomina il foglio predefinito se ancora presente
  var defaultSheet = ss.getSheetByName('Foglio1') || ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    defaultSheet.setName('_old');
    Logger.log('Foglio di default rinominato in _old — puoi eliminarlo.');
  }

  Logger.log('setupSheet completato: ' + tabs.map(function(t){ return t.name; }).join(', ') + ', _Backup');
}

// ── Sheet: _Backup — JSON grezzo (usato da doGet) ─────────────
function writeBackup(ss, payload) {
  var sh = ss.getSheetByName('_Backup');
  if (!sh) {
    sh = ss.insertSheet('_Backup');
    sh.hideSheet();
  }
  // Salva lo state puro (senza exerciseNames che sono read-only della webapp)
  var state = {
    meso:               payload.meso,
    activeWeekIndex:    payload.activeWeekIndex,
    today:              payload.today,
    completedItems:     payload.completedItems,
    userExerciseLevels: payload.userExerciseLevels,
    userExercises:      payload.userExercises,
  };
  sh.getRange('A1').setValue(JSON.stringify(state));
  sh.getRange('B1').setValue(new Date().toLocaleString('it-IT'));
  sh.getRange('A1:B1').setNotes([['Backup automatico — non modificare', 'Ultimo aggiornamento']]);
}

// ── Sheet: Info ───────────────────────────────────────────────
function writeInfo(ss, p) {
  const sh = getOrCreate(ss, 'Info');
  sh.clearContents();
  sh.appendRow(['Chiave', 'Valore']);

  const rows = [
    ['Ultimo sync',       new Date().toLocaleString('it-IT')],
    ['Nome mesociclo',    p.meso?.name ?? '—'],
    ['Settimane totali',  p.meso?.weeks?.length ?? 0],
    ['Giorni/settimana',  p.meso?.weeks?.[0]?.days?.length ?? 0],
    ['Settimana attiva',  (p.activeWeekIndex ?? 0) + 1],
    ['Today · Settimana', (p.today?.weekIdx ?? 0) + 1],
    ['Today · Giorno',    (p.today?.dayIdx ?? 0) + 1],
    ['Esercizi custom',   (p.userExercises ?? []).length],
    ['Livelli custom',    Object.keys(p.userExerciseLevels ?? {}).length],
  ];

  rows.forEach(r => sh.appendRow(r));
  sh.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#f3f3f3');
  sh.setFrozenRows(1);
}

// ── Sheet: Piano ──────────────────────────────────────────────
function writePiano(ss, p) {
  const sh = getOrCreate(ss, 'Piano');
  sh.clearContents();

  const headers = [
    'Settimana','Giorno','Label Giorno','Sezione',
    'Esercizio ID','Nome Esercizio',
    'Sets','Reps/Hold','RPE','Rest (s)','+Peso (kg)','-Band (kg)','Superset Group'
  ];
  sh.appendRow(headers);

  const names = p.exerciseNames ?? {};
  const rows  = [];

  (p.meso?.weeks ?? []).forEach((week, wi) => {
    (week.days ?? []).forEach((day, di) => {
      (day.items ?? []).forEach(item => {
        rows.push([
          `W${wi + 1}`,
          `D${di + 1}`,
          day.label || `Day ${di + 1}`,
          item.section || 'main',
          item.exerciseId,
          names[item.exerciseId] || item.exerciseId,
          item.sets        ?? 0,
          item.reps        ?? '',
          item.rpe         ?? 0,
          item.rest        ?? 0,
          item.weight      || 0,
          item.bandAssist  || 0,
          item.supersetGroup || '',
        ]);
      });
    });
  });

  if (rows.length) {
    sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
  sh.setFrozenRows(1);
}

// ── Sheet: Completati ─────────────────────────────────────────
function writeCompletati(ss, p) {
  const sh = getOrCreate(ss, 'Completati');
  sh.clearContents();
  sh.appendRow(['UID', 'Completato']);

  const completed = p.completedItems ?? {};
  const rows = Object.entries(completed)
    .filter(([, v]) => v)
    .map(([uid]) => [uid, true]);

  if (rows.length) sh.getRange(2, 1, rows.length, 2).setValues(rows);
  sh.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#f3f3f3');
  sh.setFrozenRows(1);
}

// ── Sheet: Esercizi Custom ────────────────────────────────────
function writeEserciziCustom(ss, p) {
  const sh = getOrCreate(ss, 'Esercizi Custom');
  sh.clearContents();

  const headers = [
    'ID','Nome','Skill','Livello','Stimolo','Categoria',
    'Fatigue Load','Default Sets','Default Reps','Default RPE','Default Rest (s)'
  ];
  sh.appendRow(headers);

  const rows = (p.userExercises ?? []).map(ex => [
    ex.id,
    ex.name,
    ex.skill,
    ex.level,
    ex.stimulus,
    ex.category,
    ex.fatigueLoad,
    ex.scheme?.sets  ?? 0,
    ex.scheme?.reps  ?? '',
    ex.scheme?.rpe   ?? 0,
    ex.scheme?.rest  ?? 0,
  ]);

  if (rows.length) sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
  sh.setFrozenRows(1);
}

// ── Sheet: Livelli Custom ─────────────────────────────────────
function writeLivelliCustom(ss, p) {
  const sh = getOrCreate(ss, 'Livelli Custom');
  sh.clearContents();
  sh.appendRow(['Esercizio ID', 'Nome Esercizio', 'Livello Custom']);

  const levels = p.userExerciseLevels ?? {};
  const names  = p.exerciseNames      ?? {};
  const rows   = Object.entries(levels).map(([id, lvl]) => [id, names[id] || id, lvl]);

  if (rows.length) sh.getRange(2, 1, rows.length, 3).setValues(rows);
  sh.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#f3f3f3');
  sh.setFrozenRows(1);
}

// ── Helpers ───────────────────────────────────────────────────
function getOrCreate(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify(Object.assign({ ok: true }, data)))
    .setMimeType(ContentService.MimeType.JSON);
}

function ko(error) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: error }))
    .setMimeType(ContentService.MimeType.JSON);
}
