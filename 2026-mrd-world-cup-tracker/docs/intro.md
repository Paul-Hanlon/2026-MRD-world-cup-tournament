---
sidebar_position: 1
---

# Introduction

The **2026 MRD World Cup Tracker** is a single-page web app for following the 2026 MRD (Men's Roller Derby) World Cup in real time.

Users enter game scores as they happen; the app instantly computes group standings, overall seedings (G1–G24), and bracket progression through to the final.

**[Open the live app](https://2026-mrd-world-cup-tournament.vercel.app)**

---

## Features

- **Score entry** — enter integer scores for any of the 54 games; updates propagate immediately
- **Group standings** — win/loss records and adjusted point differentials for all 6 groups
- **Overall rankings** — cross-group tier ranking producing seeds G1–G24
- **Bracket view** — auto-resolved knockout bracket from QFs through to the Final
- **Schedule** — full game schedule across both days and both venues
- **Export / Import** — share or save a snapshot of all entered scores as JSON
- **Persistence** — scores are saved to `localStorage` and survive page refresh

---

## Tournament at a glance

| Detail | Value |
|--------|-------|
| Teams | 24 (6 groups of 4) |
| Group games | 36 (round-robin, Thu–Fri) |
| Bracket games | 18 (QF through Final, Fri–Sun) |
| Total games | 54 |
| Venues | Palais & CR/Argo |

See [Tournament Format](./tournament-format) for the full schedule and bracket structure.
