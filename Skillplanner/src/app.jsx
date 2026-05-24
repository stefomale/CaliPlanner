// SkillPlanner — root App
/* global React, ReactDOM */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "language": "IT",
  "density": "comfortable",
  "daysPerWeek": 4,
  "fatigueThreshold": 70
}/*EDITMODE-END*/;

function App() {
  const [state, actions] = window.SP_STORE.useSpStore();
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('planner');

  // Apply theme + density attributes
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks.theme, tweaks.density]);

  const tt = window.SP_STORE.SP_I18N[tweaks.language] || window.SP_STORE.SP_I18N.IT;

  const tabs = [
    { id: 'planner',  label: tt.planner },
    { id: 'today',    label: tt.today },
    { id: 'progress', label: tt.progress },
    { id: 'docs',     label: tt.docs },
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__brand-mark"></span>
          CaliPlanner
        </div>
        <div className="topbar__tabs">
          {tabs.map(tabDef => (
            <button
              key={tabDef.id}
              className={`tab ${tab === tabDef.id ? 'tab--active' : ''}`}
              onClick={() => setTab(tabDef.id)}
            >{tabDef.label}</button>
          ))}
        </div>
        <div className="topbar__meta">
          <SyncButton />
          <span className="topbar__chip">
            {state.meso.weeks.length}w · {tweaks.daysPerWeek}d/w
          </span>
          <span>v0.1 · prototype</span>
        </div>
      </header>

      <div style={{ overflow: 'hidden', minHeight: 0 }}>
        {tab === 'planner'  && <Planner  state={state} actions={actions} tweaks={tweaks} t={tt} />}
        {tab === 'today'    && <Today    state={state} actions={actions} tweaks={tweaks} t={tt} />}
        {tab === 'progress' && <Progress state={state} tweaks={tweaks} t={tt} />}
        {tab === 'docs'     && <Docs />}
      </div>

      <SkillTweaksPanel tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

function SkillTweaksPanel({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Aspetto">
        <TweakRadio
          label="Tema"
          value={tweaks.theme}
          onChange={v => setTweak('theme', v)}
          options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
        />
        <TweakRadio
          label="Densità"
          value={tweaks.density}
          onChange={v => setTweak('density', v)}
          options={[{ value: 'comfortable', label: 'Comoda' }, { value: 'compact', label: 'Compatta' }]}
        />
        <TweakRadio
          label="Lingua"
          value={tweaks.language}
          onChange={v => setTweak('language', v)}
          options={[{ value: 'IT', label: 'IT' }, { value: 'EN', label: 'EN' }]}
        />
      </TweakSection>
      <TweakSection label="Pianificazione">
        <TweakRadio
          label="Allenamenti / settimana"
          value={tweaks.daysPerWeek}
          onChange={v => setTweak('daysPerWeek', Number(v))}
          options={[{ value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }]}
        />
        <TweakSlider
          label="Soglia fatigue (warn)"
          value={tweaks.fatigueThreshold}
          onChange={v => setTweak('fatigueThreshold', v)}
          min={40} max={100} step={5}
          unit="/100"
        />
      </TweakSection>
    </TweaksPanel>
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
