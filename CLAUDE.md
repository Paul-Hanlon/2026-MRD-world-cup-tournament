# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page React app for tracking the 2026 MRDA (Men's Roller Derby Association) World Cup tournament. Users enter game scores and the app computes group standings, overall rankings, and bracket progression through to the final. Deployed on Vercel.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally

No test framework or linter is configured.

## Architecture

This is a minimal Vite + React 19 project with almost all logic in a single file:

- **`tournament.jsx`** — the entire app: data constants, ranking logic, bracket resolution, and all UI components exported as `TournamentTracker`. Contains ~1200 lines of JSX with inline styles (no CSS files).
- **`src/main.jsx`** — entry point; renders `TournamentTracker` and injects Vercel Analytics.
- **`index.html`** — shell HTML that loads `src/main.jsx`.

### Key data flow

1. **Constants at top of `tournament.jsx`**: `TEAMS`, `TEAM_COLORS`, `GROUPS` (6 groups of 4), `GROUP_GAMES` (36 round-robin games, ids 1-36), `BRACKET_TEMPLATE` (18 knockout games, ids 37-54).
2. **Scores state**: a flat object `{ [gameId]: { home: string, away: string } }` for all 54 games. Persisted to `localStorage`.
3. **Group standings**: `computeGroupStandings()` calculates W/L, point differential with "drop worst loss" adjustment, then sorts by wins then adjusted diff.
4. **Overall rankings**: `computeOverallRankings()` ranks all 24 teams across 6 groups into tiers (1st-place teams, then 2nd, etc.), producing ranks G1-G24.
5. **Bracket resolution**: `resolveBracketTeam()` recursively resolves seed strings (e.g., `"G1"`, `"WQ1"`, `"LS2"`) to actual team codes based on entered scores. Seeds flow: group ranks → QFs → TEs → SFs → Final.

### Tournament structure

- 24 teams in 6 groups of 4 (round-robin, 6 games per group)
- Top 8 overall → quarterfinals; remaining teams play ranking games
- QF losers → TE (tertiary elimination) rounds for 5th-8th
- SF → 3rd/4th and Final
- Games span Thursday through Sunday across two venues (Palais, CR/Argo)

### Notes

- `tournament-1.jsx` is an earlier snapshot/backup of `tournament.jsx` (untracked).
- All styling is inline — there are no CSS files. The app uses a dark theme with team-specific accent colors from `TEAM_COLORS`.
- Vercel Analytics is integrated via `@vercel/analytics` with custom event tracking (`track()` calls).

## Documentation

The project docs live in `2026-mrd-world-cup-tracker/` — a Docusaurus site deployed to GitHub Pages on every push to `main`.

### Commands (run from `2026-mrd-world-cup-tracker/`)

- `npm start` — local dev server (hot reload)
- `npm run build` — production build to `2026-mrd-world-cup-tracker/build/`
- `npm run serve` — preview the production build locally

### Deployed URL

`https://paul-hanlon.github.io/2026-MRDA-world-cup-tournament-/`

### Doc pages

| File | Content |
|------|---------|
| `docs/intro.md` | App overview and feature summary |
| `docs/tournament-format.md` | Teams, groups, full schedule tables, bracket structure |
| `docs/ranking-algorithm.md` | Group standings, Drop Worst Loss rule, G1–G24 seedings, seed resolution |
| `docs/app-usage.md` | Score entry, tabs, export/import, reset |

### Hook reminder

A Claude Code hook in `.claude/settings.json` outputs a **DOCS REMINDER** message whenever `tournament.jsx` is edited. When you see this reminder, review the doc pages above and update any that describe changed behaviour.
