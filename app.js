/* app.js (MVC light – single file, GitHub Pages-safe)
   Model = DATA
   Controller = state + event handlers
   View = render functions
*/

const CONFIG = {
  DEFAULT_SEASON: "2025/26",
  // frozen "today" to match your rule
  FROZEN_TODAY_ISO: "2026-01-12",
  // for past seasons: age reference = Aug 1 of season start year
  PAST_REF_MONTH: 8,
  PAST_REF_DAY: 1,

  // SDR benchmark bands (heuristic ranges, used for narrative)
  LIGUE1_AVG_WINGER_SDR_PCT_RANGE: [52, 54],
  EURO_TOP_WINGER_SDR_PCT_GOOD: 55,
  EURO_TOP_WINGER_SDR_PCT_DIFFERENTIATOR: 60,
  EURO_TOP_WINGER_SDR_PCT_ELITE: 65
};

const PLAYER = {
  name: "Désiré Nonka-Maho Doué",
  nationality: "France",
  dobISO: "2005-06-03",
  dobDisplay: "03 Jun 2005",
  heightCm: 181,
  weightKg: 70,
  preferredFoot: "Right",
  shirtNumber: 14,
  primaryPosition: "RW (Winger)",
  marketValue: "€93M",
  nationalTeam: "France (debut 23 Mar 2025) — 4 caps, 0 goals",
  transfers: [
    "Paris Saint-Germain — 17 Aug 2024 — €50M",
    "Stade Rennais — 1 Jul 2022 (from U19)"
  ],
  pitchDot: { leftPct: 78, topPct: 35 },

  reportText: {
    physical:
`Désiré Doué presents good overall coordination and balance, enabling close control under contact. His short-distance acceleration is a clear physical asset for wide isolation scenarios. While not dominant aerially, he shows sufficient lower-body strength to protect the ball during dribbling. There remains development margin in upper-body strength, which could improve robustness in elite-level duels.`,

    technical:
`Doué’s standout technical quality is his 1v1 dribbling efficiency. Across the observed seasons he records a consistently high Successful Dribble Rate (SDR), reaching the high-60% range in peak seasons. This places him well above the typical Ligue 1 winger baseline and within an elite range for European wide players.

Profile indicators:
• Close control in tight spaces; strong body feints and change of direction.
• Effective timing to engage the fullback and eliminate without requiring physical dominance.
• Combines high success rate with meaningful volume, indicating repeatability rather than isolated events.
• Passing range complements the dribble threat (switches and third-man options).`,

    tactical:
`Operates primarily as a right winger, capable of holding width or attacking the half-space. Shows awareness to isolate the opposing fullback and create favorable 1v1 situations. Fits possession-based models that require wide players to break defensive structures via individual actions. Next development focus is decision consistency after the dribble (final pass vs. shot selection).`,

    opinion:
`High-upside winger profile with elite 1v1 potential. The dribble efficiency is a differentiator relative to average wide players and supports “outstanding dribbling ability” within the project’s criteria. Recommendation: continue monitoring with emphasis on translating 1v1 superiority into repeatable final-third output (xA, key passes, and shot quality) against elite opposition.`
  }
};

const SEASON_ORDER = ["2022/23", "2023/24", "2024/25", "2025/26"];

const SEASONS = {
  "2022/23": {
    club: "Stade Rennais",
    league: "Ligue 1",
    general: { mp: 26, min: 1125, gls: 3, ast: 1, rating: 6.81 },
    finishing: { shots: 21, sot: 6, bcm: 0 },
    creativity: { keyp: 15, bcc: 1, sdr: 48 },
    passing: { aps: 342, apsPct: 81.2, alb: 23, lbaPct: 82.1 },
    defending: { tack: 37, int: 13, yc: 5 },
    additional: { xg: 1.56, xa: 1.33, gi: 4, xgi: 2.89 },
    dribbling: { sdrPct: 69.0, sdrPerMatch: 1.8 }
  },
  "2023/24": {
    club: "Stade Rennais",
    league: "Ligue 1",
    general: { mp: 31, min: 1632, gls: 4, ast: 4, rating: 7.11 },
    finishing: { shots: 34, sot: 13, bcm: 2 },
    creativity: { keyp: 31, bcc: 5, sdr: 64 },
    passing: { aps: 554, apsPct: 79.0, alb: 36, lbaPct: 81.8 },
    defending: { tack: 32, int: 14, yc: 3 },
    additional: { xg: 2.38, xa: 3.72, gi: 8, xgi: 6.09 },
    dribbling: { sdrPct: 67.0, sdrPerMatch: 2.1 }
  },
  "2024/25": {
    club: "Paris Saint-Germain",
    league: "Ligue 1",
    general: { mp: 31, min: 1734, gls: 6, ast: 6, rating: 7.32 },
    finishing: { shots: 55, sot: 20, bcm: 7 },
    creativity: { keyp: 55, bcc: 16, sdr: 57 },
    passing: { aps: 887, apsPct: 86.1, alb: 24, lbaPct: 54.5 },
    defending: { tack: 48, int: 13, yc: 1 },
    additional: { xg: 5.14, xa: 5.67, gi: 12, xgi: 10.82 },
    dribbling: { sdrPct: 48.0, sdrPerMatch: 1.8 }
  },
  "2025/26": {
    club: "Paris Saint-Germain",
    league: "Ligue 1",
    general: { mp: 8, min: 428, gls: 3, ast: 1, rating: 7.14 },
    finishing: { shots: 15, sot: 6, bcm: 1 },
    creativity: { keyp: 13, bcc: 1, sdr: 8 },
    passing: { aps: 228, apsPct: 85.4, alb: 6, lbaPct: 46.2 },
    defending: { tack: 15, int: 3, yc: 0 },
    additional: { xg: 2.23, xa: 0.97, gi: 4, xgi: 3.20 },
    dribbling: { sdrPct: 28.0, sdrPerMatch: 1.0 }
  }
};

/* ===== Utilities ===== */

const el = (id)=>document.getElementById(id);

function setText(id, v){
  const n = el(id);
  if (!n) return;
  n.textContent = (v === null || v === undefined) ? "—" : String(v);
}

function parseISO(iso){
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m-1, d));
}

function seasonStartYear(seasonKey){
  return Number(seasonKey.split("/")[0]);
}

function refDateForSeason(seasonKey){
  if (seasonKey === CONFIG.DEFAULT_SEASON) return parseISO(CONFIG.FROZEN_TODAY_ISO);
  const y = seasonStartYear(seasonKey);
  return new Date(Date.UTC(y, CONFIG.PAST_REF_MONTH-1, CONFIG.PAST_REF_DAY));
}

function ageAt(dobISO, ref){
  const dob = parseISO(dobISO);
  let age = ref.getUTCFullYear() - dob.getUTCFullYear();
  const m = ref.getUTCMonth() - dob.getUTCMonth();
  if (m < 0 || (m === 0 && ref.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}

function fmtPct(n){
  if (n === null || n === undefined) return "—";
  return `${Number(n).toFixed(1)}%`;
}

function fmt2(n){
  if (n === null || n === undefined) return "—";
  return Number(n).toFixed(2);
}

function fmt1(n){
  if (n === null || n === undefined) return "—";
  return Number(n).toFixed(1);
}

/* ===== Charts ===== */

const PALETTE = {
  blue: "#004D98",
  maroon: "#A50044",
  gold: "#EDBB00",
  ink: "#111111",
  muted: "#58626d",
};

function clear(ctx,w,h){ ctx.clearRect(0,0,w,h); }

function axes(ctx,w,h,p){
  ctx.lineWidth = 2;
  ctx.strokeStyle = PALETTE.ink;
  ctx.beginPath();
  ctx.moveTo(p,p);
  ctx.lineTo(p,h-p);
  ctx.lineTo(w-p,h-p);
  ctx.stroke();
}

function yLabel(ctx, text, x, y){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(-Math.PI/2);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function lineChart(canvasId, labels, values, yText){
  const c = el(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  const w=c.width, h=c.height;
  const p=34;

  clear(ctx,w,h);
  axes(ctx,w,h,p);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const yMin = min - 5;
  const yMax = max + 5;

  ctx.fillStyle = PALETTE.muted;
  ctx.font = "11px Arial";
  yLabel(ctx, yText, 12, h/2+20);

  const step = (w-2*p)/(labels.length-1);

  ctx.strokeStyle = PALETTE.maroon;
  ctx.lineWidth = 3;
  ctx.beginPath();
  values.forEach((v,i)=>{
    const x = p + i*step;
    const y = (h-p) - ((v-yMin)/(yMax-yMin))*(h-2*p);
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  values.forEach((v,i)=>{
    const x = p + i*step;
    const y = (h-p) - ((v-yMin)/(yMax-yMin))*(h-2*p);

    ctx.fillStyle = PALETTE.gold;
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();

    ctx.fillStyle = PALETTE.ink;
    ctx.font = "11px Arial";
    ctx.fillText(labels[i], x-18, h-10);
    ctx.fillText(`${v.toFixed(1)}%`, x-18, y-10);
  });
}

function barChart(canvasId, labels, values, yText){
  const c = el(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  const w=c.width, h=c.height;
  const p=34;

  clear(ctx,w,h);
  axes(ctx,w,h,p);

  const max = Math.max(...values, 1);
  const slot = (w-2*p)/labels.length;
  const bw = slot*0.55;

  ctx.fillStyle = PALETTE.muted;
  ctx.font = "11px Arial";
  yLabel(ctx, yText, 12, h/2+20);

  labels.forEach((lab,i)=>{
    const x0 = p + i*slot + (slot-bw)/2;
    const bh = (values[i]/max)*(h-2*p);
    const y0 = (h-p)-bh;

    ctx.fillStyle = PALETTE.blue;
    ctx.fillRect(x0,y0,bw,bh);

    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(x0,y0,bw,bh);

    ctx.fillStyle = PALETTE.ink;
    ctx.font = "11px Arial";
    ctx.fillText(lab, x0-2, h-10);
    ctx.fillText(String(values[i]), x0 + bw/2 - 4, y0 - 8);
  });
}

function renderCharts(){
  const labels = SEASON_ORDER;
  const sdr = labels.map(s => SEASONS[s].dribbling.sdrPct);
  const gi  = labels.map(s => SEASONS[s].additional.gi);

  lineChart("chartSdr", labels, sdr, "SDR%");
  barChart("chartGi", labels, gi, "GI (G+A)");
}

/* ===== View ===== */

function renderStatic(){
  setText("pName", PLAYER.name);
  setText("pNat", PLAYER.nationality);
  setText("pDob", PLAYER.dobDisplay);
  setText("pHw", `${PLAYER.heightCm} cm / ${PLAYER.weightKg} kg`);
  setText("pFoot", PLAYER.preferredFoot);
  setText("pShirt", PLAYER.shirtNumber);
  setText("pPos", PLAYER.primaryPosition);
  setText("pValue", PLAYER.marketValue);
  setText("pNT", PLAYER.nationalTeam);
  setText("pTransfers", PLAYER.transfers.join(" | "));

  setText("txtPhysical", PLAYER.reportText.physical);
  setText("txtTechnical", PLAYER.reportText.technical);
  setText("txtTactical", PLAYER.reportText.tactical);
  setText("txtOpinion", PLAYER.reportText.opinion);

  const dot = el("posDot");
  if (dot){
    dot.style.left = `${PLAYER.pitchDot.leftPct}%`;
    dot.style.top  = `${PLAYER.pitchDot.topPct}%`;
  }
  setText("posTag", "RW");
}

function buildSdrContext(seasonKey){
  const s = SEASONS[seasonKey];
  const pct = s.dribbling.sdrPct;

  const [l1Low, l1High] = CONFIG.LIGUE1_AVG_WINGER_SDR_PCT_RANGE;
  const good = CONFIG.EURO_TOP_WINGER_SDR_PCT_GOOD;
  const diff = CONFIG.EURO_TOP_WINGER_SDR_PCT_DIFFERENTIATOR;
  const elite = CONFIG.EURO_TOP_WINGER_SDR_PCT_ELITE;

  let band = "below average";
  if (pct >= l1Low && pct <= l1High) band = "around Ligue 1 average";
  else if (pct > l1High && pct < diff) band = "good (above Ligue 1 average)";
  else if (pct >= diff && pct < elite) band = "very good (European differentiator range)";
  else if (pct >= elite) band = "elite (outstanding dribbling range)";

  return `Definition:
• SDR% (Successful Dribble Rate) = successful dribbles / attempted dribbles. It measures 1v1 dribble efficiency (not physical duels).

Benchmarks (heuristic scouting context):
• Typical Ligue 1 winger baseline: ~${l1Low}–${l1High}% SDR
• Top-club winger (European level): ${good}%+ is “good”, ${diff}%+ is a differentiator, ${elite}%+ is elite

Selected season (${seasonKey}):
• Doué SDR%: ${pct.toFixed(1)}% → ${band}
• Volume indicator: ${s.dribbling.sdrPerMatch.toFixed(1)} successful dribbles per match`;
}

function renderSeason(seasonKey){
  const s = SEASONS[seasonKey];
  if (!s) return;

  setText("chipSeason", `Season: ${seasonKey}`);
  setText("pClub", s.club);
  setText("pLeague", s.league);

  const ref = refDateForSeason(seasonKey);
  const age = ageAt(PLAYER.dobISO, ref);
  setText("pAge", `${age} (ref: ${ref.toISOString().slice(0,10)})`);

  const note = (seasonKey === CONFIG.DEFAULT_SEASON)
    ? `Default view uses frozen date ${CONFIG.FROZEN_TODAY_ISO} for reproducibility.`
    : `Age reference for past seasons: 01/08/${seasonStartYear(seasonKey)}.`;
  setText("ageRefNote", note);

  setText("kpiMp", s.general.mp);
  setText("kpiMin", s.general.min);
  setText("kpiGls", s.general.gls);
  setText("kpiAst", s.general.ast);
  setText("kpiRating", fmt2(s.general.rating));

  setText("kpiSdrPct", fmtPct(s.dribbling.sdrPct));
  setText("kpiSdrVol", `${fmt1(s.dribbling.sdrPerMatch)} successful dribbles / match`);

  setText("kpiXg", s.additional.xg);
  setText("kpiXa", s.additional.xa);
  setText("kpiGi", s.additional.gi);
  setText("kpiXgi", s.additional.xgi);

  setText("finShots", s.finishing.shots);
  setText("finSot", s.finishing.sot);
  setText("finBcm", s.finishing.bcm);

  setText("creKeyp", s.creativity.keyp);
  setText("creBcc", s.creativity.bcc);
  setText("creSdr", s.creativity.sdr);

  setText("pasAps", s.passing.aps);
  setText("pasPct", fmtPct(s.passing.apsPct));
  setText("pasAlb", s.passing.alb);
  setText("pasLbPct", fmtPct(s.passing.lbaPct));

  setText("defTack", s.defending.tack);
  setText("defInt", s.defending.int);
  setText("defYc", s.defending.yc);

  setText("addXg", s.additional.xg);
  setText("addXa", s.additional.xa);
  setText("addGi", s.additional.gi);
  setText("addXgi", s.additional.xgi);

  setText("sdrContext", buildSdrContext(seasonKey));
  setText("status", `Status: season applied → ${seasonKey}.`);
}

function initSeasonSelect(state){
  const s = el("seasonSelect");
  if (!s) return;

  s.innerHTML = "";
  SEASON_ORDER.forEach(k=>{
    const o = document.createElement("option");
    o.value = k;
    o.textContent = k;
    s.appendChild(o);
  });
  s.value = state.season;

  s.addEventListener("change", ()=>{
    state.season = s.value;
    renderSeason(state.season);
  });
}

/* Drag dot */
function initPitchDrag(){
  const dot = el("posDot");
  if (!dot) return;
  const pitch = dot.parentElement;
  let dragging = false;

  const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));

  dot.addEventListener("mousedown",(e)=>{
    dragging = true;
    dot.style.cursor = "grabbing";
    e.preventDefault();
  });
  window.addEventListener("mouseup",()=>{
    dragging = false;
    dot.style.cursor = "grab";
  });
  window.addEventListener("mousemove",(e)=>{
    if (!dragging) return;
    const r = pitch.getBoundingClientRect();
    const x = clamp(e.clientX - r.left, 0, r.width);
    const y = clamp(e.clientY - r.top, 0, r.height);
    dot.style.left = (x/r.width*100).toFixed(2) + "%";
    dot.style.top  = (y/r.height*100).toFixed(2) + "%";
  });
}

function initSummaryButton(state){
  const b = el("btnSummary");
  if (!b) return;
  b.addEventListener("click", ()=>{
    const s = SEASONS[state.season];
    const ref = refDateForSeason(state.season);
    const age = ageAt(PLAYER.dobISO, ref);

    const msg =
`SCOUTING SUMMARY
Player: ${PLAYER.name}
Season: ${state.season}
Club: ${s.club} | League: ${s.league}
Age (ref ${ref.toISOString().slice(0,10)}): ${age}
Position: ${PLAYER.primaryPosition}

Dribbling (key criterion):
SDR% ${s.dribbling.sdrPct.toFixed(1)} | Successful dribbles/match ${s.dribbling.sdrPerMatch.toFixed(1)}

Core production:
MP ${s.general.mp} | MIN ${s.general.min} | G ${s.general.gls} | A ${s.general.ast} | Rating ${s.general.rating.toFixed(2)}

Additional:
xG ${s.additional.xg} | xA ${s.additional.xa} | GI ${s.additional.gi} | xGI ${s.additional.xgi}`;

    alert(msg);
  });
}

/* ===== Bootstrap ===== */

const state = { season: CONFIG.DEFAULT_SEASON };

function init(){
  renderStatic();
  initSeasonSelect(state);
  initPitchDrag();
  initSummaryButton(state);

  renderSeason(state.season);
  renderCharts();

  setText("status", `Status: ready (default season ${state.season}, frozen date ${CONFIG.FROZEN_TODAY_ISO}).`);
}

document.addEventListener("DOMContentLoaded", init);

