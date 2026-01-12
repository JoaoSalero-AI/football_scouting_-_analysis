# football_scouting_analysis

# Scouting Technical File — Désiré Doué (RW) — Season Selector (MVC)

This repository hosts a web-based **Technical File** created using the Activity 1 template concept, submitted for:

**Module 5: Reporting**  
**Professional Diploma in Football Scouting and Analysis — Barça Innovation Hub**

The page is deployed via **GitHub Pages** and uses a **single Season selector** (22/23 to 25/26) that updates all season-dependent data, including age calculation rules.

---

## What this project is

- A structured **Technical File** for **Désiré Doué** (RW / Winger), aligned with the course template.
- Objective season-by-season data (matches, minutes, goals, assists, rating, xG/xA, etc.).
- A specific emphasis on **Outstanding dribbling ability** using **SDR% (Successful Dribble Rate)** plus volume indicators.

---

## How to use (for reviewers)

1. Open the GitHub Pages link for this repository.
2. Select the season in the left panel:
   - 2022/23
   - 2023/24
   - 2024/25
   - 2025/26 (default)
3. The page updates:
   - Identity block (club/league per season)
   - KPIs (including **SDR%** and successful dribbles per match)
   - Season tables (finishing / creativity / passing / defending / additional)
   - Charts (SDR% trend and GI trend)

---

## Age calculation rules (reproducibility)

To ensure consistent review output:

- Default season (2025/26) uses a **frozen date**: `2026-01-12`.
- Past seasons use a reference of **01 August** of the season start year (e.g., 2022/23 → 01 Aug 2022).

These rules can be edited in `data.js` under `CONFIG`.

---

## SDR evaluation context (why it matters)

**SDR% (Successful Dribble Rate)** measures 1v1 dribble efficiency:  
successful dribbles / attempted dribbles.

The report includes benchmark bands (heuristic scouting context) to interpret whether a winger’s SDR% is:
- around league average,
- good,
- a differentiator,
- or elite.

---

## Project structure (MVC light)

- `data.js` — **Model** (player identity, seasons, report text)
- `app.js` — **Controller + View** (rendering, events, charts)
- `index.html` — View layout (static structure)
- `styles.css` — Barça-inspired theme (clean/elegant)
- `README.md` — documentation

---

## Data sources (references)

Publicly available sources used for compiling player identity and statistics:
- **Sofascore** (ratings, season stats, xG/xA, etc.)
- **LinkedIn** (public profile references where applicable)
- **French Football Federation (FFF)** (national team information)
- **Paris Saint-Germain official website** (club information)

If required by the assessor, explicit URLs can be added under this section.

---

## Author

**Project developed by João Andrade — 2026**

