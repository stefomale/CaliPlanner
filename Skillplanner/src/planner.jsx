// SkillPlanner — Planner tab
/* global React */

function Planner({ state, actions, tweaks, t }) {
  const [filterSkill, setFilterSkill] = React.useState('ALL');
  const [search, setSearch] = React.useState('');
  const [dupOpen, setDupOpen] = React.useState(false);
  const [calibOpen, setCalibOpen] = React.useState(false);
  const [weekPresetOpen, setWeekPresetOpen] = React.useState(false);
  const [sessionPresetCtx, setSessionPresetCtx] = React.useState(null);  // { weekIdx, dayIdx }
  const [finisherCtx, setFinisherCtx] = React.useState(null);
  const [exEditorCtx, setExEditorCtx] = React.useState(null);  // null | 'new' | existing exercise object
  const [viewMode, setViewMode] = React.useState('grid');      // 'grid' | 'focus'
  const [focusDayIdx, setFocusDayIdx] = React.useState(0);
  const [catalogOpen, setCatalogOpen] = React.useState(false);

  const meso = state.meso;
  const activeWeek = meso.weeks[state.activeWeekIndex];
  const threshold = tweaks.fatigueThreshold;
  const daysPerWeek = tweaks.daysPerWeek;
  const userLevels = state.userExerciseLevels || {};
  const userExercises = state.userExercises || [];

  const filtered = React.useMemo(() => {
    const all = [...window.SP_EXERCISES, ...userExercises];
    return all.filter(ex => {
      if (filterSkill !== 'ALL' && ex.skill !== filterSkill) return false;
      if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterSkill, search, userExercises]);

  const grouped = React.useMemo(() => {
    const g = {};
    for (const ex of filtered) {
      (g[ex.skill] = g[ex.skill] || []).push(ex);
    }
    // Sort each group by level
    for (const k in g) g[k].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    return g;
  }, [filtered]);

  const skillFilters = [
    { id: 'ALL', label: 'All' },
    { id: 'PLANCHE', label: 'Planche' },
    { id: 'FL', label: 'Front Lever' },
    { id: 'HSPU', label: 'HSPU' },
    { id: 'CORE', label: 'Core' },
    { id: 'ACC', label: 'Acc' },
  ];

  const skillTitleMap = {
    PLANCHE: 'Planche',
    FL: 'Front Lever',
    HSPU: 'HSPU / Handstand',
    CORE: 'Core',
    ACC: 'Accessory',
  };

  return (
    <div className="planner">
      {/* Mobile backdrop for catalog drawer */}
      <div
        className={`catalog-backdrop ${catalogOpen ? 'catalog-backdrop--visible' : ''}`}
        onClick={() => setCatalogOpen(false)}
      />
      <aside className={`catalog ${catalogOpen ? 'catalog--open' : ''}`}>
        <div className="catalog__head">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="catalog__title">{t.catalog}</div>
            <button className="btn btn--sm" onClick={() => setExEditorCtx('new')} title="Aggiungi esercizio custom">+ esercizio</button>
          </div>
          <input
            className="catalog__search"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="catalog__filters">
            {skillFilters.map(f => (
              <button
                key={f.id}
                className={`filter-chip ${filterSkill === f.id ? 'filter-chip--active' : ''}`}
                onClick={() => setFilterSkill(f.id)}
              >{f.label}</button>
            ))}
          </div>
        </div>
        <div className="catalog__list">
          {Object.entries(grouped).map(([skill, list]) => (
            <div key={skill} className="catalog__group">
              <div className="catalog__group-head">
                <span>{skillTitleMap[skill] || skill}</span>
                <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>{list.length}</span>
              </div>
              {list.map(ex => (
                <ExerciseCard
                  key={ex.id}
                  ex={ex}
                  userLevels={userLevels}
                  onEdit={ex.id.startsWith('user-') ? () => setExEditorCtx(ex) : null}
                  insertCtx={{
                    days: activeWeek.days.slice(0, daysPerWeek).map((d, i) => ({ idx: i, label: d.label })),
                    onInsert: (dayIdx, section) => actions.addExerciseToDay(state.activeWeekIndex, dayIdx, ex.id, section),
                  }}
                />
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 12 }}>
              Nessun esercizio.
            </div>
          )}
        </div>
      </aside>

      <main className="board">
        <div className="board__head">
          <div className="board__title-row">
            <div>
              <div className="docs-kicker">Mesociclo</div>
              <div className="board__title">{meso.name}</div>
            </div>
            <div className="board__actions">
              <button
                className="btn btn--sm catalog-toggle-btn"
                onClick={() => setCatalogOpen(o => !o)}
                aria-label="Apri/chiudi catalogo esercizi"
                style={{ display: 'none' }}
                data-mobile-only="true"
              >☰ Catalogo</button>
              <div className="view-toggle" role="tablist" aria-label="Vista">
                <button
                  className={`view-toggle__btn ${viewMode === 'grid' ? 'view-toggle__btn--active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Vista a 4 giorni"
                  role="tab"
                  aria-selected={viewMode === 'grid'}
                >▦ 4D</button>
                <button
                  className={`view-toggle__btn ${viewMode === 'focus' ? 'view-toggle__btn--active' : ''}`}
                  onClick={() => setViewMode('focus')}
                  title="Focus su un singolo giorno"
                  role="tab"
                  aria-selected={viewMode === 'focus'}
                >▢ 1D</button>
              </div>
              <button className="btn" onClick={() => setWeekPresetOpen(true)}>{t.weekPreset}</button>
              <button className="btn" onClick={() => setDupOpen(true)}>{t.duplicateWeek}</button>
              <button className="btn" onClick={() => setCalibOpen(true)}>{t.calibrateIntensity}</button>
              <button className="btn btn--ghost" onClick={() => {
                if (confirm('Reset completo del piano? Tutti i dati locali andranno persi.')) actions.resetAll();
              }}>{t.reset}</button>
            </div>
          </div>

          {/* Week strip */}
          <div className="week-strip">
            {meso.weeks.map((w, i) => {
              const wFatigue = Math.round(window.SP_STORE.spWeekFatigue(w, userLevels));
              return (
                <button
                  key={i}
                  className={`week-tab ${i === state.activeWeekIndex ? 'week-tab--active' : ''}`}
                  onClick={() => actions.setActiveWeek(i)}
                >
                  <div className="week-tab__title">
                    <span>W{i + 1}</span>
                    <small className="mono">{wFatigue}</small>
                  </div>
                  <div className="week-tab__heatmap">
                    {w.days.slice(0, daysPerWeek).map((d, di) => {
                      const f = window.SP_STORE.spDayFatigue(d.items, userLevels);
                      const state = window.SP_STORE.spFatigueState(f, threshold);
                      const bg = f === 0 ? 'var(--border)' :
                        state === 'hi' ? 'var(--fatigue-hi)' :
                        state === 'warn' ? 'var(--fatigue-warn)' :
                        'var(--fatigue-ok)';
                      return <div key={di} className="week-tab__cell" style={{ background: bg, opacity: f === 0 ? 1 : 0.3 + (f / 130) }} />;
                    })}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Day strip — dentro l'header sticky, visibile solo in modalità focus */}
          {viewMode === 'focus' && (
            <div className="day-strip">
              {activeWeek.days.slice(0, daysPerWeek).map((d, di) => {
                const f = window.SP_STORE.spDayFatigue(d.items, userLevels);
                const st = window.SP_STORE.spFatigueState(f, threshold);
                const dotColor = f === 0 ? 'var(--border)' :
                  st === 'hi' ? 'var(--fatigue-hi)' :
                  st === 'warn' ? 'var(--fatigue-warn)' :
                  'var(--fatigue-ok)';
                return (
                  <button
                    key={di}
                    className={`day-pill ${di === focusDayIdx ? 'day-pill--active' : ''}`}
                    onClick={() => setFocusDayIdx(di)}
                  >
                    <span className="day-pill__num mono">D{di + 1}</span>
                    <span className="day-pill__name">{d.label}</span>
                    <span className="day-pill__dot" style={{ background: dotColor }} />
                    <span className="day-pill__fatigue mono">{f || '·'}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Days */}
        <div className={`days days--${viewMode}`}
             style={{ gridTemplateColumns: viewMode === 'focus' ? '1fr' : `repeat(${daysPerWeek}, 1fr)` }}>
          {viewMode === 'focus' ? (
            <DayColumn
              key={focusDayIdx}
              day={activeWeek.days[focusDayIdx]}
              weekIdx={state.activeWeekIndex}
              dayIdx={focusDayIdx}
              actions={actions}
              threshold={threshold}
              t={t}
              userLevels={userLevels}
              onLoadSession={(w, d) => setSessionPresetCtx({ weekIdx: w, dayIdx: d })}
              onAddFinisher={(w, d) => setFinisherCtx({ weekIdx: w, dayIdx: d })}
              focus
            />
          ) : (
            activeWeek.days.slice(0, daysPerWeek).map((day, di) => (
              <DayColumn
                key={di}
                day={day}
                weekIdx={state.activeWeekIndex}
                dayIdx={di}
                actions={actions}
                threshold={threshold}
                t={t}
                userLevels={userLevels}
                onLoadSession={(w, d) => setSessionPresetCtx({ weekIdx: w, dayIdx: d })}
                onAddFinisher={(w, d) => setFinisherCtx({ weekIdx: w, dayIdx: d })}
              />
            ))
          )}
        </div>
      </main>

      {dupOpen && (
        <DuplicateWeekModal
          meso={meso}
          fromIdx={state.activeWeekIndex}
          onClose={() => setDupOpen(false)}
          onApply={actions.duplicateWeek}
          t={t}
        />
      )}
      {calibOpen && (
        <IntensityCalibrationModal
          onClose={() => setCalibOpen(false)}
          userLevels={userLevels}
          actions={actions}
          t={t}
        />
      )}
      {weekPresetOpen && (
        <WeekPresetModal
          weekIdx={state.activeWeekIndex}
          onClose={() => setWeekPresetOpen(false)}
          actions={actions}
          t={t}
        />
      )}
      {sessionPresetCtx && (
        <SessionPresetModal
          weekIdx={sessionPresetCtx.weekIdx}
          dayIdx={sessionPresetCtx.dayIdx}
          onClose={() => setSessionPresetCtx(null)}
          actions={actions}
          t={t}
        />
      )}
      {finisherCtx && (
        <FinisherModal
          weekIdx={finisherCtx.weekIdx}
          dayIdx={finisherCtx.dayIdx}
          onClose={() => setFinisherCtx(null)}
          actions={actions}
          t={t}
        />
      )}
      {exEditorCtx && (
        <ExerciseEditorModal
          onClose={() => setExEditorCtx(null)}
          actions={actions}
          existing={exEditorCtx === 'new' ? null : exEditorCtx}
        />
      )}
    </div>
  );
}

window.Planner = Planner;
