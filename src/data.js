// SkillPlanner — exercise catalog
// Each exercise has progression chain (prev/next) for "scala propedeutica"
// stimulus: ISO | DIN | ECC
// category: SKILL | FORCE | COMP | ACC
// skill: PLANCHE | FL | HSPU | CORE | ACC
// fatigueLoad: stima 1-100 di carico CNS/muscolare per set di lavoro

window.SP_EXERCISES = [
  // ===== PLANCHE =====
  { id: 'pl-lean',         skill: 'PLANCHE', name: 'Planche Lean',                 category: 'SKILL', level: 1, stimulus: 'ISO', fatigueLoad: 8,  scheme: { sets: 4, reps: '20s', rpe: 7, rest: 90 } },
  { id: 'pl-psp',          skill: 'PLANCHE', name: 'Pseudo Planche Push-up',       category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 12, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 120 } },
  { id: 'pl-tuck',         skill: 'PLANCHE', name: 'Tuck Planche',                 category: 'SKILL', level: 1, stimulus: 'ISO', fatigueLoad: 10, scheme: { sets: 5, reps: '15s', rpe: 7, rest: 120 } },
  { id: 'pl-adv-tuck',     skill: 'PLANCHE', name: 'Adv Tuck Planche',             category: 'SKILL', level: 2, stimulus: 'ISO', fatigueLoad: 15, scheme: { sets: 5, reps: '12s', rpe: 8, rest: 150 } },
  { id: 'pl-straddle',     skill: 'PLANCHE', name: 'Straddle Planche',             category: 'SKILL', level: 4, stimulus: 'ISO', fatigueLoad: 22, scheme: { sets: 5, reps: '6s',  rpe: 8, rest: 180 } },
  { id: 'pl-half-lay',     skill: 'PLANCHE', name: 'Half-Lay Planche',             category: 'SKILL', level: 4, stimulus: 'ISO', fatigueLoad: 25, scheme: { sets: 5, reps: '5s',  rpe: 9, rest: 180 } },
  { id: 'pl-full',         skill: 'PLANCHE', name: 'Full Planche',                 category: 'SKILL', level: 5, stimulus: 'ISO', fatigueLoad: 32, scheme: { sets: 5, reps: '3s',  rpe: 9, rest: 240 } },
  { id: 'pl-full-band',    skill: 'PLANCHE', name: 'Full Planche (band-assisted)', category: 'SKILL', level: 4, stimulus: 'ISO', fatigueLoad: 24, scheme: { sets: 5, reps: '5s',  rpe: 8, rest: 180 } },
  { id: 'pl-neg',          skill: 'PLANCHE', name: 'Planche Negatives (Straddle)', category: 'SKILL', level: 4, stimulus: 'ECC', fatigueLoad: 22, scheme: { sets: 4, reps: '4',   rpe: 8, rest: 180 } },
  { id: 'pl-pup-tuck',     skill: 'PLANCHE', name: 'Planche Push-up Tuck',         category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 18, scheme: { sets: 4, reps: '6',   rpe: 8, rest: 150 } },
  { id: 'pl-pup-adv',      skill: 'PLANCHE', name: 'Planche Push-up Adv Tuck',     category: 'FORCE', level: 4, stimulus: 'DIN', fatigueLoad: 24, scheme: { sets: 4, reps: '5',   rpe: 8, rest: 180 } },
  { id: 'pl-pup-strad',    skill: 'PLANCHE', name: 'Straddle Planche Push-up',     category: 'FORCE', level: 5, stimulus: 'DIN', fatigueLoad: 30, scheme: { sets: 4, reps: '3',   rpe: 9, rest: 210 } },

  // ===== FRONT LEVER =====
  { id: 'fl-tuck',         skill: 'FL', name: 'Tuck Front Lever',                  category: 'SKILL', level: 1, stimulus: 'ISO', fatigueLoad: 10, scheme: { sets: 5, reps: '15s', rpe: 7, rest: 120 } },
  { id: 'fl-adv-tuck',     skill: 'FL', name: 'Adv Tuck Front Lever',              category: 'SKILL', level: 2, stimulus: 'ISO', fatigueLoad: 14, scheme: { sets: 5, reps: '12s', rpe: 8, rest: 150 } },
  { id: 'fl-one-leg',      skill: 'FL', name: 'One Leg Front Lever',               category: 'SKILL', level: 3, stimulus: 'ISO', fatigueLoad: 18, scheme: { sets: 5, reps: '8s',  rpe: 8, rest: 150 } },
  { id: 'fl-one-leg-adv',  skill: 'FL', name: 'One Leg FL Advanced',               category: 'SKILL', level: 3, stimulus: 'ISO', fatigueLoad: 20, scheme: { sets: 5, reps: '6s',  rpe: 8, rest: 180 } },
  { id: 'fl-straddle',     skill: 'FL', name: 'Straddle Front Lever',              category: 'SKILL', level: 4, stimulus: 'ISO', fatigueLoad: 24, scheme: { sets: 5, reps: '5s',  rpe: 8, rest: 180 } },
  { id: 'fl-full',         skill: 'FL', name: 'Full Front Lever',                  category: 'SKILL', level: 5, stimulus: 'ISO', fatigueLoad: 32, scheme: { sets: 5, reps: '3s',  rpe: 9, rest: 240 } },
  { id: 'fl-neg',          skill: 'FL', name: 'Front Lever Negatives',             category: 'SKILL', level: 4, stimulus: 'ECC', fatigueLoad: 22, scheme: { sets: 4, reps: '4',   rpe: 8, rest: 180 } },
  { id: 'fl-raise-tuck',   skill: 'FL', name: 'FL Raise Tuck',                     category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 16, scheme: { sets: 4, reps: '6',   rpe: 8, rest: 150 } },
  { id: 'fl-raise-adv',    skill: 'FL', name: 'FL Raise Adv Tuck',                 category: 'FORCE', level: 4, stimulus: 'DIN', fatigueLoad: 22, scheme: { sets: 4, reps: '5',   rpe: 8, rest: 180 } },
  { id: 'fl-raise-strad',  skill: 'FL', name: 'FL Raise Straddle',                 category: 'FORCE', level: 5, stimulus: 'DIN', fatigueLoad: 28, scheme: { sets: 4, reps: '3',   rpe: 9, rest: 210 } },
  { id: 'fl-icm-tuck',     skill: 'FL', name: 'Ice Cream Maker Tuck',              category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 16, scheme: { sets: 4, reps: '6',   rpe: 8, rest: 120 } },
  { id: 'fl-tucked-pull',  skill: 'FL', name: 'Tucked FL Pull',                    category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 15, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 120 } },

  // ===== HSPU / HANDSTAND =====
  { id: 'hs-pike',         skill: 'HSPU', name: 'Pike Push-up',                    category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 4, reps: '10',  rpe: 7, rest: 90 } },
  { id: 'hs-pike-elev',    skill: 'HSPU', name: 'Elevated Pike Push-up',           category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 12, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 120 } },
  { id: 'hs-hold',         skill: 'HSPU', name: 'Handstand Hold (wall)',           category: 'SKILL', level: 2, stimulus: 'ISO', fatigueLoad: 10, scheme: { sets: 4, reps: '30s', rpe: 7, rest: 90 } },
  { id: 'hs-free',         skill: 'HSPU', name: 'Freestanding Handstand',          category: 'SKILL', level: 3, stimulus: 'ISO', fatigueLoad: 12, scheme: { sets: 5, reps: '20s', rpe: 7, rest: 90 } },
  { id: 'hs-wall',         skill: 'HSPU', name: 'Wall HSPU',                       category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 18, scheme: { sets: 5, reps: '8',   rpe: 8, rest: 150 } },
  { id: 'hs-deficit',      skill: 'HSPU', name: 'Deficit Wall HSPU',               category: 'FORCE', level: 4, stimulus: 'DIN', fatigueLoad: 24, scheme: { sets: 4, reps: '6',   rpe: 8, rest: 180 } },
  { id: 'hs-free-hspu',    skill: 'HSPU', name: 'Freestanding HSPU',               category: 'FORCE', level: 5, stimulus: 'DIN', fatigueLoad: 30, scheme: { sets: 4, reps: '4',   rpe: 9, rest: 210 } },
  { id: 'hs-neg',          skill: 'HSPU', name: 'HSPU Negative',                   category: 'FORCE', level: 3, stimulus: 'ECC', fatigueLoad: 16, scheme: { sets: 4, reps: '4',   rpe: 8, rest: 150 } },
  { id: 'hs-deep-neg',     skill: 'HSPU', name: 'Deep HSPU Negative',              category: 'FORCE', level: 4, stimulus: 'ECC', fatigueLoad: 22, scheme: { sets: 4, reps: '3',   rpe: 8, rest: 180 } },
  { id: 'hs-press-tuck',   skill: 'HSPU', name: 'Press to Handstand Tuck',         category: 'COMP',  level: 4, stimulus: 'DIN', fatigueLoad: 20, scheme: { sets: 4, reps: '4',   rpe: 8, rest: 180 } },
  { id: 'hs-deep-wall',    skill: 'HSPU', name: 'Deep Wall HSPU (paralettes)',     category: 'FORCE', level: 4, stimulus: 'DIN', fatigueLoad: 26, scheme: { sets: 4, reps: '5',   rpe: 8, rest: 180 } },
  { id: 'hs-deep-free',    skill: 'HSPU', name: 'Deep Freestanding HSPU',          category: 'FORCE', level: 5, stimulus: 'DIN', fatigueLoad: 34, scheme: { sets: 4, reps: '3',   rpe: 9, rest: 240 } },
  { id: 'hs-deep-hold',    skill: 'HSPU', name: 'Deep HSPU Bottom Hold',           category: 'FORCE', level: 4, stimulus: 'ISO', fatigueLoad: 18, scheme: { sets: 3, reps: '8s',  rpe: 8, rest: 150 } },

  // ===== ACCESSORY / FORCE =====
  { id: 'ac-w-pullup',     skill: 'ACC', name: 'Weighted Pull-up',                 category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 18, scheme: { sets: 4, reps: '5',   rpe: 8, rest: 180 } },
  { id: 'ac-w-dip',        skill: 'ACC', name: 'Weighted Dip',                     category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 18, scheme: { sets: 4, reps: '5',   rpe: 8, rest: 180 } },
  { id: 'ac-hollow',       skill: 'CORE', name: 'Hollow Body Hold',                category: 'ACC',   level: 1, stimulus: 'ISO', fatigueLoad: 5,  scheme: { sets: 3, reps: '30s', rpe: 7, rest: 60 } },
  { id: 'ac-arch',         skill: 'CORE', name: 'Arch Hold',                       category: 'ACC',   level: 1, stimulus: 'ISO', fatigueLoad: 5,  scheme: { sets: 3, reps: '30s', rpe: 7, rest: 60 } },
  { id: 'ac-scap',         skill: 'ACC', name: 'Scapular Pulls',                   category: 'ACC',   level: 1, stimulus: 'DIN', fatigueLoad: 4,  scheme: { sets: 3, reps: '10',  rpe: 6, rest: 60 } },
  { id: 'ac-wrist',        skill: 'ACC', name: 'Wrist Conditioning',               category: 'ACC',   level: 1, stimulus: 'DIN', fatigueLoad: 3,  scheme: { sets: 3, reps: '15',  rpe: 6, rest: 45 } },
  { id: 'ac-dragon-flag',  skill: 'CORE', name: 'Dragon Flag',                     category: 'FORCE', level: 4, stimulus: 'ECC', fatigueLoad: 14, scheme: { sets: 3, reps: '5',   rpe: 8, rest: 120 } },
  { id: 'ac-german-hang',  skill: 'ACC', name: 'German Hang',                      category: 'ACC',   level: 2, stimulus: 'ISO', fatigueLoad: 6,  scheme: { sets: 3, reps: '20s', rpe: 6, rest: 60 } },

  // ===== PALESTRA — PETTO =====
  { id: 'gm-bench-flat',   type: 'GYM', skill: 'PETTO',     name: 'Panca Piana',              category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 16, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 150 } },
  { id: 'gm-bench-incl',   type: 'GYM', skill: 'PETTO',     name: 'Panca Inclinata',           category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 15, scheme: { sets: 4, reps: '10',  rpe: 8, rest: 120 } },
  { id: 'gm-bench-decl',   type: 'GYM', skill: 'PETTO',     name: 'Panca Declinata',           category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 14, scheme: { sets: 3, reps: '10',  rpe: 8, rest: 120 } },
  { id: 'gm-fly-dumb',     type: 'GYM', skill: 'PETTO',     name: 'Croci con Manubri',         category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 9,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 90 } },
  { id: 'gm-cable-cross',  type: 'GYM', skill: 'PETTO',     name: 'Crossover al Cavo',         category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 3, reps: '15',  rpe: 7, rest: 60 } },
  { id: 'gm-chest-press',  type: 'GYM', skill: 'PETTO',     name: 'Chest Press Machine',       category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 10, scheme: { sets: 3, reps: '12',  rpe: 7, rest: 90 } },
  { id: 'gm-dip-petto',    type: 'GYM', skill: 'PETTO',     name: 'Dip (petto)',               category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 13, scheme: { sets: 4, reps: '10',  rpe: 8, rest: 120 } },

  // ===== PALESTRA — SCHIENA =====
  { id: 'gm-lat-pull',     type: 'GYM', skill: 'SCHIENA',   name: 'Lat Machine',               category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 13, scheme: { sets: 4, reps: '10',  rpe: 7, rest: 120 } },
  { id: 'gm-pullup',       type: 'GYM', skill: 'SCHIENA',   name: 'Trazioni',                  category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 14, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 120 } },
  { id: 'gm-row-bar',      type: 'GYM', skill: 'SCHIENA',   name: 'Rematore con Bilanciere',   category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 16, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 150 } },
  { id: 'gm-row-dumb',     type: 'GYM', skill: 'SCHIENA',   name: 'Rematore con Manubrio',     category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 12, scheme: { sets: 3, reps: '10',  rpe: 8, rest: 90 } },
  { id: 'gm-row-cable',    type: 'GYM', skill: 'SCHIENA',   name: 'Rematore al Cavo',          category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 11, scheme: { sets: 3, reps: '12',  rpe: 7, rest: 90 } },
  { id: 'gm-deadlift',     type: 'GYM', skill: 'SCHIENA',   name: 'Stacco da Terra',           category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 24, scheme: { sets: 4, reps: '5',   rpe: 8, rest: 210 } },
  { id: 'gm-tbar-row',     type: 'GYM', skill: 'SCHIENA',   name: 'T-Bar Row',                 category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 15, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 150 } },
  { id: 'gm-face-pull',    type: 'GYM', skill: 'SCHIENA',   name: 'Face Pull',                 category: 'ACC',   level: 1, stimulus: 'DIN', fatigueLoad: 5,  scheme: { sets: 3, reps: '15',  rpe: 6, rest: 60 } },

  // ===== PALESTRA — SPALLE =====
  { id: 'gm-ohp',          type: 'GYM', skill: 'SPALLE',    name: 'Lento Avanti (OHP)',        category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 14, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 150 } },
  { id: 'gm-lat-raise',    type: 'GYM', skill: 'SPALLE',    name: 'Alzate Laterali',           category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 7,  scheme: { sets: 4, reps: '15',  rpe: 7, rest: 60 } },
  { id: 'gm-front-raise',  type: 'GYM', skill: 'SPALLE',    name: 'Alzate Frontali',           category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 6,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 60 } },
  { id: 'gm-rear-delt',    type: 'GYM', skill: 'SPALLE',    name: 'Alzate Posteriori',         category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 6,  scheme: { sets: 4, reps: '15',  rpe: 7, rest: 60 } },
  { id: 'gm-arnold',       type: 'GYM', skill: 'SPALLE',    name: 'Arnold Press',              category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 12, scheme: { sets: 3, reps: '10',  rpe: 8, rest: 90 } },
  { id: 'gm-shrug',        type: 'GYM', skill: 'SPALLE',    name: 'Scrollate (Shrug)',         category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 90 } },

  // ===== PALESTRA — BICIPITI =====
  { id: 'gm-curl-bar',     type: 'GYM', skill: 'BICIPITI',  name: 'Curl con Bilanciere',       category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 4, reps: '10',  rpe: 7, rest: 90 } },
  { id: 'gm-curl-dumb',    type: 'GYM', skill: 'BICIPITI',  name: 'Curl con Manubri',          category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 7,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 75 } },
  { id: 'gm-hammer',       type: 'GYM', skill: 'BICIPITI',  name: 'Hammer Curl',               category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 7,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 75 } },
  { id: 'gm-preacher',     type: 'GYM', skill: 'BICIPITI',  name: 'Curl al Panca Scott',       category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 3, reps: '10',  rpe: 8, rest: 90 } },
  { id: 'gm-cable-curl',   type: 'GYM', skill: 'BICIPITI',  name: 'Curl al Cavo',              category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 6,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 60 } },
  { id: 'gm-conc-curl',    type: 'GYM', skill: 'BICIPITI',  name: 'Curl di Concentrazione',    category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 6,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 60 } },

  // ===== PALESTRA — TRICIPITI =====
  { id: 'gm-pushdown',     type: 'GYM', skill: 'TRICIPITI', name: 'Pushdown al Cavo',          category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 7,  scheme: { sets: 4, reps: '12',  rpe: 7, rest: 75 } },
  { id: 'gm-skull',        type: 'GYM', skill: 'TRICIPITI', name: 'Skull Crusher',             category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 10, scheme: { sets: 3, reps: '10',  rpe: 8, rest: 90 } },
  { id: 'gm-ohd-ext',      type: 'GYM', skill: 'TRICIPITI', name: 'Estensione Sopraccapo',     category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 75 } },
  { id: 'gm-kickback',     type: 'GYM', skill: 'TRICIPITI', name: 'Tricep Kickback',           category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 5,  scheme: { sets: 3, reps: '15',  rpe: 6, rest: 60 } },
  { id: 'gm-cgbp',         type: 'GYM', skill: 'TRICIPITI', name: 'Panca Presa Stretta',       category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 13, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 120 } },
  { id: 'gm-dip-tri',      type: 'GYM', skill: 'TRICIPITI', name: 'Dip (tricipiti)',           category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 11, scheme: { sets: 4, reps: '10',  rpe: 8, rest: 90 } },

  // ===== PALESTRA — GAMBE =====
  { id: 'gm-squat',        type: 'GYM', skill: 'GAMBE',     name: 'Squat con Bilanciere',      category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 24, scheme: { sets: 4, reps: '6',   rpe: 8, rest: 210 } },
  { id: 'gm-leg-press',    type: 'GYM', skill: 'GAMBE',     name: 'Leg Press',                 category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 18, scheme: { sets: 4, reps: '10',  rpe: 8, rest: 150 } },
  { id: 'gm-leg-ext',      type: 'GYM', skill: 'GAMBE',     name: 'Leg Extension',             category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 10, scheme: { sets: 3, reps: '12',  rpe: 7, rest: 90 } },
  { id: 'gm-leg-curl',     type: 'GYM', skill: 'GAMBE',     name: 'Leg Curl',                  category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 10, scheme: { sets: 3, reps: '12',  rpe: 7, rest: 90 } },
  { id: 'gm-rdl',          type: 'GYM', skill: 'GAMBE',     name: 'Stacco Rumeno (RDL)',       category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 18, scheme: { sets: 4, reps: '10',  rpe: 8, rest: 150 } },
  { id: 'gm-lunge',        type: 'GYM', skill: 'GAMBE',     name: 'Affondi',                   category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 14, scheme: { sets: 3, reps: '12',  rpe: 7, rest: 90 } },
  { id: 'gm-calf',         type: 'GYM', skill: 'GAMBE',     name: 'Calf Raise',                category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 6,  scheme: { sets: 4, reps: '15',  rpe: 7, rest: 60 } },
  { id: 'gm-hack-squat',   type: 'GYM', skill: 'GAMBE',     name: 'Hack Squat',                category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 20, scheme: { sets: 4, reps: '8',   rpe: 8, rest: 150 } },
  { id: 'gm-bss',          type: 'GYM', skill: 'GAMBE',     name: 'Bulgarian Split Squat',     category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 18, scheme: { sets: 3, reps: '8',   rpe: 8, rest: 150 } },
  { id: 'gm-hip-thrust',   type: 'GYM', skill: 'GAMBE',     name: 'Hip Thrust',                category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 14, scheme: { sets: 4, reps: '10',  rpe: 8, rest: 120 } },

  // ===== PALESTRA — CORE =====
  { id: 'gm-crunch',       type: 'GYM', skill: 'CORE_G',    name: 'Crunch',                    category: 'ACC',   level: 1, stimulus: 'DIN', fatigueLoad: 5,  scheme: { sets: 3, reps: '15',  rpe: 6, rest: 45 } },
  { id: 'gm-leg-raise',    type: 'GYM', skill: 'CORE_G',    name: 'Leg Raise',                 category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 60 } },
  { id: 'gm-plank',        type: 'GYM', skill: 'CORE_G',    name: 'Plank',                     category: 'ACC',   level: 1, stimulus: 'ISO', fatigueLoad: 5,  scheme: { sets: 3, reps: '45s', rpe: 6, rest: 45 } },
  { id: 'gm-russian',      type: 'GYM', skill: 'CORE_G',    name: 'Russian Twist',             category: 'ACC',   level: 1, stimulus: 'DIN', fatigueLoad: 5,  scheme: { sets: 3, reps: '20',  rpe: 6, rest: 45 } },
  { id: 'gm-cable-crunch', type: 'GYM', skill: 'CORE_G',    name: 'Cable Crunch',              category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 7,  scheme: { sets: 3, reps: '15',  rpe: 7, rest: 60 } },
  { id: 'gm-ab-machine',   type: 'GYM', skill: 'CORE_G',    name: 'Crunch Machine',            category: 'FORCE', level: 1, stimulus: 'DIN', fatigueLoad: 6,  scheme: { sets: 3, reps: '15',  rpe: 6, rest: 45 } },
  { id: 'gm-hanging-knee', type: 'GYM', skill: 'CORE_G',    name: 'Knee Raise alle Spalle',    category: 'FORCE', level: 2, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 3, reps: '12',  rpe: 7, rest: 60 } },

  // ===== FINISHER POOL =====
  { id: 'fn-l-sit',        skill: 'CORE', name: 'L-Sit Hold',                      category: 'FORCE', level: 2, stimulus: 'ISO', fatigueLoad: 7,  scheme: { sets: 3, reps: '20s', rpe: 8, rest: 60 } },
  { id: 'fn-v-sit',        skill: 'CORE', name: 'V-Sit Hold',                      category: 'FORCE', level: 4, stimulus: 'ISO', fatigueLoad: 12, scheme: { sets: 3, reps: '8s',  rpe: 8, rest: 90 } },
  { id: 'fn-tuck-l',       skill: 'CORE', name: 'Tuck L-Sit',                      category: 'ACC',   level: 1, stimulus: 'ISO', fatigueLoad: 4,  scheme: { sets: 3, reps: '20s', rpe: 7, rest: 45 } },
  { id: 'fn-skin-cat',     skill: 'ACC', name: 'Skin the Cat',                     category: 'ACC',   level: 2, stimulus: 'DIN', fatigueLoad: 5,  scheme: { sets: 3, reps: '5',   rpe: 6, rest: 60 } },
  { id: 'fn-front-press',  skill: 'ACC', name: 'False Grip Pull-up',               category: 'FORCE', level: 3, stimulus: 'DIN', fatigueLoad: 8,  scheme: { sets: 3, reps: '5',   rpe: 8, rest: 90 } },
  { id: 'fn-grip-hang',    skill: 'ACC', name: 'Grip Hang',                        category: 'ACC',   level: 1, stimulus: 'ISO', fatigueLoad: 3,  scheme: { sets: 3, reps: '30s', rpe: 7, rest: 60 } },
  { id: 'fn-pike-comp',    skill: 'CORE', name: 'Pike Compression',                category: 'ACC',   level: 1, stimulus: 'ISO', fatigueLoad: 3,  scheme: { sets: 3, reps: '15s', rpe: 6, rest: 45 } },
  { id: 'fn-rev-plank',    skill: 'ACC', name: 'Reverse Plank',                    category: 'ACC',   level: 1, stimulus: 'ISO', fatigueLoad: 3,  scheme: { sets: 3, reps: '30s', rpe: 6, rest: 45 } },
  { id: 'fn-cuban',        skill: 'ACC', name: 'Cuban Rotation',                   category: 'ACC',   level: 1, stimulus: 'DIN', fatigueLoad: 3,  scheme: { sets: 3, reps: '12',  rpe: 6, rest: 45 } },
  { id: 'fn-finger-ext',   skill: 'ACC', name: 'Finger Extension',                 category: 'ACC',   level: 1, stimulus: 'DIN', fatigueLoad: 2,  scheme: { sets: 3, reps: '15',  rpe: 5, rest: 30 } },
];

// Progressioni (per "scala propedeutica" -1 / +1)
window.SP_PROGRESSIONS = {
  PLANCHE_HOLD:  ['pl-tuck', 'pl-adv-tuck', 'pl-straddle', 'pl-half-lay', 'pl-full'],
  PLANCHE_PUP:   ['pl-psp', 'pl-pup-tuck', 'pl-pup-adv', 'pl-pup-strad'],
  FL_HOLD:       ['fl-tuck', 'fl-adv-tuck', 'fl-one-leg', 'fl-one-leg-adv', 'fl-straddle', 'fl-full'],
  FL_RAISE:      ['fl-raise-tuck', 'fl-raise-adv', 'fl-raise-strad'],
  HSPU_LINE:     ['hs-pike', 'hs-pike-elev', 'hs-wall', 'hs-deficit', 'hs-deep-wall', 'hs-free-hspu', 'hs-deep-free'],
  HS_HOLD:       ['hs-hold', 'hs-free'],
  HSPU_NEG:      ['hs-neg', 'hs-deep-neg'],
};

// Mappa exerciseId -> { chainName, index } per lookup veloce
window.SP_PROG_INDEX = (() => {
  const idx = {};
  for (const [chain, ids] of Object.entries(window.SP_PROGRESSIONS)) {
    ids.forEach((id, i) => { idx[id] = { chain, position: i, chainLength: ids.length }; });
  }
  return idx;
})();

window.SP_BY_ID = Object.fromEntries(window.SP_EXERCISES.map(e => [e.id, { type: 'CAL', ...e }]));

// Schema giorno di default per ogni allenamento (label suggerita)
window.SP_DAY_TEMPLATES = [
  { label: 'PUSH SKILL',  hint: 'Planche + HSPU' },
  { label: 'PULL SKILL',  hint: 'Front Lever + accessory' },
  { label: 'PUSH FORCE',  hint: 'HSPU + Dip' },
  { label: 'PULL FORCE',  hint: 'FL Raise + Pull-up' },
  { label: 'FULL BODY',   hint: 'Mixed' },
];

// ===== SESSION PRESETS =====
// Ogni preset: lista di {exerciseId, overrides?, supersetWithPrev?, section?} dove
// section ∈ 'warmup' | 'main' | 'core' | 'finisher' (default 'main').
window.SP_SESSION_PRESETS = [
  {
    id: 'sp-push-skill-planche',
    name: 'Push Skill · Planche focus',
    tag: 'PUSH',
    desc: 'Hold pesati + push-up planche. Wrist prep + handstand quality.',
    items: [
      { exerciseId: 'ac-wrist',     section: 'warmup' },
      { exerciseId: 'hs-hold',      section: 'warmup' },
      { exerciseId: 'pl-lean',      section: 'main' },
      { exerciseId: 'pl-straddle',  section: 'main', overrides: { sets: 6, reps: '5s', rpe: 8, rest: 180 } },
      { exerciseId: 'pl-full-band', section: 'main' },
      { exerciseId: 'pl-pup-adv',   section: 'main' },
      { exerciseId: 'ac-hollow',    section: 'core' },
    ],
  },
  {
    id: 'sp-push-skill-hspu',
    name: 'Push Skill · HSPU focus',
    tag: 'PUSH',
    desc: 'Handstand + deep deficit. Quality over quantity.',
    items: [
      { exerciseId: 'ac-wrist',     section: 'warmup' },
      { exerciseId: 'hs-free',      section: 'warmup' },
      { exerciseId: 'hs-deficit',   section: 'main', overrides: { sets: 5, reps: '6', rpe: 8 } },
      { exerciseId: 'hs-deep-wall', section: 'main' },
      { exerciseId: 'hs-deep-hold', section: 'main', overrides: { sets: 3, reps: '6s', rpe: 8 } },
      { exerciseId: 'pl-lean',      section: 'core' },
    ],
  },
  {
    id: 'sp-pull-skill-fl',
    name: 'Pull Skill · Front Lever focus',
    tag: 'PULL',
    desc: 'Hold a difficoltà alta + raise dinamici. Scap prep.',
    items: [
      { exerciseId: 'ac-scap',        section: 'warmup' },
      { exerciseId: 'fl-one-leg-adv', section: 'main', overrides: { sets: 6, reps: '6s', rpe: 8, rest: 180 } },
      { exerciseId: 'fl-straddle',    section: 'main', overrides: { sets: 5, reps: '4s', rpe: 8, rest: 180 } },
      { exerciseId: 'fl-raise-adv',   section: 'main' },
      { exerciseId: 'ac-w-pullup',    section: 'main' },
      { exerciseId: 'ac-arch',        section: 'core' },
    ],
  },
  {
    id: 'sp-push-force',
    name: 'Push Force',
    tag: 'PUSH',
    desc: 'Volume dinamico: HSPU verticale + dip pesati + PSP.',
    items: [
      { exerciseId: 'ac-wrist',   section: 'warmup' },
      { exerciseId: 'hs-hold',    section: 'warmup' },
      { exerciseId: 'hs-wall',    section: 'main', overrides: { sets: 5, reps: '8', rpe: 8 } },
      { exerciseId: 'hs-deficit', section: 'main' },
      { exerciseId: 'ac-w-dip',   section: 'main' },
      { exerciseId: 'pl-psp',     section: 'main' },
    ],
  },
  {
    id: 'sp-pull-force',
    name: 'Pull Force',
    tag: 'PULL',
    desc: 'Volume dinamico: pulling + FL raise + core dur.',
    items: [
      { exerciseId: 'ac-scap',         section: 'warmup' },
      { exerciseId: 'fl-tucked-pull',  section: 'main' },
      { exerciseId: 'fl-icm-tuck',     section: 'main' },
      { exerciseId: 'ac-w-pullup',     section: 'main' },
      { exerciseId: 'ac-dragon-flag',  section: 'core' },
      { exerciseId: 'ac-german-hang',  section: 'finisher' },
    ],
  },
  {
    id: 'sp-full-push',
    name: 'Full Push · skill + force combinati',
    tag: 'PUSH',
    desc: 'Tutto push in un giorno. Skill prima, force dopo. Volume alto.',
    items: [
      { exerciseId: 'ac-wrist',    section: 'warmup' },
      { exerciseId: 'hs-hold',     section: 'warmup' },
      { exerciseId: 'pl-straddle', section: 'main', overrides: { sets: 5, reps: '5s' } },
      { exerciseId: 'pl-pup-adv',  section: 'main' },
      { exerciseId: 'hs-deficit',  section: 'main' },
      { exerciseId: 'ac-w-dip',    section: 'main' },
    ],
  },
  {
    id: 'sp-full-pull',
    name: 'Full Pull · skill + force combinati',
    tag: 'PULL',
    desc: 'Tutto pull in un giorno. Hold + raise + weighted.',
    items: [
      { exerciseId: 'ac-scap',        section: 'warmup' },
      { exerciseId: 'fl-one-leg-adv', section: 'main' },
      { exerciseId: 'fl-straddle',    section: 'main', overrides: { sets: 4, reps: '5s' } },
      { exerciseId: 'fl-raise-adv',   section: 'main' },
      { exerciseId: 'ac-w-pullup',    section: 'main' },
      { exerciseId: 'ac-dragon-flag', section: 'core' },
    ],
  },
  {
    id: 'sp-mixed-pp',
    name: 'Mixed · Push + Pull',
    tag: 'MIX',
    desc: 'Push e pull alternati. Volume medio. Ideale a metà settimana.',
    items: [
      { exerciseId: 'ac-wrist',       section: 'warmup' },
      { exerciseId: 'pl-straddle',    section: 'main', overrides: { sets: 4, reps: '5s' } },
      { exerciseId: 'fl-one-leg-adv', section: 'main', overrides: { sets: 4, reps: '6s' } },
      { exerciseId: 'pl-pup-adv',     section: 'main', overrides: { sets: 3, reps: '5' } },
      { exerciseId: 'fl-raise-adv',   section: 'main', overrides: { sets: 3, reps: '5' } },
      { exerciseId: 'ac-hollow',      section: 'core' },
    ],
  },
  {
    id: 'sp-deload',
    name: 'Deload · low intensity',
    tag: 'DELOAD',
    desc: 'Lavoro tecnico leggero. Niente massimali. Mantieni il pattern.',
    items: [
      { exerciseId: 'ac-wrist',     section: 'warmup' },
      { exerciseId: 'hs-hold',      section: 'warmup', overrides: { sets: 3, reps: '20s', rpe: 6 } },
      { exerciseId: 'pl-adv-tuck',  section: 'main',   overrides: { sets: 3, reps: '10s', rpe: 6 } },
      { exerciseId: 'fl-adv-tuck',  section: 'main',   overrides: { sets: 3, reps: '10s', rpe: 6 } },
      { exerciseId: 'ac-hollow',    section: 'core' },
    ],
  },
];

// ===== FINISHER PRESETS =====
window.SP_FINISHER_PRESETS = [
  {
    id: 'fn-core-classic',
    name: 'Core · Hollow + Arch',
    desc: '~4 min. Anti-extension + anti-flexion alternati in superset.',
    items: [
      { exerciseId: 'ac-hollow', section: 'finisher', overrides: { sets: 3, reps: '30s', rpe: 7, rest: 30 } },
      { exerciseId: 'ac-arch',   section: 'finisher', overrides: { sets: 3, reps: '30s', rpe: 7, rest: 30 }, supersetWithPrev: true },
    ],
  },
  {
    id: 'fn-l-sit-ladder',
    name: 'L-Sit ladder',
    desc: 'Tuck → L-Sit → V-Sit. Hold massimali brevi.',
    items: [
      { exerciseId: 'fn-tuck-l', section: 'finisher', overrides: { sets: 2, reps: '20s', rpe: 7, rest: 45 } },
      { exerciseId: 'fn-l-sit',  section: 'finisher', overrides: { sets: 2, reps: '15s', rpe: 8, rest: 60 } },
      { exerciseId: 'fn-v-sit',  section: 'finisher', overrides: { sets: 2, reps: '6s',  rpe: 9, rest: 60 } },
    ],
  },
  {
    id: 'fn-wrist',
    name: 'Wrist & Forearm',
    desc: 'Conditioning + Cuban + finger ext. Per chi spinge tanto.',
    items: [
      { exerciseId: 'ac-wrist',       section: 'finisher', overrides: { sets: 3, reps: '15', rpe: 6 } },
      { exerciseId: 'fn-cuban',       section: 'finisher', overrides: { sets: 3, reps: '12', rpe: 6 } },
      { exerciseId: 'fn-finger-ext',  section: 'finisher', overrides: { sets: 3, reps: '15', rpe: 5 } },
    ],
  },
  {
    id: 'fn-grip',
    name: 'Grip & Hang',
    desc: 'Dead hang + skin the cat. Salute scapolare + grip.',
    items: [
      { exerciseId: 'fn-grip-hang',  section: 'finisher', overrides: { sets: 3, reps: '30s', rpe: 7, rest: 60 } },
      { exerciseId: 'fn-skin-cat',   section: 'finisher', overrides: { sets: 3, reps: '5',   rpe: 6, rest: 60 } },
    ],
  },
  {
    id: 'fn-mobility',
    name: 'Mobility · Pike + Reverse',
    desc: 'Pike compression + reverse plank. Per la posizione di forza.',
    items: [
      { exerciseId: 'fn-pike-comp',  section: 'finisher', overrides: { sets: 3, reps: '15s', rpe: 6, rest: 45 } },
      { exerciseId: 'fn-rev-plank',  section: 'finisher', overrides: { sets: 3, reps: '30s', rpe: 6, rest: 45 } },
    ],
  },
];

// ===== WEEK PRESETS =====
// Ogni preset = array di 4 dayPresetId (riferimenti a SP_SESSION_PRESETS).
// Il 5° giorno opzionale resta vuoto come rest.
window.SP_WEEK_PRESETS = [
  {
    id: 'wp-balanced',
    name: 'Balanced Hybrid',
    desc: '2 push + 2 pull. Skill prima, force dopo. Default consigliato.',
    days: ['sp-push-skill-planche', 'sp-pull-skill-fl', 'sp-push-force', 'sp-pull-force'],
  },
  {
    id: 'wp-all-push',
    name: 'Block specializzazione · Push',
    desc: '4 push days. Per cicli brevi (1-2 settimane) focalizzati su Planche/HSPU.',
    days: ['sp-push-skill-planche', 'sp-push-force', 'sp-push-skill-hspu', 'sp-full-push'],
  },
  {
    id: 'wp-all-pull',
    name: 'Block specializzazione · Pull',
    desc: '4 pull days. Per spingere Front Lever in un mesociclo dedicato.',
    days: ['sp-pull-skill-fl', 'sp-pull-force', 'sp-pull-skill-fl', 'sp-full-pull'],
  },
  {
    id: 'wp-skill-force-split',
    name: 'Skill / Force split',
    desc: 'D1 Push Skill · D2 Pull Skill · D3 Push Force · D4 Pull Force.',
    days: ['sp-push-skill-planche', 'sp-pull-skill-fl', 'sp-push-force', 'sp-pull-force'],
  },
  {
    id: 'wp-mixed',
    name: 'Mixed sessions',
    desc: '4 giorni con push e pull dentro la stessa seduta. Volume medio.',
    days: ['sp-mixed-pp', 'sp-mixed-pp', 'sp-mixed-pp', 'sp-mixed-pp'],
  },
  {
    id: 'wp-full',
    name: 'Full Push / Full Pull',
    desc: '2 full push + 2 full pull. Volume molto alto. Solo per blocchi specifici.',
    days: ['sp-full-push', 'sp-full-pull', 'sp-full-push', 'sp-full-pull'],
  },
  {
    id: 'wp-deload',
    name: 'Deload Week',
    desc: '4 sessioni a basso volume e RPE 6. Da usare a fine blocco.',
    days: ['sp-deload', 'sp-deload', 'sp-deload', 'sp-deload'],
  },
];

// Helper: espande un session-preset in items reali con uid e supersetGroup
window.SP_EXPAND_PRESET = function(preset, opts = {}) {
  const items = [];
  let groupCounter = 0;
  for (let i = 0; i < preset.items.length; i++) {
    const tpl = preset.items[i];
    const ex = window.SP_BY_ID[tpl.exerciseId];
    if (!ex) continue;
    const base = { ...ex.scheme, ...(tpl.overrides || {}) };
    let supersetGroup = null;
    if (tpl.supersetWithPrev && items.length > 0) {
      const prev = items[items.length - 1];
      if (prev.supersetGroup) {
        supersetGroup = prev.supersetGroup;
      } else {
        groupCounter++;
        supersetGroup = `g${groupCounter}-${Date.now().toString(36)}`;
        prev.supersetGroup = supersetGroup;
      }
    }
    items.push({
      uid: `${tpl.exerciseId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}-${i}`,
      exerciseId: tpl.exerciseId,
      section: tpl.section || 'main',
      sets: base.sets, reps: base.reps, rpe: base.rpe, rest: base.rest,
      supersetGroup,
    });
  }
  // Sort items by section order
  return window.SP_SORT_BY_SECTION(items);
};

window.SP_SECTION_ORDER = ['warmup', 'main', 'core', 'finisher'];
window.SP_SECTION_LABELS = {
  warmup: 'Warmup',
  main: 'Main block',
  core: 'Core',
  finisher: 'Finisher',
};
window.SP_SORT_BY_SECTION = function(items) {
  const out = [];
  for (const sec of window.SP_SECTION_ORDER) {
    for (const it of items) if ((it.section || 'main') === sec) out.push(it);
  }
  return out;
};

// Mesociclo iniziale (5 settimane × 4 giorni), pre-riempito su W1 con qualcosa di realistico
window.SP_DEFAULT_MESO = () => {
  const mkItem = (exId, section = 'main', overrides = {}) => {
    const ex = window.SP_BY_ID[exId];
    return {
      uid: `${exId}-${Math.random().toString(36).slice(2, 7)}`,
      exerciseId: exId,
      section,
      ...ex.scheme,
      ...overrides,
    };
  };
  const week1Days = [
    { label: 'PUSH SKILL', items: window.SP_SORT_BY_SECTION([
      mkItem('ac-wrist',     'warmup'),
      mkItem('hs-hold',       'warmup'),
      mkItem('pl-lean',       'main'),
      mkItem('pl-straddle',   'main', { sets: 6, reps: '5s', rpe: 8, rest: 180 }),
      mkItem('pl-full-band',  'main', { sets: 5, reps: '4s', rpe: 8, rest: 180 }),
      mkItem('pl-pup-adv',    'main'),
      mkItem('ac-hollow',     'core'),
    ])},
    { label: 'PULL SKILL', items: window.SP_SORT_BY_SECTION([
      mkItem('ac-scap',        'warmup'),
      mkItem('fl-one-leg-adv', 'main', { sets: 6, reps: '6s', rpe: 8, rest: 180 }),
      mkItem('fl-straddle',    'main', { sets: 5, reps: '4s', rpe: 8, rest: 180 }),
      mkItem('fl-raise-adv',   'main'),
      mkItem('ac-w-pullup',    'main'),
      mkItem('ac-arch',        'core'),
    ])},
    { label: 'PUSH FORCE', items: window.SP_SORT_BY_SECTION([
      mkItem('ac-wrist',   'warmup'),
      mkItem('hs-hold',    'warmup'),
      mkItem('hs-wall',    'main', { sets: 5, reps: '8', rpe: 8, rest: 150 }),
      mkItem('hs-deficit', 'main'),
      mkItem('ac-w-dip',   'main'),
      mkItem('pl-psp',     'main'),
    ])},
    { label: 'PULL FORCE', items: window.SP_SORT_BY_SECTION([
      mkItem('ac-scap',        'warmup'),
      mkItem('fl-tucked-pull', 'main'),
      mkItem('fl-icm-tuck',    'main'),
      mkItem('ac-w-pullup',    'main'),
      mkItem('ac-dragon-flag', 'core'),
      mkItem('ac-german-hang', 'finisher'),
    ])},
  ];

  // W2-W5 vuote (utente le popolerà via "Duplica")
  const weeks = [
    { id: 'w1', index: 0, days: week1Days },
    { id: 'w2', index: 1, days: emptyDays() },
    { id: 'w3', index: 2, days: emptyDays() },
    { id: 'w4', index: 3, days: emptyDays() },
    { id: 'w5', index: 4, days: emptyDays(true) },  // deload suggerito
  ];
  return {
    id: 'meso-1',
    name: 'Planche × FL × HSPU — Block 1',
    startDate: new Date().toISOString().slice(0, 10),
    weeks,
  };

  function emptyDays(isDeload) {
    return [
      { label: isDeload ? 'PUSH SKILL · deload' : 'PUSH SKILL', items: [] },
      { label: isDeload ? 'PULL SKILL · deload' : 'PULL SKILL', items: [] },
      { label: isDeload ? 'PUSH FORCE · deload' : 'PUSH FORCE', items: [] },
      { label: isDeload ? 'PULL FORCE · deload' : 'PULL FORCE', items: [] },
    ];
  }
};
