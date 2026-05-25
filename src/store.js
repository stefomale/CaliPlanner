// SkillPlanner — store with localStorage persistence
// Single state object, useStore() hook

// ── Profile management ────────────────────────────────────────
const SP_PROFILE_KEY = 'skillplanner.profile';
const SP_PROFILES = {
  lulu: { label: 'Lulù', emoji: '🌸' },
  gru:  { label: 'Gru',  emoji: '🦅' },
};

function getActiveProfile() {
  const p = localStorage.getItem(SP_PROFILE_KEY);
  return (p && SP_PROFILES[p]) ? p : 'lulu';
}

function getStoreKey() {
  return 'skillplanner.v1.' + getActiveProfile();
}

// Migration: if lulù and old key exists, move it over (run once)
(function migrateOldKey() {
  const OLD_KEY = 'skillplanner.v1';
  const old = localStorage.getItem(OLD_KEY);
  if (old && !localStorage.getItem('skillplanner.v1.lulu')) {
    localStorage.setItem('skillplanner.v1.lulu', old);
    localStorage.removeItem(OLD_KEY);
  }
})();

function switchProfile(name) {
  if (!SP_PROFILES[name]) return;
  localStorage.setItem(SP_PROFILE_KEY, name);
  location.reload();
}

const SP_STORE_KEY = getStoreKey();

const SP_I18N = {
  IT: {
    planner: 'Planner',
    today: 'Oggi',
    progress: 'Progressi',
    docs: 'Docs',
    catalog: 'Database esercizi',
    searchPlaceholder: 'Cerca esercizio…',
    weeks: 'Settimane',
    duplicateWeek: 'Duplica settimana',
    reset: 'Reset',
    fatigueLabel: 'Fatigue',
    intensityWarning: 'Carico CNS elevato: 2+ esercizi a intensità ≥4 nello stesso giorno',
    swapSuggestion: 'Considera lo swap di',
    swapWith: 'con la propedeutica',
    emptyDay: 'Trascina esercizi qui',
    todayTitle: 'Oggi',
    todayEmpty: 'Nessun allenamento pianificato.',
    weekDay: 'Settimana · Giorno',
    sets: 'Set',
    reps: 'Rep/Hold',
    rpe: 'RPE',
    rest: 'Rest',
    sec: 's',
    cancel: 'Annulla',
    apply: 'Applica',
    progressionPresets: 'Preset di progressione',
    sourceWeek: 'Da settimana',
    targetWeek: 'A settimana',
    perExerciseTuning: 'Tuning per esercizio',
    sessionPreset: 'Carica sessione',
    weekPreset: 'Preset settimana',
    addFinisher: 'Aggiungi finisher',
    calibrateIntensity: 'Calibra intensità',
    intensityCalibration: 'Calibrazione intensità personale',
    intensityHint: "Sovrascrivi il livello default 1-5 per ogni esercizio in base al tuo livello. Influenza fatigue score e alert.",
    default: 'default',
    custom: 'custom',
    superset: 'Superset',
    linkWithNext: 'Lega al successivo',
    unlinkFromGroup: 'Slega dal gruppo',
    clearDay: 'Svuota giorno',
    replace: 'Sostituisci',
    append: 'Aggiungi',
  },
  EN: {
    planner: 'Planner',
    today: 'Today',
    progress: 'Progress',
    docs: 'Docs',
    catalog: 'Exercise database',
    searchPlaceholder: 'Search exercise…',
    weeks: 'Weeks',
    duplicateWeek: 'Duplicate week',
    reset: 'Reset',
    fatigueLabel: 'Fatigue',
    intensityWarning: 'High CNS load: 2+ exercises at intensity ≥4 on the same day',
    swapSuggestion: 'Consider swapping',
    swapWith: 'with the regression',
    emptyDay: 'Drag exercises here',
    todayTitle: 'Today',
    todayEmpty: 'No workout planned.',
    weekDay: 'Week · Day',
    sets: 'Sets',
    reps: 'Reps/Hold',
    rpe: 'RPE',
    rest: 'Rest',
    sec: 's',
    cancel: 'Cancel',
    apply: 'Apply',
    progressionPresets: 'Progression presets',
    sourceWeek: 'From week',
    targetWeek: 'To week',
    perExerciseTuning: 'Per-exercise tuning',
    sessionPreset: 'Load session',
    weekPreset: 'Week preset',
    addFinisher: 'Add finisher',
    calibrateIntensity: 'Calibrate intensity',
    intensityCalibration: 'Personal intensity calibration',
    intensityHint: 'Override default 1-5 level per exercise based on your athletic level. Affects fatigue score and alerts.',
    default: 'default',
    custom: 'custom',
    superset: 'Superset',
    linkWithNext: 'Link to next',
    unlinkFromGroup: 'Unlink from group',
    clearDay: 'Clear day',
    replace: 'Replace',
    append: 'Append',
  },
};

function spLoadState() {
  try {
    const raw = localStorage.getItem(getStoreKey());
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function spSaveState(state) {
  try { localStorage.setItem(getStoreKey(), JSON.stringify(state)); }
  catch (e) { /* ignore */ }
}

function spInitialState() {
  const loaded = spLoadState();
  if (loaded) {
    return {
      userExerciseLevels: {},
      userExercises: [],
      ...loaded,
    };
  }
  return {
    meso: window.SP_DEFAULT_MESO(),
    completedItems: {},
    activeWeekIndex: 0,
    today: { weekIdx: 0, dayIdx: 0 },
    userExerciseLevels: {},
    userExercises: [],   // user-created exercises (full Exercise objects)
  };
}

// Keep SP_BY_ID synced with the user's custom exercises so lookups
// everywhere (fatigue calc, rendering, etc.) work transparently.
function spSyncUserExercises(userExercises) {
  // Remove previously-injected user entries
  for (const k of Object.keys(window.SP_BY_ID)) {
    if (k.startsWith('user-')) delete window.SP_BY_ID[k];
  }
  for (const ex of userExercises || []) {
    window.SP_BY_ID[ex.id] = ex;
  }
}

// React hook
function useSpStore() {
  const [state, setState] = React.useState(() => {
    const s = spInitialState();
    spSyncUserExercises(s.userExercises);
    return s;
  });
  React.useEffect(() => { spSaveState(state); }, [state]);
  // Sync custom exercises into SP_BY_ID whenever they change.
  React.useEffect(() => { spSyncUserExercises(state.userExercises); }, [state.userExercises]);

  // Actions
  const actions = React.useMemo(() => ({
    setMeso: (updater) => setState(s => ({ ...s, meso: typeof updater === 'function' ? updater(s.meso) : updater })),
    setActiveWeek: (idx) => setState(s => ({ ...s, activeWeekIndex: idx })),
    setToday: (weekIdx, dayIdx) => setState(s => ({ ...s, today: { weekIdx, dayIdx } })),
    toggleComplete: (uid) => setState(s => ({
      ...s,
      completedItems: { ...s.completedItems, [uid]: !s.completedItems[uid] },
    })),
    resetTodayCompletions: () => setState(s => ({ ...s, completedItems: {} })),
    addExerciseToDay: (weekIdx, dayIdx, exerciseId, section = 'main') => setState(s => {
      const ex = window.SP_BY_ID[exerciseId];
      if (!ex) return s;
      const newItem = {
        uid: `${exerciseId}-${Date.now().toString(36)}`,
        exerciseId,
        section,
        ...ex.scheme,
      };
      const meso = structuredClone(s.meso);
      const day = meso.weeks[weekIdx].days[dayIdx];
      day.items.push(newItem);
      day.items = window.SP_SORT_BY_SECTION(day.items);
      return { ...s, meso };
    }),
    removeItem: (weekIdx, dayIdx, uid) => setState(s => {
      const meso = structuredClone(s.meso);
      meso.weeks[weekIdx].days[dayIdx].items =
        meso.weeks[weekIdx].days[dayIdx].items.filter(it => it.uid !== uid);
      return { ...s, meso };
    }),
    updateItem: (weekIdx, dayIdx, uid, patch) => setState(s => {
      const meso = structuredClone(s.meso);
      const items = meso.weeks[weekIdx].days[dayIdx].items;
      const idx = items.findIndex(it => it.uid === uid);
      if (idx >= 0) items[idx] = { ...items[idx], ...patch };
      return { ...s, meso };
    }),
    setItemSection: (weekIdx, dayIdx, uid, section) => setState(s => {
      const meso = structuredClone(s.meso);
      const items = meso.weeks[weekIdx].days[dayIdx].items;
      const idx = items.findIndex(it => it.uid === uid);
      if (idx >= 0) {
        items[idx].section = section;
        // Cambio sezione → spezza supersets per coerenza
        items[idx].supersetGroup = null;
      }
      meso.weeks[weekIdx].days[dayIdx].items = window.SP_SORT_BY_SECTION(items);
      return { ...s, meso };
    }),
    moveItem: (fromW, fromD, fromIdx, toW, toD, toIdx, targetSection) => setState(s => {
      const meso = structuredClone(s.meso);
      const fromItems = meso.weeks[fromW].days[fromD].items;
      const [moved] = fromItems.splice(fromIdx, 1);
      if (targetSection && moved.section !== targetSection) {
        moved.section = targetSection;
        moved.supersetGroup = null;
      }
      const toItems = meso.weeks[toW].days[toD].items;
      const insertIdx = (toW === fromW && toD === fromD && toIdx > fromIdx) ? toIdx - 1 : toIdx;
      toItems.splice(insertIdx, 0, moved);
      meso.weeks[toW].days[toD].items = window.SP_SORT_BY_SECTION(toItems);
      return { ...s, meso };
    }),
    renameDay: (weekIdx, dayIdx, label) => setState(s => {
      const meso = structuredClone(s.meso);
      meso.weeks[weekIdx].days[dayIdx].label = label;
      return { ...s, meso };
    }),
    duplicateWeek: (fromIdx, toIdx, preset, tuning) => setState(s => {
      const meso = structuredClone(s.meso);
      const source = meso.weeks[fromIdx];
      const target = meso.weeks[toIdx];
      target.days = source.days.map((day, di) => ({
        label: day.label,
        items: day.items.map((it, ii) => {
          const tuneKey = `${di}-${ii}`;
          const t = tuning?.[tuneKey] || {};
          let exerciseId = it.exerciseId;
          let sets = it.sets;
          let reps = it.reps;
          let rpe = it.rpe;
          let rest = it.rest;

          // Apply preset
          if (preset === 'volume') {
            sets = sets + 1;
          } else if (preset === 'intensity-down') {
            rpe = Math.max(6, rpe - 1);
            const reg = spRegressionId(it.exerciseId);
            if (reg) exerciseId = reg;
          } else if (preset === 'deload') {
            sets = Math.max(2, Math.floor(sets * 0.6));
            rpe = Math.max(5, rpe - 2);
            rest = Math.max(60, Math.floor(rest * 0.8));
          }
          // Apply per-exercise tuning (overrides preset on these fields)
          if (t.regression) {
            const reg = spRegressionId(it.exerciseId);
            if (reg) exerciseId = reg;
          }
          if (t.progression) {
            const prog = spProgressionId(it.exerciseId);
            if (prog) exerciseId = prog;
          }
          if (t.setsDelta) sets = Math.max(1, sets + t.setsDelta);

          return {
            uid: `${exerciseId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,5)}`,
            exerciseId, sets, reps, rpe, rest,
          };
        }),
      }));
      return { ...s, meso };
    }),
    resetAll: () => {
      localStorage.removeItem(getStoreKey());
      setState(spInitialState());
    },

    // ===== Custom intensity calibration =====
    setUserLevel: (exId, level) => setState(s => ({
      ...s,
      userExerciseLevels: { ...s.userExerciseLevels, [exId]: level },
    })),
    clearUserLevel: (exId) => setState(s => {
      const next = { ...s.userExerciseLevels };
      delete next[exId];
      return { ...s, userExerciseLevels: next };
    }),
    resetUserLevels: () => setState(s => ({ ...s, userExerciseLevels: {} })),

    // ===== Custom user exercises =====
    addUserExercise: (ex) => setState(s => {
      const id = ex.id || `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const fullEx = { ...ex, id };
      return { ...s, userExercises: [...(s.userExercises || []), fullEx] };
    }),
    updateUserExercise: (id, patch) => setState(s => ({
      ...s,
      userExercises: (s.userExercises || []).map(e => e.id === id ? { ...e, ...patch } : e),
    })),
    removeUserExercise: (id) => setState(s => {
      // Also remove any session items in the meso that reference this exercise
      const meso = structuredClone(s.meso);
      for (const w of meso.weeks) {
        for (const d of w.days) {
          d.items = d.items.filter(it => it.exerciseId !== id);
        }
      }
      return {
        ...s,
        userExercises: (s.userExercises || []).filter(e => e.id !== id),
        meso,
      };
    }),

    // ===== Superset =====
    toggleSupersetWithNext: (weekIdx, dayIdx, uid) => setState(s => {
      const meso = structuredClone(s.meso);
      const items = meso.weeks[weekIdx].days[dayIdx].items;
      const i = items.findIndex(it => it.uid === uid);
      if (i < 0 || i >= items.length - 1) return s;
      const cur = items[i];
      const nxt = items[i + 1];
      // Solo se nella stessa sezione
      if ((cur.section || 'main') !== (nxt.section || 'main')) return s;
      if (cur.supersetGroup && cur.supersetGroup === nxt.supersetGroup) {
        nxt.supersetGroup = null;
        const groupCount = items.filter(it => it.supersetGroup === cur.supersetGroup).length;
        if (groupCount === 1) cur.supersetGroup = null;
      } else {
        const groupId = cur.supersetGroup || `g-${Date.now().toString(36)}`;
        cur.supersetGroup = groupId;
        nxt.supersetGroup = groupId;
      }
      return { ...s, meso };
    }),
    ungroupSuperset: (weekIdx, dayIdx, groupId) => setState(s => {
      const meso = structuredClone(s.meso);
      const items = meso.weeks[weekIdx].days[dayIdx].items;
      for (const it of items) {
        if (it.supersetGroup === groupId) it.supersetGroup = null;
      }
      return { ...s, meso };
    }),

    // ===== Preset loading =====
    loadSessionPreset: (weekIdx, dayIdx, presetId, mode = 'replace') => setState(s => {
      const preset = window.SP_SESSION_PRESETS.find(p => p.id === presetId);
      if (!preset) return s;
      const items = window.SP_EXPAND_PRESET(preset);
      const meso = structuredClone(s.meso);
      const day = meso.weeks[weekIdx].days[dayIdx];
      if (mode === 'replace') {
        day.items = items;
        day.label = preset.name;
      } else {
        day.items = [...day.items, ...items];
      }
      return { ...s, meso };
    }),
    appendFinisher: (weekIdx, dayIdx, presetId) => setState(s => {
      const preset = window.SP_FINISHER_PRESETS.find(p => p.id === presetId);
      if (!preset) return s;
      const items = window.SP_EXPAND_PRESET(preset);
      const meso = structuredClone(s.meso);
      const day = meso.weeks[weekIdx].days[dayIdx];
      day.items = window.SP_SORT_BY_SECTION([...day.items, ...items]);
      return { ...s, meso };
    }),
    loadWeekPreset: (weekIdx, presetId) => setState(s => {
      const wp = window.SP_WEEK_PRESETS.find(p => p.id === presetId);
      if (!wp) return s;
      const meso = structuredClone(s.meso);
      wp.days.forEach((dayPresetId, di) => {
        const sp = window.SP_SESSION_PRESETS.find(p => p.id === dayPresetId);
        if (sp && meso.weeks[weekIdx].days[di]) {
          meso.weeks[weekIdx].days[di].items = window.SP_EXPAND_PRESET(sp);
          meso.weeks[weekIdx].days[di].label = sp.name;
        }
      });
      return { ...s, meso };
    }),
    clearDay: (weekIdx, dayIdx) => setState(s => {
      const meso = structuredClone(s.meso);
      meso.weeks[weekIdx].days[dayIdx].items = [];
      return { ...s, meso };
    }),
  }), []);

  return [state, actions];
}

// Helpers for progression chain
function spRegressionId(exId) {
  const info = window.SP_PROG_INDEX[exId];
  if (!info || info.position === 0) return null;
  return window.SP_PROGRESSIONS[info.chain][info.position - 1];
}
function spProgressionId(exId) {
  const info = window.SP_PROG_INDEX[exId];
  if (!info || info.position >= info.chainLength - 1) return null;
  return window.SP_PROGRESSIONS[info.chain][info.position + 1];
}

// Get effective level for an exercise (custom override or default)
function spGetEffectiveLevel(exId, userLevels) {
  const override = userLevels?.[exId];
  if (override != null) return override;
  return window.SP_BY_ID[exId]?.level || 1;
}

// Compute day fatigue 0-100 (sum of fatigueLoad × sets multiplier × intensity multiplier)
function spDayFatigue(items, userLevels) {
  let total = 0;
  for (const it of items) {
    const ex = window.SP_BY_ID[it.exerciseId];
    if (!ex) continue;
    const lvl = spGetEffectiveLevel(it.exerciseId, userLevels);
    const intensityMult = 0.6 + lvl * 0.18;
    const setsMult = 0.6 + it.sets * 0.12;
    const rpeMult = 0.7 + (it.rpe - 6) * 0.1;
    total += ex.fatigueLoad * intensityMult * setsMult * rpeMult * 0.5;
  }
  return Math.min(100, Math.round(total));
}

function spWeekFatigue(week, userLevels) {
  return week.days.reduce((s, d) => s + spDayFatigue(d.items, userLevels), 0) / 4;
}

function spFatigueState(score, threshold = 70) {
  if (score >= threshold + 15) return 'hi';
  if (score >= threshold) return 'warn';
  return 'ok';
}

// Detect high-intensity stacking (uses effective levels)
function spDayHighIntensityConflict(items, userLevels) {
  const high = items.filter(it => {
    return spGetEffectiveLevel(it.exerciseId, userLevels) >= 4;
  });
  return high.length >= 2 ? high : null;
}

// Skill progression tracking (where the user currently is on each chain)
function spCurrentSkillStop(items, chainName) {
  const chain = window.SP_PROGRESSIONS[chainName];
  let highest = -1;
  for (const week of items) {  // here items = all weeks
    for (const day of week.days) {
      for (const item of day.items) {
        const info = window.SP_PROG_INDEX[item.exerciseId];
        if (info && info.chain === chainName) {
          highest = Math.max(highest, info.position);
        }
      }
    }
  }
  return highest;
}

// Expose
window.SP_STORE = {
  useSpStore, spDayFatigue, spWeekFatigue, spFatigueState,
  spDayHighIntensityConflict, spRegressionId, spProgressionId,
  spCurrentSkillStop, spGetEffectiveLevel, SP_I18N,
  // Profile
  getActiveProfile, switchProfile, SP_PROFILES,
};
