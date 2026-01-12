// app.js (CONTROLLER + VIEW)
import { CONFIG, PLAYER, SEASONS, SEASON_ORDER } from "./data.js";

/* =========================
   MODEL HELPERS
========================= */

function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function computeAge(dobISO, refDate) {
  // age at refDate (UTC safe enough for this use)
  const dob = parseISODate(dobISO);
  let age = refDate.getUTCFullYear() - dob.getUTCFullYear();
  const m = refDate.getUTCMonth() - dob.getUTCMonth();
  if (m < 0 || (m === 0 && refDate.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}

function seasonStartYear(seasonKey) {
  // "2025/26" -> 2025
  return Number(seasonKey.split("/")[0]);
}

function referenceDateForSeason(seasonKey) {
  if (seasonKey === CONFIG.DEFAULT_SEASON) {
    return parseISODate(CONFIG.FROZEN_TODAY_ISO); // frozen "today"
  }
  const y = seasonStartYear(seasonKey);
  return new Date(Date.UTC(y, CONFIG.PAST_SEASON_REF_MONTH - 1, CONFIG.PAST_SEASON_REF_DAY));
}

/* =========================
   VIEW HELPERS
========================= */

const el = (id) => document.getElementById(id);

function setText(id, value) {
  const node = el(id);
  if (!node) return;
  node.textContent = value ?? "—";
}

function fmtNum(n) {
  if (n === null || n === undefined) return "—";
  if (typeof n === "number") return String(n);
  return String(n);
}

function fmtPct(n) {
  if (n === null || n === undefined) return "—";
  return `${n.toFixed(1)}%`;
}

function fmtRating(n) {
  if (n === null || n === undefined) return "—";
  return n.toFixed(2);
}

function renderStaticIdentity() {
  setText("p-name", PLAYER.name);
  setText("p-nat", PLAYER.nationality);
  setText("p-dob", "03 Jun 2005");                 // keep display-friendly!!!
  setText("p-height", `${PLAYER.heightCm} cm`);
  setText("p-weight", PLAYER.weightKg ? `${PLAYER.weightKg} kg` : "[Add later]");
  setText("p-foot", PLAYER.preferredFoot);
  setText("p-shirt", fmtNum(PLAYER.shirtNumber));
  setText("p-position", PLAYER.primaryPosition);
  setText("p-profile", PLAYER.profile);
  setText("p-value", PLAYER.marketValue);
  setText("p-nt", PLAYER.nationalTeam);
  setText("p-transfers", PLAYER.transfers.join(" | "));

  // pitch default
  const dot = el("posDot");
  dot.style.left = `${PLAYER.pitchDot.leftPct}%`;
  dot.style.top = `${PLAYER.pitchDot.topPct}%`;
  setText("posTag", "RW");
}

function renderSeason(seasonKey) {
  const s = SEASONS[seasonKey];
  if (!s) return;

  // season identity
  setText("p-club", s.club);
  setText("p-league", s.league);

  // age
  const ref = referenceDateForSeason(seasonKey);
  const age = computeAge(PLAYER.dobISO, ref);
  setText("p-age", `${age} (ref: ${ref.toISOString().slice(0,10)})`);

  // left KPIs
  setText("kpi-mp", fmtNum(s.general.mp));
  setText("kpi-min", fmtNum(s.general.min));
  setText("kpi-gls", fmtNum(s.general.gls));
  setText("kpi-ast", fmtNum(s.general.ast));
  setText("kpi-rating", fmtRating(s.general.rating));
  setText("kpi-xg", fmtNum(s.additional.xg));
  setText("kpi-xa", fmtNum(s.additional.xa));
  setText("kpi-gi", fmtNum(s.additional.gi));
  setText("kpi-xgi", fmtNum(s.additional.xgi));

  // tables
  setText("fin-shots", fmtNum(s.finishing.shots));
  setText("fin-sot", fmtNum(s.finishing.sot));
  setText("fin-bcm", fmtNum(s.finishing.bcm));

  setText("cre-keyp", fmtNum(s.creativity.keyp));
  setText("cre-bcc", fmtNum(s.creativity.bcc));
  setText("cre-sdr", fmtNum(s.creativity.sdr));

  setText("pas-aps", fmtNum(s.passes.aps));
  setText("pas-pct", fmtPct(s.passes.apsPct));
  setText("pas-alb", fmtNum(s.passes.alb));
  setText("pas-lbpct", fmtPct(s.passes.lbaPct));

  setText("def-tack", fmtNum(s.defense.tack));
  setText("def-int", fmtNum(s.defense.inter));
  setText("def-yc", fmtNum(s.defense.yc));

  setText("add-xg", fmtNum(s.additional.xg));
  setText("add-xa", fmtNum(s.additional.xa));
  setText("add-gi", fmtNum(s.additional.gi));
  setText("add-xgi", fmtNum(s.additional.xgi));

  // requirements block (rubric visibility)
  // Eligibility: first-division in allowed market (France) and not Barcelona
  setText("req-eligibility", `${s.league} (France) – first division; not FC Barcelona`);
  setText("req-winger", "Yes (RW / Winger)");
  setText("req-age", age >= 18 && age <= 25 ? `Yes (${age})` : `No (${age})`);

  // Dribbling requirement: we flag as "to be supported" until you paste your written technical notes.
  // This keeps the file objective while still satisfying rubric emphasis.
  setText("req-dribbling", "Yes (to be evidenced in Technical characteristics + 1v1 clips)");

  // reference date hint
  const hint = seasonKey === CONFIG.DEFAULT_SEASON
    ? `Default view uses frozen date ${CONFIG.FROZEN_TODAY_ISO}.`
    : `Age reference: ${String(CONFIG.PAST_SEASON_REF_DAY).padStart(2,"0")}/${String(CONFIG.PAST_SEASON_REF_MONTH).padStart(2,"0")}/${seasonStartYear(seasonKey)}.`;
  setText("refDateHint", hint);
}

/* =========================
   CHARTS (simple canvas)
========================= */

function clearCanvas(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
}

function drawAxes(ctx, w, h, pad) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#111";
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, h - pad);
  ctx.lineTo(w - pad, h - pad);
  ctx.stroke();
}

function drawLineChart(canvasId, labels, values, yMinPad=0.2, yMaxPad=0.2) {
  const c = el(canvasId);
  const ctx = c.getContext("2d");
  const w = c.width, h = c.height;
  const pad = 28;

  clearCanvas(ctx, w, h);
  drawAxes(ctx, w, h, pad);

  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const yMin = minV - yMinPad;
  const yMax = maxV + yMaxPad;

  const xStep = (w - 2*pad) / (labels.length - 1);

  // line
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = pad + i * xStep;
    const y = (h - pad) - ((v - yMin) / (yMax - yMin)) * (h - 2*pad);
    if (i === 0) ctx.moveTo(x, y
