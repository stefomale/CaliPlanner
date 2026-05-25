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
  const [menuOpen, setMenuOpen] = React.useState(false);

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

  function handleTabClick(id) {
    setTab(id);
    setMenuOpen(false);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__brand-mark"></span>
          <span className="topbar__brand-text">CaliPlanner</span>
        </div>

        {/* Desktop tabs — hidden on mobile */}
        <div className="topbar__tabs">
          {tabs.map(tabDef => (
            <button
              key={tabDef.id}
              className={`tab ${tab === tabDef.id ? 'tab--active' : ''}`}
              onClick={() => handleTabClick(tabDef.id)}
            >{tabDef.label}</button>
          ))}
        </div>

        {/* Always visible: profiles + sync */}
        <ProfileSwitcher />
        <SyncButton />

        {/* Hamburger — mobile only */}
        <button
          className={`hamburger-btn${menuOpen ? ' hamburger-btn--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu navigazione"
        >
          <span /><span /><span />
        </button>

        <div className="topbar__meta">
          <span className="topbar__chip">
            {state.meso.weeks.length}w · {tweaks.daysPerWeek}d/w
          </span>
          <span>v0.2</span>
        </div>
      </header>

      {/* Mobile dropdown nav */}
      <div className={`mobile-nav${menuOpen ? ' mobile-nav--open' : ''}`}>
        {tabs.map(tabDef => (
          <button
            key={tabDef.id}
            className={`mobile-nav__item${tab === tabDef.id ? ' mobile-nav__item--active' : ''}`}
            onClick={() => handleTabClick(tabDef.id)}
          >{tabDef.label}</button>
        ))}
      </div>

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

function ProfileSwitcher() {
  const active = window.SP_STORE.getActiveProfile();
  const profiles = window.SP_STORE.SP_PROFILES;

  return (
    <div className="profile-switcher">
      {Object.entries(profiles).map(([key, p]) => (
        <button
          key={key}
          className={`profile-btn ${active === key ? 'profile-btn--active' : ''}`}
          onClick={() => active !== key && window.SP_STORE.switchProfile(key)}
          title={p.label}
        >
          <span className="profile-btn__emoji">{p.emoji}</span>
          <span className="profile-btn__label">{p.label}</span>
        </button>
      ))}
    </div>
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
