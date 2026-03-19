---
sidebar_position: 4
---

# App Usage

## Score Entry

Enter integer scores into the Home and Away score fields for any game. Scores are validated on blur (when you leave the field):

- **Draws are not allowed** — if the home and away scores are equal, an alert is shown and the scores are reset to blank
- Scores must be non-negative integers

### Persistence

All entered scores are saved to `localStorage` automatically. They survive page refresh and browser restarts. Scores are stored under the key `mrda2026scores`.

---

## Tabs / Navigation

The app has four main views selectable via the top tab bar:

| Tab | What it shows |
|-----|---------------|
| **Groups** | Round-robin standings for all 6 groups, updated live as scores are entered |
| **Schedule** | Full game schedule (all 54 games) with current scores and status |
| **Rankings** | Overall G1–G24 seedings computed from completed group games |
| **Bracket** | Knockout bracket from QFs through to the Final, with auto-resolved team names |

---

## Groups Tab

Each group shows a standings table with:

- **W / L** — wins and losses
- **PF / PA** — points for and points against
- **Diff** — raw point differential
- **Adj Diff** — adjusted differential (worst loss dropped)
- **Drop** — indicator showing which game was dropped from the calculation

Group winners are highlighted. Standings update in real time as you type scores.

---

## Bracket Tab

The bracket displays all 18 knockout games. Team names are resolved automatically from seeds as scores are entered:

- **TBD** is shown wherever a prerequisite game has not yet been scored
- Results propagate immediately — entering a QF score will update the corresponding SF slot

---

## Export / Import Scores

Use the **Export** button to download the current state of all scores as a JSON file. Share this file with others or save it as a backup.

Use the **Import** button to load a previously exported JSON file, replacing all current scores.

This lets multiple people maintain separate score states and share them.

---

## Reset All Scores

The **Reset** button clears every score from the app and from `localStorage`. A confirmation dialog is shown before any data is deleted.
