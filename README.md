# 2026 MRDA World Cup Tournament Tracker

A single-page app for tracking the 2026 [MRDA](https://mrda.org) (Men's Roller Derby Association) World Cup tournament. Enter game scores and the app computes group standings, overall rankings, and bracket progression through to the final.

**Live app:** deployed on Vercel

**Docs:** https://paul-hanlon.github.io/2026-MRDA-world-cup-tournament-/

## Features

- Enter scores for all 54 games (36 group stage + 18 knockout)
- Live group standings with the Drop Worst Loss tiebreaker rule
- Overall rankings (G1–G24) seeding the bracket automatically
- Bracket view updates as scores are entered
- Export/import scores as JSON to save or share progress
- Scores persisted to `localStorage`

## Tournament Format

- 24 teams across 6 groups of 4 (round-robin)
- Top 8 overall advance to quarterfinals
- QF losers enter tertiary elimination rounds for 5th–8th place
- SF → 3rd/4th place game and Final

## Stack

- React 19 + Vite
- All app logic and UI in a single file (`tournament.jsx`)
- Vercel Analytics

## Development

```bash
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # preview production build
```

## Docs Site

The documentation lives in `2026-mrd-world-cup-tracker/` (Docusaurus).

```bash
cd 2026-mrd-world-cup-tracker
npm start         # local dev server
npm run build     # production build
```

Docs are deployed to GitHub Pages on every push to `main`.
