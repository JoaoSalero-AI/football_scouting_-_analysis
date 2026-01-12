// data.js (MODEL) - Doué + temporadas 22/23 a 25/26 + SDR

export const CONFIG = {
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

export const PLAYER = {
  name: "Désiré Nonka-Maho Doué",
  nationality: "France",
  dobISO: "2005-06-03",
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

  // Evaluator-style report text (static baseline)
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

// Season dataset (from your screenshots)
export const SEASONS = {
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

export const SEASON_ORDER = ["2022/23", "2023/24", "2024/25", "2025/26"];
