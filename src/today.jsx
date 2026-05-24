// SkillPlanner — Today tab (workout execution view)
/* global React */

function Today({ state, actions, tweaks, t }) {
  const { weekIdx, dayIdx } = state.today;
  const week = state.meso.weeks[weekIdx];
  const day = week.days[dayIdx];
  const userLevels = state.userExerciseLevels || {};
  const fatigue = window.SP_STORE.spDayFatigue(day.items, userLevels);
  const threshold = tweaks.fatigueThreshold;

  const today = new Date();
  const dateStr = today.toLocaleDateString(tweaks.language === 'IT' ? 'it-IT' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Fatigue breakdown by skill
  const breakdown = React.useMemo(() => {
    const skills = { PLANCHE: 0, FL: 0, HSPU: 0, CORE: 0, ACC: 0 };
    let total = 0;
    for (const it of day.items) {
      const ex = window.SP_BY_ID[it.exerciseId];
      if (!ex) continue;
      const single = window.SP_STORE.spDayFatigue([it], userLevels);
      skills[ex.skill] = (skills[ex.skill] || 0) + single;
      total += single;
    }
    return Object.entries(skills).map(([k, v]) => ({ skill: k, value: v, pct: total ? Math.round(v / total * 100) : 0 }));
  }, [day.items, userLevels]);

  const completedCount = day.items.filter(it => state.completedItems[it.uid]).length;

  return (
    <div className="today">
      <div className="today__main">
        <header className="today__head">
          <div className="today__date">{dateStr}</div>
          <h1 className="today__title">{day.label}</h1>
          <div className="today__subtitle">
            W{weekIdx + 1} · D{dayIdx + 1} · {completedCount}/{day.items.length} completati
          </div>
        </header>

        {day.items.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, border: '1px dashed var(--border)', borderRadius: 8 }}>
            {t.todayEmpty}
          </div>
        ) : (
          <div className="today__list">
            {day.items.map((it) => {
              const ex = window.SP_BY_ID[it.exerciseId];
              if (!ex) return null;
              const done = !!state.completedItems[it.uid];
              return (
                <div key={it.uid} className={`today-row ${done ? 'today-row--done' : ''}`}>
                  <button className="today-row__check" onClick={() => actions.toggleComplete(it.uid)}>
                    {done ? '✓' : ''}
                  </button>
                  <div>
                    <div className="today-row__name">{ex.name}</div>
                    <div className="today-row__sub">
                      <LevelChip level={ex.level} />
                      <StimChip stimulus={ex.stimulus} />
                      <span>{ex.category}</span>
                    </div>
                  </div>
                  <div className="today-row__scheme mono">
                    {it.sets}×{window.spFormatReps(it)}
                  </div>
                  <div className="mono" style={{ color: 'var(--fg-muted)', fontSize: 11, textAlign: 'right', minWidth: 80 }}>
                    RPE{it.rpe}<br />
                    {it.rest}s rest
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <aside className="today__side">
        <div>
          <div className="docs-kicker" style={{ marginBottom: 6 }}>{t.weekDay}</div>
          <div className="today__nav">
            <select className="today__select" value={weekIdx} onChange={e => actions.setToday(Number(e.target.value), dayIdx)}>
              {state.meso.weeks.map((_, i) => <option key={i} value={i}>Week {i + 1}</option>)}
            </select>
            <select className="today__select" value={dayIdx} onChange={e => actions.setToday(weekIdx, Number(e.target.value))}>
              {week.days.map((_, i) => <option key={i} value={i}>Day {i + 1}</option>)}
            </select>
          </div>
        </div>

        <div className="fatigue-card">
          <div className="fatigue-card__head">
            <span>{t.fatigueLabel} score</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>/ 100</span>
          </div>
          <div className="fatigue-card__num mono">
            {fatigue}<small>/100</small>
          </div>
          <FatigueBar score={fatigue} threshold={threshold} />
          <div className="breakdown">
            {breakdown.filter(b => b.value > 0).map(b => (
              <div key={b.skill} className="breakdown__row">
                <span className="breakdown__label">{b.skill}</span>
                <div className="breakdown__bar">
                  <div className="breakdown__fill" style={{ '--w': `${b.pct}%` }} />
                </div>
                <span className="breakdown__val">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="docs-kicker" style={{ marginBottom: 8 }}>Sessione</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
            Esercizi: <span className="mono" style={{ color: 'var(--fg)' }}>{day.items.length}</span><br />
            Set totali: <span className="mono" style={{ color: 'var(--fg)' }}>{day.items.reduce((s, it) => s + it.sets, 0)}</span><br />
            Rest medio: <span className="mono" style={{ color: 'var(--fg)' }}>
              {day.items.length ? Math.round(day.items.reduce((s, it) => s + it.rest, 0) / day.items.length) : 0}s
            </span>
          </div>
        </div>

        <button className="btn" onClick={() => actions.resetTodayCompletions()}>
          Reset completati
        </button>
      </aside>
    </div>
  );
}

window.Today = Today;
