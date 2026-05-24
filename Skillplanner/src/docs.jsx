// SkillPlanner — Docs tab (the 4 deliverables embedded as navigable docs)
/* global React */

const SP_DOCS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'schema',    label: 'Schema database' },
  { id: 'flow',      label: 'User flow' },
  { id: 'components',label: 'Componenti UI' },
  { id: 'constraints',label: 'Logica constraint' },
];

function Docs() {
  const [active, setActive] = React.useState('overview');

  return (
    <div className="docs">
      <nav className="docs__nav">
        <div className="docs__nav-title">Specifica</div>
        {SP_DOCS.map(d => (
          <button
            key={d.id}
            className={`docs__nav-link ${active === d.id ? 'docs__nav-link--active' : ''}`}
            onClick={() => setActive(d.id)}
          >{d.label}</button>
        ))}
      </nav>
      <div className="docs__body">
        {active === 'overview'    && <Overview />}
        {active === 'schema'      && <Schema />}
        {active === 'flow'        && <Flow />}
        {active === 'components'  && <Components />}
        {active === 'constraints' && <Constraints />}
      </div>
    </div>
  );
}

function Overview() {
  return (
    <>
      <div className="docs-kicker">SkillPlanner · spec</div>
      <h1>Architettura & UI</h1>
      <p>
        SkillPlanner è uno strumento di programmazione per atleti calisthenics di livello intermedio/avanzato,
        focalizzato sulle tre skill compound che reggono il programma: <b>Planche</b>, <b>Front Lever</b>, <b>HSPU</b>.
        L'app costruisce mesocicli di 5 settimane × 4 allenamenti e applica vincoli soft sul carico CNS.
      </p>
      <p>
        Il documento è diviso in 4 sezioni: <code>Schema DB</code>, <code>User Flow</code>, <code>Componenti UI</code>, <code>Logica constraint</code>.
      </p>
      <h2>Contesto utente di riferimento</h2>
      <ul>
        <li>10× Handstand Push-up (free / wall)</li>
        <li>1× Stacco Full Planche con band assistance</li>
        <li>6" Front Lever One Leg Advanced</li>
      </ul>
      <p>
        Il database e le propedeutiche sono calibrate per questo livello: l'utente parte già dalla parte alta della scala
        (Straddle Planche, FL One Leg Adv, Deficit HSPU) ma ha bisogno di alternare hold/dynamic e bilanciare push/pull.
      </p>
      <h2>Principi di design</h2>
      <ul>
        <li><b>Soft constraint.</b> L'app suggerisce, non blocca. Un atleta avanzato sa quando rompere la regola.</li>
        <li><b>Densità informativa.</b> Tipografia monospace su set/rep/RPE, chip colorati solo dove l'intensità conta.</li>
        <li><b>Drag-first.</b> Il flusso principale è trascinare un esercizio dal catalogo a un giorno. Modali solo per progressione.</li>
        <li><b>Progressione esplicita.</b> Le propedeutiche sono catene ordinate (<code>SP_PROGRESSIONS</code>), così "−1 tacca" è deterministica.</li>
      </ul>
    </>
  );
}

function Schema() {
  return (
    <>
      <div className="docs-kicker">Deliverable 1</div>
      <h1>Schema del database</h1>
      <p>
        Quattro entità principali. Tutto in-memory + localStorage; nessun backend nel prototipo.
        Le relazioni sono per <code>id</code> per disaccoppiare il catalogo (statico) dal piano (mutabile).
      </p>

      <h2>Entità</h2>

      <h3>Exercise <span style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>· catalogo statico</span></h3>
<pre>{`{
  id:           string         // "pl-straddle"
  name:         string         // "Straddle Planche"
  skill:        "PLANCHE" | "FL" | "HSPU" | "CORE" | "ACC"
  category:     "SKILL" | "FORCE" | "COMP" | "ACC"
  level:        1 | 2 | 3 | 4 | 5     // difficoltà
  stimulus:     "ISO" | "DIN" | "ECC"
  fatigueLoad:  number  // stima CNS per set di lavoro (1–35)
  scheme: {                  // default proposto al drag
    sets:  number
    reps:  string  // "6" o "5s" (hold)
    rpe:   6..10
    rest:  number  // secondi
  }
}`}</pre>

      <h3>Progression chain <span style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>· ordering propedeutiche</span></h3>
<pre>{`SP_PROGRESSIONS = {
  PLANCHE_HOLD: ["pl-tuck", "pl-adv-tuck", "pl-straddle", "pl-half-lay", "pl-full"],
  PLANCHE_PUP:  ["pl-psp", "pl-pup-tuck", "pl-pup-adv", "pl-pup-strad"],
  FL_HOLD:      ["fl-tuck", "fl-adv-tuck", "fl-one-leg",
                 "fl-one-leg-adv", "fl-straddle", "fl-full"],
  FL_RAISE:     ["fl-raise-tuck", "fl-raise-adv", "fl-raise-strad"],
  HSPU_LINE:    ["hs-pike", "hs-pike-elev", "hs-wall",
                 "hs-deficit", "hs-free-hspu"],
  HS_HOLD:      ["hs-hold", "hs-free"],
  HSPU_NEG:     ["hs-neg", "hs-deep-neg"],
}`}</pre>
      <p>
        Ogni catena è una lista ordinata di <code>Exercise.id</code>. La posizione nella catena permette le operazioni
        <code>regression()</code> (i−1) e <code>progression()</code> (i+1) usate dal modal "duplica settimana".
      </p>

      <h3>SessionItem <span style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>· istanza nel piano</span></h3>
<pre>{`{
  uid:        string         // unico nel meso
  exerciseId: string         // FK -> Exercise.id
  sets, reps, rpe, rest      // override del default
}`}</pre>

      <h3>Day &nbsp;·&nbsp; Week &nbsp;·&nbsp; Mesocycle</h3>
<pre>{`Day      { label: string, items: SessionItem[] }
Week     { id: string, index: 0..4, days: Day[4] }
Meso     { id, name, startDate, weeks: Week[5] }`}</pre>

      <h2>Relazioni</h2>
      <table>
        <thead><tr><th>From</th><th>To</th><th>Tipo</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td>SessionItem.exerciseId</td><td>Exercise.id</td><td>N→1</td><td>FK statica, no cascade delete</td></tr>
          <tr><td>Day.items</td><td>SessionItem</td><td>1→N</td><td>Ordinato (drag riorder)</td></tr>
          <tr><td>Week.days</td><td>Day</td><td>1→4</td><td>Fisso, può essere ridotto a 3 via tweak</td></tr>
          <tr><td>Meso.weeks</td><td>Week</td><td>1→5</td><td>Block periodization</td></tr>
          <tr><td>Exercise.id ∈ chain</td><td>SP_PROGRESSIONS</td><td>1→1</td><td>Lookup via SP_PROG_INDEX</td></tr>
        </tbody>
      </table>

      <h2>Derived state (non persistito)</h2>
      <ul>
        <li><code>dayFatigue(items)</code> → 0-100, somma pesata di <code>fatigueLoad × levelMult × setsMult × rpeMult</code></li>
        <li><code>dayHighIntensityConflict(items)</code> → ritorna gli item con <code>level ≥ 4</code> se ≥ 2</li>
        <li><code>currentSkillStop(weeks, chain)</code> → posizione massima raggiunta in una catena (per Progress)</li>
      </ul>
    </>
  );
}

function Flow() {
  const steps = [
    { num: '01', name: 'Filtra catalogo',  desc: 'Skill chip (Planche/FL/HSPU) + search. Il rail mostra esercizi raggruppati per skill, ordinati per livello.' },
    { num: '02', name: 'Drag verso il giorno', desc: "L'ExerciseCard ha draggable. Il payload è exerciseId via dataTransfer custom MIME application/x-sp-ex." },
    { num: '03', name: 'DayColumn riceve drop', desc: 'Crea SessionItem con scheme di default. Update store → rerender DayColumn con il nuovo item.' },
    { num: '04', name: 'Recompute fatigue',  desc: 'spDayFatigue ricalcola; FatigueBar cambia colore se sfora soglia. Se ≥ 2 esercizi lvl ≥ 4 → AlertBanner.' },
    { num: '05', name: 'Edit inline',        desc: 'Click sul nome dell\'item → expand a 4 campi (set × rep × RPE × rest), tutti tipografati mono.' },
    { num: '06', name: 'Duplica settimana',  desc: 'Modal: scegli target + preset (Volume / −Intensità / Deload) + override per esercizio (±1 set, ±1 tacca).' },
  ];
  return (
    <>
      <div className="docs-kicker">Deliverable 2</div>
      <h1>User flow: dall'esercizio al calendario</h1>
      <p>Sei stati discreti, nessuno bloccante. La modifica è ottimistica: persist su localStorage a ogni update.</p>

      <div className="flow">
        {steps.map(s => (
          <div className="flow__step" key={s.num}>
            <div className="flow__num">{s.num}</div>
            <div className="flow__name">{s.name}</div>
            <div className="flow__desc">{s.desc}</div>
          </div>
        ))}
      </div>

      <h2>Flussi secondari</h2>
      <ul>
        <li>
          <b>Riorder intra-day</b>: il SessionItem stesso è draggable. Payload <code>application/x-sp-item</code> con
          <code>{` { uid, weekIdx, dayIdx, idx }`}</code>. La DayColumn distingue MIME → muove invece di clonare.
        </li>
        <li>
          <b>Move cross-day</b>: stesso meccanismo, la destinazione legge from-coords dal payload e chiama <code>moveItem()</code>.
        </li>
        <li>
          <b>Swap suggestion</b>: se l'alert intensità è attivo, l'app calcola <code>regression(item.exerciseId)</code> e
          offre un bottone "swap →" che rimpiazza in-place senza toccare set/rep/RPE.
        </li>
        <li>
          <b>Today</b>: la tab Today legge <code>state.today = {`{ weekIdx, dayIdx }`}</code>. Checkbox segna l'item in <code>completedItems[uid]</code>.
        </li>
      </ul>
    </>
  );
}

function Components() {
  const list = [
    ['AppShell',           'Header + tabs Planner/Today/Progress/Docs + meta', 'Layout'],
    ['ExerciseCard',       'Card draggable. LevelChip + nome + meta', 'Catalog'],
    ['LevelChip',          'Pastiglia 1-5 con scala oklch semaforica', 'Atomo'],
    ['StimChip',           'Badge mono ISO/DIN/ECC', 'Atomo'],
    ['FilterChip',         'Toggle per skill nel catalog rail', 'Catalog'],
    ['CatalogRail',        'Sidebar 300px: search + filtri + lista raggruppata', 'Planner'],
    ['WeekStrip',          'Tabs 5 settimane con heatmap mini fatigue', 'Planner'],
    ['DayColumn',          'Colonna giorno: head editabile + FatigueBar + AlertBanner + dropzone', 'Planner'],
    ['SessionItem',        'Riga esercizio: LevelChip + nome + scheme + actions, drag-source', 'Planner'],
    ['SchemeEditor',       'Edit inline 4-field (set/rep/rpe/rest)', 'Planner'],
    ['FatigueBar',         'Barra 0-100 con stato ok/warn/hi', 'Atomo'],
    ['AlertBanner',        'Yellow soft alert + swap suggestion CTA', 'Day'],
    ['DuplicateWeekModal', 'Modal con preset radio + per-exercise tuning (±set, ±tacca)', 'Modal'],
    ['TodayView',          'Schermata esecuzione: checklist + side panel fatigue+breakdown', 'Today'],
    ['ProgressDashboard',  'KPI cards + line chart fatigue + bar chart volume + skill tracks + mix', 'Progress'],
    ['SkillTrack',         'Visualizza la catena propedeutica con step done/current/todo', 'Progress'],
    ['DocsView',           'Nav 5 sezioni + body markdown-style', 'Docs'],
    ['TweaksPanel',        'Floating panel: theme, lingua, density, days/week, soglia fatigue', 'Tweaks'],
  ];

  return (
    <>
      <div className="docs-kicker">Deliverable 3</div>
      <h1>Componenti UI</h1>
      <p>
        18 componenti, organizzati in atomi (chip, bar), molecole (card, row), organismi (column, panel, modal) e
        screen-level views.
      </p>
      <table>
        <thead><tr><th>Componente</th><th>Ruolo</th><th>Area</th></tr></thead>
        <tbody>
          {list.map(([name, role, area]) => (
            <tr key={name}>
              <td><code>{name}</code></td>
              <td>{role}</td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{area}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Token visivi</h2>
      <ul>
        <li><b>Intensità</b>: scala oklch semaforica (1=lime → 5=red). Usata solo per LevelChip e FatigueBar fill.</li>
        <li><b>Tipografia</b>: Helvetica per UI, IBM Plex Mono per qualsiasi numero (set, rep, RPE, rest, fatigue).</li>
        <li><b>Densità</b>: <code>--density-row</code> varia 30/36px tra compact/comfortable. Tweak runtime.</li>
        <li><b>Layer</b>: bg (warm white) / bg-elev (white) / bg-sunk (off-white). Niente shadow su superfici interne.</li>
      </ul>
    </>
  );
}

function Constraints() {
  return (
    <>
      <div className="docs-kicker">Deliverable 4</div>
      <h1>Logica di constraint</h1>
      <p>
        Tre layer di guardrail. Tutti soft — l'utente è avanzato e sa quando un giorno "rosso" è intenzionale (es. test PR).
      </p>

      <h2>Layer 1 — Fatigue score per giorno</h2>
      <p>
        Per ogni giorno calcoliamo un punteggio 0-100. La barra cambia colore alla soglia configurata
        (default <code>70</code>, tweakable).
      </p>
<pre>{`spDayFatigue(items) =
  Σ items, of:
    ex.fatigueLoad        // base
    × (0.6 + ex.level * 0.18)     // intensityMult: lvl1=.78, lvl5=1.5
    × (0.6 + item.sets * 0.12)    // setsMult
    × (0.7 + (item.rpe-6) * 0.10) // rpeMult: RPE6=0.7, RPE9=1.0
    × 0.5                         // global scale

state =
  score ≥ threshold + 15  →  "hi"   (rosso)
  score ≥ threshold       →  "warn" (arancio)
  altrimenti              →  "ok"   (verde)`}</pre>

      <h2>Layer 2 — Stacking lvl ≥ 4</h2>
      <p>
        Se in un giorno trovo ≥ 2 esercizi con <code>level ≥ 4</code>, mostro l'AlertBanner giallo con:
      </p>
      <ol>
        <li>Diagnosi: <i>"Carico CNS elevato: 2+ esercizi a intensità ≥4 nello stesso giorno"</i>.</li>
        <li>Suggerimento di swap: prendo il <i>primo</i> esercizio in conflitto, calcolo <code>regression(exerciseId)</code> dalla catena propedeutica, propongo lo scambio.</li>
        <li>CTA <code>swap →</code>: rimpiazza in-place senza alterare set/rep/RPE/rest. Mantiene il volume, riduce la difficoltà.</li>
      </ol>
      <p>
        <b>Non blocca</b>. L'utente può ignorare. Esempio reale per il tuo livello: Straddle Planche + Deficit HSPU in PUSH SKILL
        è legittimo se l'altro push day è leggero — l'app segnala, tu decidi.
      </p>

      <h2>Layer 3 — Settimana &amp; meso</h2>
      <ul>
        <li>WeekStrip heatmap: ogni W mostra 4 celle colorate dalla fatigue di giornata → vedi a colpo d'occhio se W3 è troppo "rossa".</li>
        <li>Progress dashboard: line chart settimanale + linea tratteggiata sulla soglia. Se la curva sfora per 2+ weeks consecutive, è un signal per inserire un deload (W5 di default è già etichettata come deload).</li>
        <li>Duplicate-week: il preset <i>Deload</i> applica <code>sets×0.6, RPE−2, rest×0.8</code>. Pensato per W5 dopo un blocco di accumulo.</li>
      </ul>

      <h2>Casi non gestiti (intenzionali)</h2>
      <ul>
        <li><b>Volume settimanale per skill</b>: non c'è un cap. Un atleta in PR push può legittimamente fare 18 set di planche/week.</li>
        <li><b>Distribuzione set lungo il meso</b>: nessun autopilot. La progressione è esplicita via "duplica con preset".</li>
        <li><b>Rest day enforcement</b>: il template è 4/week, ma puoi inserire 0 esercizi in un giorno per fare un rest day a posizione fissa.</li>
      </ul>
    </>
  );
}

window.Docs = Docs;
