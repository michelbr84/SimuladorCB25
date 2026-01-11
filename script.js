// =========================
// Teams (Série A 2025 - conforme sua imagem de tabela)
// =========================
let currentTeams = [
  { id: "FLA", name: "Flamengo", short: "FLA" },
  { id: "PAL", name: "Palmeiras", short: "PAL" },
  { id: "CRU", name: "Cruzeiro", short: "CRU" },
  { id: "MIR", name: "Mirassol", short: "MIR" },
  { id: "FLU", name: "Fluminense", short: "FLU" },
  { id: "BOT", name: "Botafogo", short: "BOT" },
  { id: "BAH", name: "Bahia", short: "BAH" },
  { id: "SAO", name: "São Paulo", short: "SAO" },
  { id: "GRE", name: "Grêmio", short: "GRE" },
  { id: "RBB", name: "Bragantino", short: "RBB" },

  { id: "CAM", name: "Atlético-MG", short: "CAM" },
  { id: "SAN", name: "Santos", short: "SAN" },
  { id: "COR", name: "Corinthians", short: "COR" },
  { id: "VAS", name: "Vasco", short: "VAS" },
  { id: "VIT", name: "Vitória", short: "VIT" },
  { id: "INT", name: "Internacional", short: "INT" },
  { id: "CEA", name: "Ceará", short: "CEA" },
  { id: "FOR", name: "Fortaleza", short: "FOR" },
  { id: "JUV", name: "Juventude", short: "JUV" },
  { id: "SPT", name: "Sport", short: "SPT" },
];

// =========================
// Série B Teams (tabela oculta - times que podem ser promovidos)
// =========================
let serieBTeams = [
  { id: "CTB", name: "Coritiba", short: "CTB" },
  { id: "CAP", name: "Athletico-PR", short: "CAP" },
  { id: "CHA", name: "Chapecoense", short: "CHA" },
  { id: "REM", name: "Remo", short: "REM" },
];

// Current edition/year
let currentEdition = 2025;

// =========================
// User Team State
// =========================
let userTeamId = null; // Time selecionado pelo usuário
let userTeamStats = {
  titulos: 0,
  libertadores: 0,
  preLibertadores: 0,
  sulAmericana: 0,
  rebaixamentos: 0
};
let isUserInSerieB = false; // Se o time do usuário está rebaixado
let userSerieBSeasons = 0;  // Temporadas restantes na Série B

// Build team lookup from current teams
function buildTeamLookup() {
  return Object.fromEntries(currentTeams.map(t => [t.id, t]));
}

// Build lookup including Serie B teams
function buildAllTeamsLookup() {
  const all = [...currentTeams, ...serieBTeams];
  return Object.fromEntries(all.map(t => [t.id, t]));
}

let TEAM_BY_ID = buildTeamLookup();
let ALL_TEAMS_BY_ID = buildAllTeamsLookup();

// =========================
// Deterministic RNG (seed)
// - xmur3 (hash) + sfc32 (PRNG)
// =========================
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= (h >>> 16);
    return h >>> 0;
  };
}

function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function makeRng(seedStr) {
  const seed = seedStr?.trim() ? seedStr.trim() : "default-2025";
  const h = xmur3(seed);
  return sfc32(h(), h(), h(), h());
}

// =========================
// Round-robin scheduler (38 rounds / 20 teams)
// Circle method: 19 rounds (turno) + 19 rounds (returno)
// =========================
function buildRounds(teamIds, rng) {
  // Important: deterministic shuffle based on seed (optional, but makes season vary with seed)
  const ids = [...teamIds];
  // Fisher-Yates using rng
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  const n = ids.length; // 20
  const fixed = ids[0];
  let rotating = ids.slice(1); // 19

  const firstLeg = [];
  for (let round = 0; round < n - 1; round++) { // 19
    const pairs = [];

    const left = [fixed, ...rotating.slice(0, (n / 2) - 1)];          // 10
    const right = [...rotating.slice((n / 2) - 1)].reverse();         // 10

    for (let i = 0; i < n / 2; i++) {
      const a = left[i];
      const b = right[i];

      // Alternate home/away to balance
      const home = (round + i) % 2 === 0 ? a : b;
      const away = (round + i) % 2 === 0 ? b : a;

      pairs.push({ home, away, result: null, meta: makeMeta(round + 1, i + 1) });
    }

    firstLeg.push({ number: round + 1, matches: pairs });

    // rotate: move last to front
    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, rotating.length - 1)];
  }

  // second leg: swap home/away
  const secondLeg = firstLeg.map(r => ({
    number: r.number + (n - 1),
    matches: r.matches.map(m => ({
      home: m.away,
      away: m.home,
      result: null,
      meta: makeMeta(r.number + (n - 1), 0) // meta placeholder
    }))
  }));

  return [...firstLeg, ...secondLeg]; // 38
}

// Minimal metadata placeholder (you can replace with official dates/venues later)
function makeMeta(roundNumber, slot) {
  return {
    date: `RODADA ${roundNumber}`,
    venue: `Jogo ${slot}`,
    time: `—`,
  };
}

// =========================
// Table stats
// =========================
function makeEmptyStats(teamId) {
  return { id: teamId, P: 0, J: 0, V: 0, E: 0, D: 0, GP: 0, GC: 0, SG: 0 };
}

// =========================
// Season Advancement (Promoção/Rebaixamento)
// =========================
function advanceToNextSeason() {
  // Get the current standings sorted
  const sorted = sortStandings(Object.values(statsById));

  // Get the last 4 teams (positions 17-20 - relegated)
  const relegatedTeamIds = sorted.slice(16, 20).map(s => s.id);
  const relegatedTeams = relegatedTeamIds.map(id => TEAM_BY_ID[id]);

  // Check if user's team is relegated
  const userWasRelegated = userTeamId && relegatedTeamIds.includes(userTeamId);

  // Get promoted teams from Série B
  const promotedTeams = [...serieBTeams];

  // Check if user's team is being promoted
  const userIsBeingPromoted = isUserInSerieB && serieBTeams.some(t => t.id === userTeamId);

  // Update Série B with relegated teams
  serieBTeams = [...relegatedTeams];

  // Remove relegated teams from current teams and add promoted teams
  currentTeams = currentTeams.filter(t => !relegatedTeamIds.includes(t.id));
  currentTeams.push(...promotedTeams);

  // Rebuild the team lookups
  TEAM_BY_ID = buildTeamLookup();
  ALL_TEAMS_BY_ID = buildAllTeamsLookup();

  // Handle user relegation state
  if (userWasRelegated) {
    isUserInSerieB = true;
    userSerieBSeasons = 1;
  } else if (userIsBeingPromoted) {
    isUserInSerieB = false;
    userSerieBSeasons = 0;
  }

  // Increment edition
  currentEdition += 1;

  // Update seed for new season
  seedValue = `season-${currentEdition}`;

  // Build fresh season with new teams
  buildFreshSeason();

  // Update the edition title in the UI
  updateEditionTitle();

  // If user is in Serie B, simulate the season automatically and show message
  if (isUserInSerieB) {
    showSerieBModal();
  }
}

function updateEditionTitle() {
  const editionEl = document.getElementById("editionTitle");
  if (editionEl) {
    editionEl.textContent = `Campeonato Brasileiro Série A — Edição ${currentEdition}`;
  }
}

function sortStandings(list) {
  return [...list].sort((a, b) => {
    if (b.P !== a.P) return b.P - a.P;
    if (b.V !== a.V) return b.V - a.V;
    if (b.SG !== a.SG) return b.SG - a.SG;
    if (b.GP !== a.GP) return b.GP - a.GP;
    if (a.GC !== b.GC) return a.GC - b.GC;
    return TEAM_BY_ID[a.id].name.localeCompare(TEAM_BY_ID[b.id].name, "pt-BR");
  });
}

function zoneClass(pos) {
  // 1-4 Libertadores, 5-6 Pré, 7-12 Sul, 13-16 Neutro, 17-20 Rebaixados
  if (pos >= 1 && pos <= 4) return "z-lib";
  if (pos >= 5 && pos <= 6) return "z-pre";
  if (pos >= 7 && pos <= 12) return "z-sul";
  if (pos >= 13 && pos <= 16) return "z-neu";
  if (pos >= 17 && pos <= 20) return "z-reb";
  return "";
}

// =========================
// Goal sampling (deterministic with rng)
// =========================
function sampleGoals(rng, isHome) {
  const r = rng();
  let g = 0;
  if (r < 0.28) g = 0;
  else if (r < 0.56) g = 1;
  else if (r < 0.77) g = 2;
  else if (r < 0.90) g = 3;
  else if (r < 0.97) g = 4;
  else g = 5;

  // small home advantage
  if (isHome && rng() < 0.18) g += 1;

  return Math.min(g, 6);
}

function applyMatchToTable(statsById, match) {
  const { home, away, result } = match;
  const hg = result.hg, ag = result.ag;

  const h = statsById[home];
  const a = statsById[away];

  h.J += 1; a.J += 1;
  h.GP += hg; h.GC += ag;
  a.GP += ag; a.GC += hg;

  if (hg > ag) { h.V += 1; h.P += 3; a.D += 1; }
  else if (hg < ag) { a.V += 1; a.P += 3; h.D += 1; }
  else { h.E += 1; a.E += 1; h.P += 1; a.P += 1; }

  h.SG = h.GP - h.GC;
  a.SG = a.GP - a.GC;
}

// =========================
// App State
// =========================
let seedValue = "default-2025";
let rng = makeRng(seedValue);

let rounds = [];                 // 38 rounds
let statsById = {};              // table stats
let simulatedRoundIndex = 0;     // how many rounds already simulated (0..38)
let viewingRoundIndex = 0;       // which round user is viewing (0..37)

// =========================
// Init / Reset
// =========================
function buildFreshSeason() {
  rng = makeRng(seedValue);

  const teamIds = currentTeams.map(t => t.id);
  rounds = buildRounds(teamIds, rng);

  statsById = Object.fromEntries(currentTeams.map(t => [t.id, makeEmptyStats(t.id)]));
  simulatedRoundIndex = 0;
  viewingRoundIndex = 0;

  updateEditionTitle();
  updateControls();
  renderAll();
}

function recomputeTableFromSimulated() {
  statsById = Object.fromEntries(currentTeams.map(t => [t.id, makeEmptyStats(t.id)]));
  for (let i = 0; i < simulatedRoundIndex; i++) {
    rounds[i].matches.forEach(m => {
      if (m.result) applyMatchToTable(statsById, m);
    });
  }
}

// =========================
// Simulation
// =========================
function simulateNextRound() {
  if (simulatedRoundIndex >= 38) return;

  // For determinism across actions:
  // We build the entire season with rng, and each simulated match consumes rng in a fixed order.
  const round = rounds[simulatedRoundIndex];

  round.matches = round.matches.map(m => {
    if (m.result) return m;
    const hg = sampleGoals(rng, true);
    const ag = sampleGoals(rng, false);
    return { ...m, result: { hg, ag } };
  });

  // Apply to table incrementally
  round.matches.forEach(m => applyMatchToTable(statsById, m));

  simulatedRoundIndex += 1;

  // Auto-advance view to current round (optional, feels natural)
  viewingRoundIndex = Math.min(simulatedRoundIndex, 38) - 1;

  updateControls();
  renderAll();
}

function simulateAll() {
  while (simulatedRoundIndex < 38) simulateNextRound();
}

// =========================
// UI Rendering
// =========================
function ordinalRoundTitle(n) {
  // 1ª, 2ª ... 38ª
  return `${n}ª RODADA`;
}

function renderStandings() {
  const body = document.getElementById("standingsBody");
  body.innerHTML = "";

  const sorted = sortStandings(Object.values(statsById));
  sorted.forEach((s, idx) => {
    const pos = idx + 1;
    const team = TEAM_BY_ID[s.id];

    const tr = document.createElement("tr");
    let classes = zoneClass(pos);

    // Highlight user's team
    if (s.id === userTeamId) {
      classes += " user-team";
    }
    tr.className = classes;

    tr.innerHTML = `
      <td class="col-pos">${pos}</td>
      <td class="col-team">
        <div class="teamcell">
          <span class="teamname">${team.name}</span>
          <span class="teamslug">${team.short}</span>
        </div>
      </td>
      <td class="col-num strong">${s.P}</td>
      <td class="col-num">${s.J}</td>
      <td class="col-num">${s.V}</td>
      <td class="col-num">${s.SG}</td>
      <td class="col-num">${s.GP}</td>
    `;
    body.appendChild(tr);
  });
}

function renderMatches() {
  const list = document.getElementById("matchesList");
  list.innerHTML = "";

  const round = rounds[viewingRoundIndex];
  const matches = round.matches;

  const left = document.createElement("div");
  left.className = "matches-col";
  const right = document.createElement("div");
  right.className = "matches-col";

  const half = Math.ceil(matches.length / 2);
  const leftMatches = matches.slice(0, half);
  const rightMatches = matches.slice(half);

  function makeMatchCard(m) {
    const home = TEAM_BY_ID[m.home];
    const away = TEAM_BY_ID[m.away];
    const r = m.result;

    const card = document.createElement("div");
    card.className = "match";

    card.innerHTML = `
      <div class="match-meta">
        <span class="meta-date">${m.meta.date}</span>
        <span class="meta-venue">${m.meta.venue}</span>
        <span class="meta-time">${m.meta.time}</span>
      </div>

      <div class="match-row">
        <div class="side">
          <div class="crest">${home.short}</div>
          <div class="abbr">${home.short}</div>
        </div>

        <div class="score">
          <span class="g">${r ? r.hg : "—"}</span>
          <span class="x">x</span>
          <span class="g">${r ? r.ag : "—"}</span>
        </div>

        <div class="side right">
          <div class="abbr">${away.short}</div>
          <div class="crest">${away.short}</div>
        </div>
      </div>
    `;
    return card;
  }

  leftMatches.forEach(m => left.appendChild(makeMatchCard(m)));
  rightMatches.forEach(m => right.appendChild(makeMatchCard(m)));

  list.appendChild(left);
  list.appendChild(right);
}

function renderHeader() {
  const roundNumber = viewingRoundIndex + 1;
  document.getElementById("roundTitle").textContent = ordinalRoundTitle(roundNumber);
  document.getElementById("roundNum").textContent = String(roundNumber);

  const status = document.getElementById("roundStatus");
  const isSimulated = viewingRoundIndex < simulatedRoundIndex;
  status.textContent = isSimulated ? "Rodada simulada" : "Aguardando simulação";

  const note = document.getElementById("footerNote");
  if (simulatedRoundIndex >= 38) {
    note.innerHTML = `<span class="muted">Status:</span> campeonato finalizado (38/38).`;
  } else {
    note.innerHTML = `<span class="muted">Status:</span> simuladas <b>${simulatedRoundIndex}/38</b> rodadas.`;
  }
}

function updateControls() {
  const btnNext = document.getElementById("btnNext");
  const btnSimAll = document.getElementById("btnSimAll");
  const btnNextSeason = document.getElementById("btnNextSeason");

  const seasonComplete = simulatedRoundIndex >= 38;

  btnNext.disabled = seasonComplete;
  btnSimAll.disabled = seasonComplete;

  // Show/hide next season button
  if (btnNextSeason) {
    btnNextSeason.style.display = seasonComplete ? "inline-block" : "none";
  }

  // Show season result modal when season completes
  if (seasonComplete && userTeamId && !isUserInSerieB) {
    // Only show once per season completion
    const modalShown = document.getElementById("seasonResultModal").style.display === "flex";
    if (!modalShown && !document.getElementById("seasonResultModal").dataset.shown) {
      showSeasonResultModal();
      document.getElementById("seasonResultModal").dataset.shown = "true";
    }
  }

  const btnPrevRound = document.getElementById("btnPrevRound");
  const btnNextRoundView = document.getElementById("btnNextRoundView");

  btnPrevRound.disabled = viewingRoundIndex <= 0;
  btnNextRoundView.disabled = viewingRoundIndex >= 37;

  // if viewing future round, still allow browsing
}

function renderAll() {
  renderHeader();
  renderStandings();
  renderMatches();
  updateControls();
}

// =========================
// Modal Functions
// =========================
function showTeamSelectionModal() {
  const modal = document.getElementById("teamSelectionModal");
  const grid = document.getElementById("teamSelectionGrid");
  grid.innerHTML = "";

  // Show all Serie A teams for selection
  currentTeams.forEach(team => {
    const btn = document.createElement("button");
    btn.className = "team-select-btn";
    btn.innerHTML = `
      <span class="team-select-short">${team.short}</span>
      <span class="team-select-name">${team.name}</span>
    `;
    btn.addEventListener("click", () => selectUserTeam(team.id));
    grid.appendChild(btn);
  });

  modal.style.display = "flex";
}

function selectUserTeam(teamId) {
  userTeamId = teamId;
  const modal = document.getElementById("teamSelectionModal");
  modal.style.display = "none";

  // Update UI to show selected team
  updateUserTeamDisplay();
  renderAll();
}

function updateUserTeamDisplay() {
  const display = document.getElementById("userTeamDisplay");
  if (display && userTeamId) {
    const team = ALL_TEAMS_BY_ID[userTeamId];
    display.innerHTML = `<span class="user-team-badge">${team.short}</span>`;
    display.style.display = "flex";
  }
}

function getSeasonResultMessage(position) {
  if (position === 1) {
    return { title: "🏆 CAMPEÃO!", message: "Parabéns, você ganhou o Campeonato Brasileiro Série A!", type: "champion" };
  } else if (position >= 2 && position <= 4) {
    return { title: "⭐ LIBERTADORES!", message: "O seu time entrou para a Libertadores!", type: "libertadores" };
  } else if (position >= 5 && position <= 6) {
    return { title: "🌟 PRÉ-LIBERTADORES!", message: "O seu time está na Pré-Libertadores!", type: "pre-libertadores" };
  } else if (position >= 7 && position <= 12) {
    return { title: "🏅 SUL-AMERICANA!", message: "O seu time foi para a Sul-Americana!", type: "sul-americana" };
  } else if (position >= 17 && position <= 20) {
    return { title: "📉 REBAIXADO!", message: "O seu time foi rebaixado!", type: "relegated" };
  } else {
    return { title: "📊 FIM DE TEMPORADA", message: "Seu time terminou na zona neutra.", type: "neutral" };
  }
}

function recordAchievement(position) {
  if (position === 1) {
    userTeamStats.titulos += 1;
  } else if (position >= 2 && position <= 4) {
    userTeamStats.libertadores += 1;
  } else if (position >= 5 && position <= 6) {
    userTeamStats.preLibertadores += 1;
  } else if (position >= 7 && position <= 12) {
    userTeamStats.sulAmericana += 1;
  } else if (position >= 17 && position <= 20) {
    userTeamStats.rebaixamentos += 1;
  }
}

function showSeasonResultModal() {
  if (!userTeamId) return;

  const sorted = sortStandings(Object.values(statsById));
  const userPosition = sorted.findIndex(s => s.id === userTeamId) + 1;

  if (userPosition === 0) return; // User team not in Serie A

  const result = getSeasonResultMessage(userPosition);
  recordAchievement(userPosition);

  const modal = document.getElementById("seasonResultModal");
  const title = document.getElementById("seasonResultTitle");
  const message = document.getElementById("seasonResultMessage");
  const positionEl = document.getElementById("seasonResultPosition");

  title.textContent = result.title;
  title.className = `modal-result-title result-${result.type}`;
  message.textContent = result.message;
  positionEl.textContent = `${userPosition}º lugar`;

  modal.style.display = "flex";
}

function closeSeasonResultModal() {
  const modal = document.getElementById("seasonResultModal");
  modal.style.display = "none";
}

function showAchievementsModal() {
  const modal = document.getElementById("achievementsModal");
  const content = document.getElementById("achievementsContent");

  const team = ALL_TEAMS_BY_ID[userTeamId];
  const teamName = team ? team.name : "Nenhum time selecionado";

  content.innerHTML = `
    <div class="achievements-header">
      <h3>${teamName}</h3>
      ${isUserInSerieB ? '<span class="serie-b-badge">Série B</span>' : ''}
    </div>
    <div class="achievements-grid">
      <div class="achievement-item">
        <span class="achievement-icon">🏆</span>
        <span class="achievement-count">${userTeamStats.titulos}</span>
        <span class="achievement-label">Títulos</span>
      </div>
      <div class="achievement-item">
        <span class="achievement-icon">⭐</span>
        <span class="achievement-count">${userTeamStats.libertadores}</span>
        <span class="achievement-label">Libertadores</span>
      </div>
      <div class="achievement-item">
        <span class="achievement-icon">🌟</span>
        <span class="achievement-count">${userTeamStats.preLibertadores}</span>
        <span class="achievement-label">Pré-Libertadores</span>
      </div>
      <div class="achievement-item">
        <span class="achievement-icon">🏅</span>
        <span class="achievement-count">${userTeamStats.sulAmericana}</span>
        <span class="achievement-label">Sul-Americana</span>
      </div>
      <div class="achievement-item achievement-negative">
        <span class="achievement-icon">📉</span>
        <span class="achievement-count">${userTeamStats.rebaixamentos}</span>
        <span class="achievement-label">Rebaixamentos</span>
      </div>
    </div>
  `;

  modal.style.display = "flex";
}

function closeAchievementsModal() {
  const modal = document.getElementById("achievementsModal");
  modal.style.display = "none";
}

function showSerieBModal() {
  const modal = document.getElementById("serieBModal");
  const team = ALL_TEAMS_BY_ID[userTeamId];
  document.getElementById("serieBTeamName").textContent = team ? team.name : "Seu time";
  modal.style.display = "flex";
}

function closeSerieBModal() {
  const modal = document.getElementById("serieBModal");
  modal.style.display = "none";

  // Simulate the Serie B season automatically
  simulateAll();

  // After Serie B season, advance to next (user team gets promoted)
  userSerieBSeasons = 0;
}

// =========================
// Events
// =========================
function setupEvents() {
  const seedInput = document.getElementById("seedInput");
  seedInput.value = seedValue;

  document.getElementById("btnApplySeed").addEventListener("click", () => {
    seedValue = seedInput.value.trim() || "default-2025";
    buildFreshSeason();
  });

  seedInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      seedValue = seedInput.value.trim() || "default-2025";
      buildFreshSeason();
    }
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    // Reset shown flag for season result modal
    document.getElementById("seasonResultModal").dataset.shown = "";
    buildFreshSeason();
  });

  document.getElementById("btnNext").addEventListener("click", () => {
    simulateNextRound();
  });

  document.getElementById("btnSimAll").addEventListener("click", () => {
    simulateAll();
  });

  document.getElementById("btnNextSeason").addEventListener("click", () => {
    // Reset shown flag for next season
    document.getElementById("seasonResultModal").dataset.shown = "";
    advanceToNextSeason();
  });

  document.getElementById("btnPrevRound").addEventListener("click", () => {
    viewingRoundIndex = Math.max(0, viewingRoundIndex - 1);
    renderAll();
  });

  document.getElementById("btnNextRoundView").addEventListener("click", () => {
    viewingRoundIndex = Math.min(37, viewingRoundIndex + 1);
    renderAll();
  });

  // Modal event listeners
  document.getElementById("btnCloseSeasonResult").addEventListener("click", closeSeasonResultModal);
  document.getElementById("btnCloseAchievements").addEventListener("click", closeAchievementsModal);
  document.getElementById("btnCloseSerieBModal").addEventListener("click", closeSerieBModal);
  document.getElementById("btnShowAchievements").addEventListener("click", showAchievementsModal);
}

// =========================
// Boot
// =========================
setupEvents();
buildFreshSeason();

// Show team selection modal on first load
showTeamSelectionModal();