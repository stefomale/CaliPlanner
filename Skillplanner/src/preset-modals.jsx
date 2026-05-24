// SkillPlanner — preset modals (session, finisher, week, intensity calibration)
/* global React */

// Generic preset card used by all preset pickers
function PresetCard({ preset, onSelect, expanded, onToggle }) {
  const itemCount = preset.items?.length ?? preset.days?.length;
  return (
    <div className="preset-card">
      <div className="preset-card__head" onClick={onToggle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="preset-card__title">
            {preset.tag && <span className={`preset-card__tag preset-card__tag--${preset.tag.toLowerCase()}`}>{preset.tag}</span>}
            {preset.name}
          </div>
          <div className="preset-card__desc">{preset.desc}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{itemCount}</span>
          <span style={{ fontSize: 14, color: 'var(--fg-subtle)', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>›</span>
        </div>
      </div>
      {expanded && (preset.items || preset.days) && (
        <div className="preset-card__body">
          {preset.items && preset.items.map((it, i) => {
            const ex = window.SP_BY_ID[it.exerciseId];
            if (!ex) return null;
            const sch = { ...ex.scheme, ...(it.overrides || {}) };
            return (
              <div key={i} className="preset-card__item">
                <LevelChip level={ex.level} />
                <span className="preset-card__item-name">{ex.name}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>
                  {sch.sets}×{sch.reps} · RPE{sch.rpe}
                </span>
              </div>
            );
          })}
          {preset.days && preset.days.map((dpId, i) => {
            const dp = window.SP_SESSION_PRESETS.find(p => p.id === dpId);
            return (
              <div key={i} className="preset-card__item">
                <span className="mono" style={{ fontSize: 10, color: 'var(--fg-subtle)', minWidth: 24 }}>D{i + 1}</span>
                <span className="preset-card__item-name">{dp?.name || dpId}</span>
                {dp?.tag && <span className={`preset-card__tag preset-card__tag--${dp.tag.toLowerCase()}`} style={{ fontSize: 9 }}>{dp.tag}</span>}
              </div>
            );
          })}
        </div>
      )}
      <div className="preset-card__actions">
        <button className="btn btn--primary btn--sm" onClick={() => onSelect(preset, 'replace')}>Carica</button>
        {preset.items && <button className="btn btn--sm" onClick={() => onSelect(preset, 'append')}>Append</button>}
      </div>
    </div>
  );
}

// Session preset picker
function SessionPresetModal({ weekIdx, dayIdx, onClose, actions, t }) {
  const [expanded, setExpanded] = React.useState(null);
  const [filter, setFilter] = React.useState('ALL');

  const presets = window.SP_SESSION_PRESETS.filter(p =>
    filter === 'ALL' || p.tag === filter
  );

  const select = (preset, mode) => {
    actions.loadSessionPreset(weekIdx, dayIdx, preset.id, mode);
    onClose();
  };

  return (
    <Modal title={`${t.sessionPreset} · W${weekIdx + 1} · D${dayIdx + 1}`} onClose={onClose}>
      <div style={{ marginBottom: 12 }}>
        <div className="catalog__filters">
          {['ALL', 'PUSH', 'PULL', 'MIX', 'DELOAD'].map(tag => (
            <button
              key={tag}
              className={`filter-chip ${filter === tag ? 'filter-chip--active' : ''}`}
              onClick={() => setFilter(tag)}
            >{tag}</button>
          ))}
        </div>
      </div>
      <div className="preset-list">
        {presets.map(p => (
          <PresetCard
            key={p.id}
            preset={p}
            expanded={expanded === p.id}
            onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
            onSelect={select}
          />
        ))}
      </div>
    </Modal>
  );
}

// Finisher picker
function FinisherModal({ weekIdx, dayIdx, onClose, actions, t }) {
  const [expanded, setExpanded] = React.useState(null);
  const select = (preset) => {
    actions.appendFinisher(weekIdx, dayIdx, preset.id);
    onClose();
  };
  return (
    <Modal title={`${t.addFinisher} · W${weekIdx + 1} · D${dayIdx + 1}`} onClose={onClose}>
      <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 0 }}>
        I finisher vengono appesi alla fine del giorno corrente.
      </p>
      <div className="preset-list">
        {window.SP_FINISHER_PRESETS.map(p => (
          <PresetCard
            key={p.id}
            preset={p}
            expanded={expanded === p.id}
            onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
            onSelect={select}
          />
        ))}
      </div>
    </Modal>
  );
}

// Week preset picker
function WeekPresetModal({ weekIdx, onClose, actions, t }) {
  const [expanded, setExpanded] = React.useState(null);
  const select = (preset) => {
    if (!confirm(`Sovrascrivere W${weekIdx + 1} con "${preset.name}"?`)) return;
    actions.loadWeekPreset(weekIdx, preset.id);
    onClose();
  };
  return (
    <Modal title={`${t.weekPreset} · W${weekIdx + 1}`} onClose={onClose}>
      <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 0 }}>
        Sostituisce tutti i 4 giorni di W{weekIdx + 1}.
      </p>
      <div className="preset-list">
        {window.SP_WEEK_PRESETS.map(p => (
          <PresetCard
            key={p.id}
            preset={p}
            expanded={expanded === p.id}
            onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
            onSelect={select}
          />
        ))}
      </div>
    </Modal>
  );
}

// Intensity calibration modal — list all exercises grouped by skill, 1-5 stepper per row
function IntensityCalibrationModal({ onClose, userLevels, actions, t }) {
  const [filter, setFilter] = React.useState('ALL');
  const skillTitleMap = {
    PLANCHE: 'Planche', FL: 'Front Lever', HSPU: 'HSPU / Handstand', CORE: 'Core', ACC: 'Accessory',
  };

  const groups = React.useMemo(() => {
    const g = {};
    for (const ex of window.SP_EXERCISES) {
      if (filter !== 'ALL' && ex.skill !== filter) continue;
      (g[ex.skill] = g[ex.skill] || []).push(ex);
    }
    for (const k in g) g[k].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    return g;
  }, [filter]);

  const overrideCount = Object.keys(userLevels || {}).length;

  return (
    <Modal
      title={t.intensityCalibration}
      onClose={onClose}
      footer={
        <>
          <span style={{ flex: 1, fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
            {overrideCount} override attivi
          </span>
          <button className="btn" onClick={() => { if (confirm('Resettare tutti gli override?')) actions.resetUserLevels(); }}>
            Reset all
          </button>
          <button className="btn btn--primary" onClick={onClose}>Done</button>
        </>
      }
    >
      <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 0 }}>{t.intensityHint}</p>
      <div className="catalog__filters" style={{ marginBottom: 12 }}>
        {['ALL', 'PLANCHE', 'FL', 'HSPU', 'CORE', 'ACC'].map(f => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter(f)}
          >{f}</button>
        ))}
      </div>
      <div className="cal-list">
        {Object.entries(groups).map(([skill, list]) => (
          <div key={skill}>
            <div className="cal-group-head">{skillTitleMap[skill] || skill}</div>
            {list.map(ex => {
              const cur = userLevels?.[ex.id] ?? ex.level;
              const isCustom = userLevels?.[ex.id] != null;
              return (
                <div key={ex.id} className="cal-row">
                  <div className="cal-row__name">
                    <span>{ex.name}</span>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>
                      {ex.stimulus} · {ex.category} · {t.default} {ex.level}
                    </span>
                  </div>
                  <div className="cal-row__stepper">
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <button
                        key={lvl}
                        className={`cal-step ${cur === lvl ? 'cal-step--active' : ''} ${cur === lvl ? `lvl--${lvl}` : ''}`}
                        onClick={() => actions.setUserLevel(ex.id, lvl)}
                      >{lvl}</button>
                    ))}
                  </div>
                  <button
                    className="btn btn--ghost btn--sm"
                    style={{ opacity: isCustom ? 1 : 0.3, minWidth: 50 }}
                    disabled={!isCustom}
                    onClick={() => actions.clearUserLevel(ex.id)}
                  >reset</button>
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
  PresetCard, SessionPresetModal, FinisherModal, WeekPresetModal, IntensityCalibrationModal,
  ExerciseEditorModal,
});

// ─────────────────────────────────────────────────────────────────────────
// Exercise editor — create / edit a custom user exercise
// ─────────────────────────────────────────────────────────────────────────
function ExerciseEditorModal({ onClose, actions, existing }) {
  const isEdit = !!existing;
  const blank = {
    name: '',
    skill: 'PLANCHE',
    category: 'SKILL',
    level: 3,
    stimulus: 'ISO',
    fatigueLoad: 15,
    scheme: { sets: 4, reps: '6', rpe: 8, rest: 120 },
  };
  const [form, setForm] = React.useState(() => existing ? structuredClone(existing) : blank);

  const update = (patch) => setForm(s => ({ ...s, ...patch }));
  const updateScheme = (patch) => setForm(s => ({ ...s, scheme: { ...s.scheme, ...patch } }));

  const valid = form.name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    if (isEdit) actions.updateUserExercise(existing.id, form);
    else actions.addUserExercise(form);
    onClose();
  };

  const remove = () => {
    if (!confirm(`Eliminare "${existing.name}"? Verrà rimosso anche da tutte le schede dove è presente.`)) return;
    actions.removeUserExercise(existing.id);
    onClose();
  };

  const SKILLS    = ['PLANCHE', 'FL', 'HSPU', 'CORE', 'ACC'];
  const CATS      = ['SKILL', 'FORCE', 'COMP', 'ACC'];
  const STIMULI   = ['ISO', 'DIN', 'ECC'];
  const LEVELS    = [1, 2, 3, 4, 5];

  return (
    <Modal
      title={isEdit ? `Modifica · ${existing.name}` : 'Nuovo esercizio'}
      onClose={onClose}
      footer={
        <>
          {isEdit && <button className="btn" style={{ color: 'oklch(0.55 0.20 25)' }} onClick={remove}>Elimina</button>}
          <span style={{ flex: 1 }} />
          <button className="btn" onClick={onClose}>Annulla</button>
          <button className="btn btn--primary" disabled={!valid} onClick={submit}>
            {isEdit ? 'Salva' : 'Crea'}
          </button>
        </>
      }
    >
      <div className="ex-form">
        <div className="ex-form__field ex-form__field--wide">
          <label>Nome esercizio</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="es. One Arm Pseudo Planche Push-up"
            autoFocus
          />
        </div>

        <div className="ex-form__field">
          <label>Skill</label>
          <div className="ex-form__chips">
            {SKILLS.map(s => (
              <button
                key={s}
                className={`filter-chip ${form.skill === s ? 'filter-chip--active' : ''}`}
                onClick={() => update({ skill: s })}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="ex-form__field">
          <label>Categoria</label>
          <div className="ex-form__chips">
            {CATS.map(s => (
              <button
                key={s}
                className={`filter-chip ${form.category === s ? 'filter-chip--active' : ''}`}
                onClick={() => update({ category: s })}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="ex-form__field">
          <label>Livello difficoltà (1-5)</label>
          <div className="cal-row__stepper">
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                className={`cal-step ${form.level === lvl ? 'cal-step--active' : ''} ${form.level === lvl ? `lvl--${lvl}` : ''}`}
                onClick={() => update({ level: lvl })}
              >{lvl}</button>
            ))}
          </div>
        </div>

        <div className="ex-form__field">
          <label>Stimolo</label>
          <div className="ex-form__chips">
            {STIMULI.map(s => (
              <button
                key={s}
                className={`filter-chip ${form.stimulus === s ? 'filter-chip--active' : ''}`}
                onClick={() => update({ stimulus: s })}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="ex-form__field">
          <label>Carico stimato (1-40)</label>
          <input
            type="number"
            value={form.fatigueLoad}
            min={1}
            max={40}
            onChange={(e) => update({ fatigueLoad: Number(e.target.value) })}
          />
        </div>

        <div className="ex-form__sep">Scheme default proposto al drag</div>

        <div className="ex-form__field">
          <label>Set</label>
          <input
            type="number"
            value={form.scheme.sets}
            min={1}
            onChange={(e) => updateScheme({ sets: Number(e.target.value) })}
          />
        </div>
        <div className="ex-form__field">
          <label>Reps / hold</label>
          <input
            type="text"
            value={form.scheme.reps}
            onChange={(e) => updateScheme({ reps: e.target.value })}
            placeholder="es. 6 oppure 5s"
          />
        </div>
        <div className="ex-form__field">
          <label>RPE</label>
          <input
            type="number"
            value={form.scheme.rpe}
            min={5}
            max={10}
            onChange={(e) => updateScheme({ rpe: Number(e.target.value) })}
          />
        </div>
        <div className="ex-form__field">
          <label>Rest (s)</label>
          <input
            type="number"
            value={form.scheme.rest}
            min={0}
            step={15}
            onChange={(e) => updateScheme({ rest: Number(e.target.value) })}
          />
        </div>
      </div>
    </Modal>
  );
}
