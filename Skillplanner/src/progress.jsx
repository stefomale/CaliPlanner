// SkillPlanner — Progress dashboard
/* global React */

function Progress({ state, tweaks, t }) {
  const meso = state.meso;
  const userLevels = state.userExerciseLevels || {};

  // Weekly fatigue chart
  const weeklyFatigue = meso.weeks.map(w => Math.round(window.SP_STORE.spWeekFatigue(w, userLevels)));
  const maxF = Math.max(...weeklyFatigue, 80);

  // Volume per week (total sets)
  const weeklyVolume = meso.weeks.map(w =>
    w.days.reduce((s, d) => s + d.items.reduce((ss, it) => ss + it.sets, 0), 0)
  );
  const maxV = Math.max(...weeklyVolume, 1);

  // Skill tracks
  const skillTracks = [
    { key: 'PLANCHE_HOLD', label: 'Planche Hold' },
    { key: 'PLANCHE_PUP',  label: 'Planche PU' },
    { key: 'FL_HOLD',      label: 'Front Lever' },
    { key: 'FL_RAISE',     label: 'FL Raise' },
    { key: 'HSPU_LINE',    label: 'HSPU' },
    { key: 'HS_HOLD',      label: 'Handstand' },
  ];
  const tracks = skillTracks.map(tk => {
    const chain = window.SP_PROGRESSIONS[tk.key];
    const cur = window.SP_STORE.spCurrentSkillStop(meso.weeks, tk.key);
    return { ...tk, chain, cur };
  });

  // Stimulus distribution
  const stims = { ISO: 0, DIN: 0, ECC: 0 };
  let totalSets = 0;
  for (const w of meso.weeks) for (const d of w.days) for (const it of d.items) {
    const ex = window.SP_BY_ID[it.exerciseId];
    if (ex) { stims[ex.stimulus] += it.sets; totalSets += it.sets; }
  }

  // Skill mix
  const skillMix = { PLANCHE: 0, FL: 0, HSPU: 0, CORE: 0, ACC: 0 };
  for (const w of meso.weeks) for (const d of w.days) for (const it of d.items) {
    const ex = window.SP_BY_ID[it.exerciseId];
    if (ex) skillMix[ex.skill] = (skillMix[ex.skill] || 0) + it.sets;
  }

  // Weekly skill mix
  const weeklySkillMix = meso.weeks.map(w => {
    const s = { PLANCHE: 0, FL: 0, HSPU: 0, CORE: 0, ACC: 0 };
    for (const d of w.days) for (const it of d.items) {
      const ex = window.SP_BY_ID[it.exerciseId];
      if (ex) s[ex.skill] = (s[ex.skill] || 0) + it.sets;
    }
    return s;
  });

  const SKILL_COLORS = {
    PLANCHE: 'oklch(0.65 0.18 50)',
    FL:      'oklch(0.58 0.16 240)',
    HSPU:    'oklch(0.62 0.14 145)',
    CORE:    'oklch(0.55 0.16 300)',
    ACC:     'oklch(0.55 0.01 60)',
  };
  const SKILL_LABELS = {
    PLANCHE: 'Planche', FL: 'Front Lever', HSPU: 'HSPU', CORE: 'Core', ACC: 'Accessory',
  };

  // Top exercises
  const counts = {};
  for (const w of meso.weeks) for (const d of w.days) for (const it of d.items) {
    counts[it.exerciseId] = (counts[it.exerciseId] || 0) + 1;
  }
  const topEx = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Fatigue SVG
  const W = 400, H = 140, P = 16;
  const xStep = (W - 2 * P) / (weeklyFatigue.length - 1 || 1);
  const yScale = (v) => H - P - (v / maxF) * (H - 2 * P);
  const points = weeklyFatigue.map((v, i) => `${P + i * xStep},${yScale(v)}`).join(' ');

  const avgFatigue = Math.round(weeklyFatigue.reduce((s, v) => s + v, 0) / meso.weeks.length) || 0;
  const highIntDays = meso.weeks.reduce(
    (acc, w) => acc + w.days.filter(d => window.SP_STORE.spDayHighIntensityConflict(d.items, userLevels)).length, 0
  );

  return (
    <div className="progress">
      <div className="progress__header">
        <div className="docs-kicker">Dashboard</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', margin: '4px 0 0' }}>
          {meso.name}
        </h1>
      </div>

      {/* ── Riga 1: KPI con scroll orizzontale ── */}
      <div className="progress__kpi-row">
        <div className="card progress__kpi-card">
          <div className="card__title">Set totali</div>
          <div className="card__big mono">{totalSets}</div>
          <div className="card__sub">{meso.weeks.length} settimane</div>
        </div>
        <div className="card progress__kpi-card">
          <div className="card__title">Fatigue medio</div>
          <div className="card__big mono">{avgFatigue}<small>/100</small></div>
          <div className="card__sub">target ≤ {tweaks.fatigueThreshold}</div>
        </div>
        <div className="card progress__kpi-card">
          <div className="card__title">Esercizi</div>
          <div className="card__big mono">{window.SP_EXERCISES.length}</div>
          <div className="card__sub">nel database</div>
        </div>
        <div className="card progress__kpi-card">
          <div className="card__title">Giorni ad alta intensità</div>
          <div className="card__big mono">{highIntDays}</div>
          <div className="card__sub">2+ esercizi lvl≥4</div>
        </div>
        <div className="card progress__kpi-card">
          <div className="card__title">Volume medio</div>
          <div className="card__big mono">
            {Math.round(weeklyVolume.reduce((s, v) => s + v, 0) / (meso.weeks.length || 1))}
          </div>
          <div className="card__sub">set / settimana</div>
        </div>
      </div>

      {/* ── Tutti gli altri box: impilati su mobile, griglia 12 col su desktop ── */}
      <div className="progress__stack">

        {/* Distribuzione per skill — 7 colonne */}
        <div className="card progress__col-7">
          <div className="card__title">Set totali · per skill</div>
          <div className="skill-bar" style={{ marginBottom: 12 }}>
            {Object.entries(skillMix).filter(([, v]) => v > 0).map(([k, v]) => {
              const pct = totalSets ? (v / totalSets * 100) : 0;
              return (
                <div key={k} className="skill-bar__seg"
                  style={{ flexBasis: `${pct}%`, background: SKILL_COLORS[k] }}
                  title={`${SKILL_LABELS[k]}: ${v} sets (${Math.round(pct)}%)`}
                />
              );
            })}
            {totalSets === 0 && <div className="skill-bar__seg skill-bar__seg--empty" />}
          </div>
          <div className="skill-tiles">
            {Object.entries(skillMix).map(([k, v]) => {
              const pct = totalSets ? Math.round(v / totalSets * 100) : 0;
              return (
                <div key={k} className="skill-tile">
                  <span className="skill-tile__dot" style={{ background: SKILL_COLORS[k] }} />
                  <div className="skill-tile__head">{SKILL_LABELS[k]}</div>
                  <div className="skill-tile__num mono">{v}</div>
                  <div className="skill-tile__sub mono">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sets per settimana · per skill — 5 colonne */}
        <div className="card progress__col-5">
          <div className="card__title">Sets / settimana · per skill</div>
          <div className="weekly-stack">
            {weeklySkillMix.map((wm, wi) => {
              const wTot = Object.values(wm).reduce((s, v) => s + v, 0);
              const maxW = Math.max(...weeklySkillMix.map(w => Object.values(w).reduce((s, v) => s + v, 0)), 1);
              const widthPct = (wTot / maxW) * 100;
              return (
                <div key={wi} className="weekly-stack__row">
                  <span className="weekly-stack__label mono">W{wi + 1}</span>
                  <div className="weekly-stack__bar-wrap">
                    <div className="weekly-stack__bar" style={{ width: `${widthPct}%` }}>
                      {Object.entries(wm).filter(([, v]) => v > 0).map(([k, v]) => {
                        const pct = wTot ? (v / wTot * 100) : 0;
                        return (
                          <div key={k} className="weekly-stack__seg"
                            style={{ flexBasis: `${pct}%`, background: SKILL_COLORS[k] }}
                            title={`${SKILL_LABELS[k]}: ${v}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <span className="weekly-stack__total mono">{wTot}</span>
                </div>
              );
            })}
          </div>
          <div className="skill-legend">
            {Object.keys(skillMix).filter(k => skillMix[k] > 0).map(k => (
              <span key={k} className="skill-legend__item">
                <span className="skill-legend__dot" style={{ background: SKILL_COLORS[k] }} />
                {SKILL_LABELS[k]}
              </span>
            ))}
          </div>
        </div>

        {/* Fatigue chart — 8 colonne */}
        <div className="card progress__col-8">
          <div className="card__title">Fatigue · settimana per settimana</div>
          <div className="chart">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <line x1={P} y1={yScale(tweaks.fatigueThreshold)} x2={W - P} y2={yScale(tweaks.fatigueThreshold)}
                stroke="var(--int-4)" strokeWidth="1" strokeDasharray="3 3" />
              {[0, 25, 50, 75, 100].map(v => v <= maxF && (
                <g key={v}>
                  <line x1={P} y1={yScale(v)} x2={W - P} y2={yScale(v)} stroke="var(--border)" strokeWidth="0.5" />
                  <text x={4} y={yScale(v) + 3} fontSize="9" fill="var(--fg-subtle)" fontFamily="var(--font-mono)">{v}</text>
                </g>
              ))}
              <polyline points={points} fill="none" stroke="var(--fg)" strokeWidth="1.5" />
              {weeklyFatigue.map((v, i) => (
                <g key={i}>
                  <circle cx={P + i * xStep} cy={yScale(v)} r="3" fill="var(--bg-elev)" stroke="var(--fg)" strokeWidth="1.5" />
                  <text x={P + i * xStep} y={H - 2} textAnchor="middle" fontSize="9" fill="var(--fg-muted)" fontFamily="var(--font-mono)">
                    W{i + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="card__sub" style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            Linea tratteggiata = soglia configurata ({tweaks.fatigueThreshold})
          </div>
        </div>

        {/* Volume chart — 4 colonne */}
        <div className="card progress__col-4">
          <div className="card__title">Volume · set / settimana</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, padding: '0 8px' }}>
            {weeklyVolume.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: `${(v / maxV) * 100}%`,
                    background: i === state.activeWeekIndex ? 'var(--fg)' : 'var(--border-strong)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.2s',
                    position: 'relative',
                    minHeight: v > 0 ? 2 : 0,
                  }}>
                    {v > 0 && (
                      <span style={{
                        position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)', whiteSpace: 'nowrap',
                      }}>{v}</span>
                    )}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)' }}>W{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stimulus mix — 4 colonne */}
        <div className="card progress__col-4">
          <div className="card__title">Stimulus mix · set</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {Object.entries(stims).map(([k, v]) => {
              const pct = totalSets ? Math.round(v / totalSets * 100) : 0;
              return (
                <div key={k} className="breakdown__row" style={{ gridTemplateColumns: '40px 1fr 60px' }}>
                  <span className="breakdown__label">{k}</span>
                  <div className="breakdown__bar">
                    <div className="breakdown__fill" style={{ '--w': `${pct}%` }} />
                  </div>
                  <span className="breakdown__val mono">{v} · {pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill progression tracks — 8 colonne */}
        <div className="card progress__col-8">
          <div className="card__title">Skill progression tracks</div>
          <div className="skill-track">
            {tracks.map(tk => (
              <div key={tk.key} className="skill-track__row">
                <span className="skill-track__name">{tk.label}</span>
                <div className="skill-track__progress">
                  {tk.chain.map((id, i) => {
                    const ex = window.SP_BY_ID[id];
                    const cls = i < tk.cur ? 'skill-track__step--done' :
                                i === tk.cur ? 'skill-track__step--cur' : '';
                    const short = ex.name
                      .replace('Front Lever', 'FL').replace('Planche', 'Pl')
                      .replace('Push-up', 'PU').replace('Handstand', 'HS')
                      .replace('Advanced', 'Adv').replace('Straddle', 'Stra');
                    return (
                      <div key={id} className={`skill-track__step ${cls}`} title={ex.name}>
                        {short.length > 14 ? short.slice(0, 12) + '…' : short}
                      </div>
                    );
                  })}
                </div>
                <span className="skill-track__cur">
                  {tk.cur >= 0 ? `${tk.cur + 1}/${tk.chain.length}` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most-used exercises — larghezza piena */}
        <div className="card progress__col-12">
          <div className="card__title">Esercizi più usati in questo mesociclo</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginTop: 8 }}>
            {topEx.map(([exId, count]) => {
              const ex = window.SP_BY_ID[exId];
              return (
                <div key={exId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--bg-sunk)', borderRadius: 4, border: '1px solid var(--border)' }}>
                  <LevelChip level={ex.level} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{ex.stimulus} · {ex.category}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 16, fontWeight: 600 }}>×{count}</span>
                </div>
              );
            })}
            {topEx.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 24, color: 'var(--fg-muted)', fontSize: 12 }}>
                Nessun esercizio pianificato ancora.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

window.Progress = Progress;
