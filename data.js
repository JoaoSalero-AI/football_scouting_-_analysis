// data.js (MODEL)

export const CONFIG = {
  DEFAULT_SEASON: "2025/26",
  // Freeze "today" for reproducibility 
  FROZEN_TODAY_ISO: "2026-01-12",
  // For past seasons: age reference = Aug 1 of starting year
  PAST_SEASON_REF_MONTH: 8, // August
  PAST_SEASON_REF_DAY: 1
};

export const PLAYER = {
  name: "Désiré Nonka-Maho Doué",
  nationality: "France",
  dobISO: "2005-06-03",
  heightCm: 181,
  weightKg: null,                 // meed fill
  preferredFoot: "Right",
  shirtNumber: 14,
  primaryPosition: "RW (Winger)",
  profile: "Right-footed winger; RW preferred; high technical ceiling.",
  marketValue: "€93M",
  nationalTeam: "France (debut 23 Mar 2025) – 4 caps, 0 goals",
  transfers: [
    "Paris Saint-Germain – 17 Aug 2024 – €50M",
    "Stade Rennais – 1 Jul 2022 (from U19)"
  ],
  strengths: ["Long passes", "Passing", "Positioning"],
  weaknesses: ["No significant weaknesses reported"],
  // default dot position for RW on our pitch (percentage)
  pitchDot: { leftPct: 78, topPct: 35 }
};

// Season dataset extracted from your screenshots.
// Keep all values as numbers where possible; strings where needed.
export const SEASONS = {
  "2022/23": {
    club: "Stade Rennais",
    league: "Ligue 1",
    general: { mp: 26, min: 1125, gls: 3, ast: 1, rating: 6.81 },
    finishing: { shots: 21, sot: 6, bcm: 0 },
    creativity: { keyp: 15, bcc: 1, sdr: 48 },
    passes: { aps: 342, apsPct: 81.2, alb: 23, lbaPct: 82.1 },
    defense: { tack: 37, inter: 13, yc: 5 },
    additional: { xg: 1.56, xa: 1.33, gi: 4, xgi: 2.89 }
  },
  "2023/24": {
    club: "Stade Rennais",
    league: "Ligue 1",
    general: { mp: 31, min: 1632, gls: 4, ast: 4, rating: 7.11 },
    finishing: { shots: 34, sot: 13, bcm: 2 },
    creativity: { keyp: 31, bcc: 5, sdr: 64 },
    passes: { aps: 554, apsPct: 79.0, alb: 36, lbaPct: 81.8 },
    defense: { tack: 32, inter: 14, yc: 3 },
    additional: { xg: 2.38, xa: 3.72, gi: 8, xgi: 6.09 }
  },
  "2024/25": {
    club: "Paris Saint-Germain",
    league: "Ligue 1",
    general: { mp: 31, min: 1734, gls: 6, ast: 6, rating: 7.32 },
    finishing: { shots: 55, sot: 20, bcm: 7 },
    creativity: { keyp: 55, bcc: 16, sdr: 57 },
    passes: { aps: 887, apsPct: 86.1, alb: 24, lbaPct: 54.5 },
    defense: { tack: 48, inter: 13, yc: 1 },
    additional: { xg: 5.14, xa: 5.67, gi: 12, xgi: 10.82 }
  },
  "2025/26": {
    club: "Paris Saint-Germain",
    league: "Ligue 1",
    general: { mp: 8, min: 428, gls: 3, ast: 1, rating: 7.14 },
    finishing: { shots: 15, sot: 6, bcm: 1 },
    creativity: { keyp: 13, bcc: 1, sdr: 8 },
    passes: { aps: 228, apsPct: 85.4, alb: 6, lbaPct: 46.2 },
    defense: { tack: 15, inter: 3, yc: 0 },
    additional: { xg: 2.23, xa: 0.97, gi: 4, xgi: 3.20 }
  }
};

// Utility: season list in chronological order
export const SEASON_ORDER = ["2022/23", "2023/24", "2024/25", "2025/26"];
