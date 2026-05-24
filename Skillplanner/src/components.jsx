// SkillPlanner — shared components (badges, gauges, modals)
/* global React */

const { useState, useRef, useEffect, useMemo } = React;

// Format helpers — show weight (+kg) and band-assist (−kg) inline
function spFormatReps(item) {
  let s = String(item.reps);
  if (item.weight)     s += ` +${item.weight}kg`;
  if (item.bandAssist) s += ` −${item.bandAssist}kg`;
  return s;
}
function spFormatSchemeLine(item) {
  return `${item.sets}×${spFormatReps(item)} · RPE${item.rpe} · ${item.rest}s`;
}

const SCHEME_FIELDS = [
  { field: 'sets',       label: 'sets',     type: 'number' },
  { field: 'reps',       label: 'rep/hold', type: 'text' },
  { field: 'rpe',        label: 'rpe',      type: 'number' },
  { field: 'rest',       label: 'rest',     type: 'number' },
  { field: 'weight',     label: '+kg',      type: 'number' },
  { field: 'bandAssist', label: '−kg band', type: 'number' },
];

function SchemeEditor({ item, onChange }) {
  return (
    <div className="scheme-edit">
      {SCHEME_FIELDS.map(({ field, label, type }) => (
        <div className="scheme-field" key={field}>
          <label>{label}</label>
          <input
            type={type}
            value={item[field] ?? (type === 'number' ? 0 : '')}
            step={field === 'weight' || field === 'bandAssist' ? 0.5 : 1}
            onChange={(e) => {
              const raw = type === 'text' ? e.target.value : Number(e.target.value);
              onChange({ [field]: raw });
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// InlineField — click-to-edit a single value as if it were inline text.
// Used for sets/reps/rpe/rest/weight/bandAssist directly in the scheme line.
// ─────────────────────────────────────────────────────────────────────────
function InlineField({
  value, onCommit, type = 'number', step = 1,
  prefix = '', suffix = '', ghost = false, ghostLabel,
  className = '', title = 'clicca per modificare',
  size = 'sm',
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setDraft(value === 0 && ghost ? '' : (value ?? ''));
      const id = requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select?.();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [editing]); // eslint-disable-line

  const commit = () => {
    let newVal = draft;
    if (type === 'number') {
      newVal = draft === '' || draft == null ? 0 : Number(draft);
      if (Number.isNaN(newVal)) newVal = value;
    } else {
      newVal = String(draft);
    }
    if (newVal !== value) onCommit(newVal);
    setEditing(false);
  };

  // Auto-width based on content length
  const displayStr = `${prefix}${value ?? ''}${suffix}`;
  const charLen = String(value ?? '').length || 1;

  if (editing) {
    return (
      <span className={`inline-edit-wrap ${className}`}>
        {prefix && <span className="inline-edit__fix">{prefix}</span>}
        <input
          ref={inputRef}
          className={`inline-input inline-input--${size}`}
          type={type}
          step={step}
          value={draft}
          style={{ width: `${Math.max(charLen + 1, 2.2)}ch` }}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          onKeyDown={e => {
            if (e.key === 'Enter')      { e.preventDefault(); commit(); }
            else if (e.key === 'Escape'){ setEditing(false); }
          }}
          draggable={false}
          onDragStart={e => e.preventDefault()}
        />
        {suffix && <span className="inline-edit__fix">{suffix}</span>}
      </span>
    );
  }

  const isGhost = ghost && (value === 0 || value == null || value === '');
  const label = isGhost
    ? (ghostLabel || `${prefix}${suffix.replace(/^\s+/, '').trim()}`)
    : displayStr;

  return (
    <span
      className={`inline-field ${isGhost ? 'inline-field--ghost' : ''} ${className}`}
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      onMouseDown={e => e.stopPropagation()}
      title={title}
      draggable={false}
      onDragStart={e => e.preventDefault()}
    >{label}</span>
  );
}

function LevelChip({ level, custom }) {
  return <span className={`lvl lvl--${level} ${custom ? 'lvl--custom' : ''}`} title={custom ? 'custom level' : ''}>{level}</span>;
}

// RpeChip — chip colorato che mostra RPE 1-10 (sostituisce LevelChip nei session items)
function RpeChip({ rpe }) {
  const v = rpe || 0;
  return (
    <span className={`rpe rpe--${Math.min(10, Math.max(1, v))}`} title={`RPE ${v}`}>{v}</span>
  );
}

function StimChip({ stimulus }) {
  return <span className="stim">{stimulus}</span>;
}

function FatigueBar({ score, threshold = 70 }) {
  const state = window.SP_STORE.spFatigueState(score, threshold);
  return (
    <div className="fatigue">
      <div className="fatigue__bar">
        <div className="fatigue__fill" data-state={state} style={{ '--w': `${Math.min(100, score)}%` }} />
      </div>
      <span className="fatigue__num mono">{score}</span>
    </div>
  );
}

// Draggable card from the catalog rail
// insertCtx = { days: [{idx, label}], onInsert: (dayIdx, section) => void }
function ExerciseCard({ ex, onDragStart, userLevels, onEdit, insertCtx }) {
  const [insertOpen, setInsertOpen] = useState(false);
  const [insertDay, setInsertDay] = useState(null);
  const isUserDefined = ex.id.startsWith('user-');
  const defaultRpe = ex.scheme?.rpe ?? 7;

  const closeInsert = () => { setInsertOpen(false); setInsertDay(null); };

  return (
    <div
      className={`ex-card ${isUserDefined ? 'ex-card--user' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-sp-ex', ex.id);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart?.(ex.id);
        closeInsert();
      }}
      title={ex.name}
    >
      {/* Riga principale */}
      <RpeChip rpe={defaultRpe} />
      <div className="ex-card__main">
        <div className="ex-card__name">
          {ex.name}
          {isUserDefined && <span className="ex-card__user-tag" title="Esercizio custom">★</span>}
        </div>
        <div className="ex-card__meta">
          <span>{ex.stimulus}</span>
          <span>·</span>
          <span>{ex.category}</span>
        </div>
      </div>
      {onEdit && (
        <button
          className="icon-btn ex-card__edit"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          onMouseDown={(e) => e.stopPropagation()}
          draggable={false} onDragStart={(e) => e.preventDefault()}
          title="Modifica esercizio"
        >✎</button>
      )}
      {insertCtx && (
        <button
          className={`icon-btn ex-card__insert-btn ${insertOpen ? 'icon-btn--on' : ''}`}
          onClick={(e) => { e.stopPropagation(); setInsertOpen(o => !o); setInsertDay(null); }}
          onMouseDown={(e) => e.stopPropagation()}
          draggable={false} onDragStart={(e) => e.preventDefault()}
          title="Aggiungi a una giornata"
        >→</button>
      )}

      {/* Pannello insert — espansione inline sotto la riga principale */}
      {insertCtx && insertOpen && (
        <div className="ex-card__insert-panel" onClick={(e) => e.stopPropagation()}>
          {/* Step 1: scegli il giorno */}
          <div className="ex-card__insert-label">Giorno</div>
          <div className="ex-card__insert-row">
            {insertCtx.days.map(d => (
              <button
                key={d.idx}
                className={`ex-card__insert-chip ${insertDay === d.idx ? 'ex-card__insert-chip--active' : ''}`}
                onClick={() => setInsertDay(i => i === d.idx ? null : d.idx)}
              >{d.label || `D${d.idx + 1}`}</button>
            ))}
          </div>
          {/* Step 2: scegli il blocco (appare solo dopo aver scelto il giorno) */}
          {insertDay !== null && (
            <>
              <div className="ex-card__insert-label">Blocco</div>
              <div className="ex-card__insert-row">
                {window.SP_SECTION_ORDER.map(sec => (
                  <button
                    key={sec}
                    className="ex-card__insert-chip ex-card__insert-chip--sec"
                    onClick={() => {
                      insertCtx.onInsert(insertDay, sec);
                      closeInsert();
                    }}
                  >{window.SP_SECTION_LABELS[sec]}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Session item — used standalone OR inside a SupersetBox row
// ─────────────────────────────────────────────────────────────────────────
function SessionItem({ item, weekIdx, dayIdx, globalIdx, actions, userLevels, inSuperset, showLinkButton, t, hideSchemeSets }) {
  const ex = window.SP_BY_ID[item.exerciseId];
  if (!ex) return null;

  const patch = (p) => actions.updateItem(weekIdx, dayIdx, item.uid, p);

  if (inSuperset) {
    // Compact row used inside SupersetBox: name + reps + remove
    return (
      <div
        className="ssbox__row"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/x-sp-item', JSON.stringify({ uid: item.uid, weekIdx, dayIdx, idx: globalIdx }));
          e.dataTransfer.effectAllowed = 'move';
        }}
      >
        <RpeChip rpe={item.rpe} />
        <span className="ssbox__name" title={ex.name}>{ex.name}</span>
        <span className="ssbox__reps mono">
          <InlineField
            value={item.reps}
            type="text"
            onCommit={(v) => patch({ reps: v })}
            title="rep / hold"
          />
          {item.weight ? (
            <InlineField
              value={item.weight}
              type="number" step={0.5}
              prefix=" +" suffix="kg"
              onCommit={(v) => patch({ weight: v })}
              title="peso aggiunto"
            />
          ) : null}
          {item.bandAssist ? (
            <InlineField
              value={item.bandAssist}
              type="number" step={0.5}
              prefix=" −" suffix="kg"
              onCommit={(v) => patch({ bandAssist: v })}
              title="assistenza band"
            />
          ) : null}
        </span>
        <button
          className="icon-btn"
          onClick={() => actions.removeItem(weekIdx, dayIdx, item.uid)}
          title="Rimuovi"
        >×</button>
      </div>
    );
  }

  // Standalone (no superset)
  return (
    <div
      className="sitem"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-sp-item', JSON.stringify({ uid: item.uid, weekIdx, dayIdx, idx: globalIdx }));
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <RpeChip rpe={item.rpe} />
      <div className="sitem__main">
        <div className="sitem__row1">
          <span className="sitem__name" title={ex.name}>{ex.name}</span>
        </div>
        <div className="sitem__scheme">
          <span className="sitem__stim">{ex.stimulus}</span>
          {!hideSchemeSets && (
            <InlineField
              value={item.sets}
              type="number"
              suffix="×"
              onCommit={(v) => patch({ sets: Math.max(1, v) })}
              title="set"
            />
          )}
          <InlineField
            value={item.reps}
            type="text"
            onCommit={(v) => patch({ reps: v })}
            title="rep / hold"
          />
          <InlineField
            value={item.weight || 0}
            type="number" step={0.5}
            prefix="+" suffix="kg"
            ghost ghostLabel="+kg"
            onCommit={(v) => patch({ weight: v })}
            title="peso aggiunto"
          />
          <InlineField
            value={item.bandAssist || 0}
            type="number" step={0.5}
            prefix="−" suffix="kg"
            ghost ghostLabel="−band"
            onCommit={(v) => patch({ bandAssist: v })}
            title="assistenza con elastico"
          />
          <span className="sitem__sep">·</span>
          <InlineField
            value={item.rpe}
            type="number"
            onCommit={(v) => patch({ rpe: Math.max(1, Math.min(10, v)) })}
            title="RPE (1-10)"
          />
          <span className="sitem__sep">·</span>
          <InlineField
            value={item.rest}
            type="number" step={5}
            suffix="s"
            onCommit={(v) => patch({ rest: Math.max(0, v) })}
            title="rest in secondi"
          />
        </div>
      </div>
      <div className="sitem__actions">
        {showLinkButton && (
          <button
            className="icon-btn"
            onClick={() => actions.toggleSupersetWithNext(weekIdx, dayIdx, item.uid)}
            title="Lega al successivo"
          >⇣</button>
        )}
        <button className="icon-btn" onClick={() => actions.removeItem(weekIdx, dayIdx, item.uid)} title="Rimuovi">×</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SupersetBox — raggruppa N items in un riquadro
// Layout (richiesto dall'utente):
//   header: label gruppo + SETS in alto a destra
//   body:   nomi degli esercizi uno sotto l'altro
//   meta:   reps in ordine · rest · RPE
// ─────────────────────────────────────────────────────────────────────────
function SupersetBox({ items, label, weekIdx, dayIdx, actions, userLevels }) {
  const first = items[0];
  const groupId = first.supersetGroup;
  const sets = first.sets;
  const rest = first.rest;

  // Patch a field on every item in the group so shared values stay in sync.
  const patchGroup = (p) => items.forEach(it => actions.updateItem(weekIdx, dayIdx, it.uid, p));

  return (
    <div className="ssbox">
      <div className="ssbox__head">
        <span className="ssbox__label">SUPERSET {label}</span>
        <span className="ssbox__sets mono">
          <InlineField
            value={sets}
            type="number"
            suffix="×"
            onCommit={(v) => patchGroup({ sets: Math.max(1, v) })}
            title="set (condiviso)"
          />
        </span>
      </div>
      <div className="ssbox__items">
        {items.map(it => (
          <SessionItem
            key={it.uid}
            item={it}
            weekIdx={weekIdx}
            dayIdx={dayIdx}
            globalIdx={it.globalIdx}
            actions={actions}
            userLevels={userLevels}
            inSuperset
          />
        ))}
      </div>
      <div className="ssbox__meta">
        <span className="ssbox__rest mono">
          rest&nbsp;
          <InlineField
            value={rest}
            type="number" step={5}
            suffix="s"
            onCommit={(v) => patchGroup({ rest: Math.max(0, v) })}
            title="rest in secondi (condiviso)"
          />
        </span>
      </div>
      <button
        className="ssbox__ungroup"
        onClick={() => actions.ungroupSuperset(weekIdx, dayIdx, groupId)}
        title="Separa il gruppo"
      >⊟ separa</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// DaySection — render di una sezione (warmup/main/core/finisher) con dropzone
// ─────────────────────────────────────────────────────────────────────────
function DaySection({ section, label, items, sectionGroups, weekIdx, dayIdx, actions, userLevels, t, ssLetters }) {
  const [isDropTarget, setDropTarget] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDropTarget(false);
    const exId = e.dataTransfer.getData('application/x-sp-ex');
    if (exId) {
      actions.addExerciseToDay(weekIdx, dayIdx, exId, section);
      return;
    }
    const itemData = e.dataTransfer.getData('application/x-sp-item');
    if (itemData) {
      const { weekIdx: fW, dayIdx: fD, idx: fI } = JSON.parse(itemData);
      actions.moveItem(fW, fD, fI, weekIdx, dayIdx, 999, section);
    }
  };
  const handleDragOver = (e) => {
    if (e.dataTransfer.types.includes('application/x-sp-ex') ||
        e.dataTransfer.types.includes('application/x-sp-item')) {
      e.preventDefault();
      setDropTarget(true);
    }
  };

  return (
    <div className="day__section">
      <div className="day__section-head">
        <span>{label}</span>
        <span className="day__section-count mono">{items.length || '·'}</span>
      </div>
      <div
        className={`day__section-body ${isDropTarget ? 'is-drop-target' : ''} ${items.length === 0 ? 'is-empty' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={() => setDropTarget(false)}
        onDrop={handleDrop}
      >
        {items.length === 0 ? (
          <div className="day__section-empty">drop · {label.toLowerCase()}</div>
        ) : (
          sectionGroups.map((group, gi) => {
            if (group.supersetGroup && group.items.length > 1) {
              const letter = ssLetters[group.supersetGroup];
              return (
                <SupersetBox
                  key={group.supersetGroup}
                  items={group.items}
                  label={letter}
                  weekIdx={weekIdx}
                  dayIdx={dayIdx}
                  actions={actions}
                  userLevels={userLevels}
                />
              );
            }
            // Solo single item — può linkare al successivo se nella stessa sezione
            const it = group.items[0];
            const nextGroup = sectionGroups[gi + 1];
            const showLink = !!nextGroup;
            return (
              <SessionItem
                key={it.uid}
                item={it}
                weekIdx={weekIdx}
                dayIdx={dayIdx}
                globalIdx={it.globalIdx}
                actions={actions}
                userLevels={userLevels}
                showLinkButton={showLink}
                t={t}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// Iniziali di un nome esercizio (es. "Tuck Planche" → "TP")
function getExInitials(name) {
  return name.split(/\s+/).map(w => w[0]).filter(Boolean).join('').toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────
// DayColumn — 4 sezioni, collassabile, selezionabile
// ─────────────────────────────────────────────────────────────────────────
function DayColumn({ day, weekIdx, dayIdx, actions, threshold, t, userLevels, onLoadSession, onAddFinisher, focus }) {
  const fatigue = window.SP_STORE.spDayFatigue(day.items, userLevels);
  const conflict = window.SP_STORE.spDayHighIntensityConflict(day.items, userLevels);
  const [menuOpen, setMenuOpen] = useState(false);
  // Focus mode: sempre espanso. Grid mode: collassato su mobile, espanso su desktop.
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const [collapsed, setCollapsed] = useState(focus ? false : isMobile);

  // Group items by section
  const sectionData = useMemo(() => {
    const SECTIONS = window.SP_SECTION_ORDER;
    const bySection = {};
    SECTIONS.forEach(s => bySection[s] = []);
    day.items.forEach((it, idx) => {
      const sec = it.section || 'main';
      if (!bySection[sec]) bySection[sec] = [];
      bySection[sec].push({ ...it, globalIdx: idx });
    });
    const result = {};
    const ssLetters = {};
    let letterIdx = 0;
    for (const sec of SECTIONS) {
      const items = bySection[sec];
      const groups = [];
      let cur = null;
      for (const it of items) {
        if (it.supersetGroup && cur && cur.supersetGroup === it.supersetGroup) {
          cur.items.push(it);
        } else {
          cur = { supersetGroup: it.supersetGroup, items: [it] };
          groups.push(cur);
        }
        if (it.supersetGroup && !(it.supersetGroup in ssLetters)) {
          ssLetters[it.supersetGroup] = String.fromCharCode(65 + (letterIdx++));
        }
      }
      result[sec] = { items, groups };
    }
    return { result, ssLetters };
  }, [day.items]);

  // Iniziali di tutti gli esercizi della giornata
  const initials = useMemo(() => {
    if (day.items.length === 0) return null;
    return day.items.map(it => {
      const ex = window.SP_BY_ID[it.exerciseId];
      return ex ? getExInitials(ex.name) : '?';
    }).join(' · ');
  }, [day.items]);

  return (
    <div className={`day ${focus ? 'day--focus' : ''}`}>
      <div className="day__head">
        <div className="day__title-row">
          <input
            className="day__title"
            value={day.label}
            onChange={(e) => actions.renameDay(weekIdx, dayIdx, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="day__num mono">D{dayIdx + 1}</span>
          {/* Dot rosso conflitto CNS — sostituisce il banner */}
          {conflict && (
            <span
              className="day__conflict-dot"
              title={t.intensityWarning}
            />
          )}
          <div className="day__menu-wrap">
            <button className="icon-btn" onClick={() => setMenuOpen(v => !v)} title="Menu" aria-haspopup="true">⋯</button>
            {menuOpen && (
              <div className="day__menu" onMouseLeave={() => setMenuOpen(false)}>
                <button onClick={() => { setMenuOpen(false); onLoadSession(weekIdx, dayIdx); }}>{t.sessionPreset}</button>
                <button onClick={() => { setMenuOpen(false); onAddFinisher(weekIdx, dayIdx); }}>{t.addFinisher}</button>
                <button onClick={() => { setMenuOpen(false); if (confirm('Svuotare il giorno?')) actions.clearDay(weekIdx, dayIdx); }}>
                  {t.clearDay}
                </button>
              </div>
            )}
          </div>
          {/* Toggle collapse */}
          <button
            className="day__collapse-btn"
            onClick={(e) => { e.stopPropagation(); setCollapsed(c => !c); }}
            title={collapsed ? 'Espandi' : 'Comprimi'}
          >{collapsed ? '▼' : '▲'}</button>
        </div>
        <FatigueBar score={fatigue} threshold={threshold} />
        {/* Iniziali esercizi — visibili sempre */}
        <div className={`day__initials ${!initials ? 'day__initials--empty' : ''}`}>
          {initials || (collapsed ? 'vuoto · trascina o seleziona' : '')}
        </div>
      </div>

      {/* Sezioni — visibili solo se espanso */}
      {!collapsed && (
        <div className="day__sections">
          {window.SP_SECTION_ORDER.map(sec => (
            <DaySection
              key={sec}
              section={sec}
              label={window.SP_SECTION_LABELS[sec]}
              items={sectionData.result[sec].items}
              sectionGroups={sectionData.result[sec].groups}
              ssLetters={sectionData.ssLetters}
              weekIdx={weekIdx}
              dayIdx={dayIdx}
              actions={actions}
              userLevels={userLevels}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Generic modal
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__head">
          <span className="modal__title">{title}</span>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>
  );
}

// Duplicate-week modal
function DuplicateWeekModal({ meso, fromIdx, onClose, onApply, t }) {
  const [toIdx, setToIdx] = useState(fromIdx === meso.weeks.length - 1 ? fromIdx : fromIdx + 1);
  const [preset, setPreset] = useState('volume');
  const [tuning, setTuning] = useState({});
  const source = meso.weeks[fromIdx];

  const setTune = (key, patch) => setTuning(s => ({ ...s, [key]: { ...(s[key] || {}), ...patch } }));

  const presets = [
    { id: 'volume',           title: '+ Volume',     desc: '+1 set per esercizio. RPE invariato.' },
    { id: 'intensity-down',   title: '− Intensità',  desc: '−1 RPE. Scala propedeutica di 1 step dove possibile.' },
    { id: 'deload',           title: 'Deload',       desc: 'Sets ×0.6, RPE −2, rest ×0.8.' },
  ];

  return (
    <Modal
      title={`${t.duplicateWeek} · W${fromIdx + 1} → W${toIdx + 1}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn--primary" onClick={() => { onApply(fromIdx, toIdx, preset, tuning); onClose(); }}>
            {t.apply}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label className="docs-kicker">{t.sourceWeek}</label>
          <select value={fromIdx} disabled style={{ width: '100%', padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg-sunk)' }}>
            {meso.weeks.map((w, i) => <option key={i} value={i}>W{i + 1}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label className="docs-kicker">{t.targetWeek}</label>
          <select value={toIdx} onChange={e => setToIdx(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)' }}>
            {meso.weeks.map((w, i) => i !== fromIdx && <option key={i} value={i}>W{i + 1}</option>)}
          </select>
        </div>
      </div>

      <label className="docs-kicker">{t.progressionPresets}</label>
      <div className="preset-group">
        {presets.map(p => (
          <button key={p.id} className={`preset ${preset === p.id ? 'preset--active' : ''}`} onClick={() => setPreset(p.id)}>
            <span className="preset__title">{p.title}</span>
            <span className="preset__desc">{p.desc}</span>
          </button>
        ))}
      </div>

      <label className="docs-kicker">{t.perExerciseTuning}</label>
      <div className="tune-table">
        {source.days.map((day, di) => (
          <div key={di}>
            <div style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginTop: 12, marginBottom: 4 }}>
              D{di + 1} · {day.label}
            </div>
            {day.items.map((it, ii) => {
              const ex = window.SP_BY_ID[it.exerciseId];
              const key = `${di}-${ii}`;
              const tune = tuning[key] || {};
              const setsDelta = tune.setsDelta || 0;
              const canReg = !!window.SP_STORE.spRegressionId(it.exerciseId);
              const canProg = !!window.SP_STORE.spProgressionId(it.exerciseId);
              return (
                <div key={ii} className="tune-row">
                  <div className="tune-row__name">
                    <LevelChip level={ex.level} />
                    <span>{ex.name}</span>
                  </div>
                  <div className="tune-cell">
                    <div className="tune-stepper">
                      <button onClick={() => setTune(key, { setsDelta: setsDelta - 1 })}>−</button>
                      <span className="value">{setsDelta > 0 ? `+${setsDelta}` : setsDelta}</span>
                      <button onClick={() => setTune(key, { setsDelta: setsDelta + 1 })}>+</button>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>sets</span>
                  </div>
                  <div className="tune-cell" style={{ gap: 4 }}>
                    <button
                      className={`btn btn--sm ${tune.regression ? 'btn--primary' : ''}`}
                      disabled={!canReg}
                      style={{ opacity: canReg ? 1 : 0.3, padding: '2px 6px', fontSize: 10 }}
                      onClick={() => setTune(key, { regression: !tune.regression, progression: false })}
                    >−1</button>
                    <button
                      className={`btn btn--sm ${tune.progression ? 'btn--primary' : ''}`}
                      disabled={!canProg}
                      style={{ opacity: canProg ? 1 : 0.3, padding: '2px 6px', fontSize: 10 }}
                      onClick={() => setTune(key, { progression: !tune.progression, regression: false })}
                    >+1</button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Modal>
  );
}

Object.assign(window, {
  LevelChip, RpeChip, StimChip, FatigueBar, ExerciseCard, SessionItem, DayColumn, Modal, DuplicateWeekModal,
  spFormatReps, spFormatSchemeLine, SchemeEditor, InlineField,
});
