# PRD: 2026 MRD World Cup Tournament Tracker

## 1. Overview

A single-page web app for tracking the 2026 MRD (Men's Roller Derby) World Cup. Users enter game scores live; the app computes group standings, overall seedings, and bracket progression through to the final.

---

## 2. Teams & Groups

### REQ-2.1: 24 Teams

| Code | Full Name | Group |
|------|-----------|-------|
| SPA | Spain | 1 |
| MEX | Mexico | 1 |
| API | API Fury | 1 |
| SCO | Scotland | 1 |
| FRA | France | 2 |
| JPN | Japan | 2 |
| CHI | Chile | 2 |
| WLS | Wales | 2 |
| COL | Colombia | 3 |
| IRE | Ireland | 3 |
| ARG | Argentina | 3 |
| ITA | Italy | 3 |
| HI | Hawaii | 4 |
| AUS | Australia | 4 |
| GER | Germany | 4 |
| ENG | England | 4 |
| KU | K.Union | 5 |
| NL | Netherlands | 5 |
| CAN | Canada | 5 |
| SC | S.Campaign | 5 |
| NZ | New Zealand | 6 |
| USA | USA | 6 |
| CAT | Catalan | 6 |
| BEL | Belgium | 6 |

### REQ-2.2: 6 Groups of 4

Each group has teams seeded A/B/C/D:

| Group | Seed A | Seed B | Seed C | Seed D |
|-------|--------|--------|--------|--------|
| 1 | SPA | MEX | API | SCO |
| 2 | FRA | JPN | CHI | WLS |
| 3 | COL | IRE | ARG | ITA |
| 4 | HI | AUS | GER | ENG |
| 5 | KU | NL | CAN | SC |
| 6 | NZ | USA | CAT | BEL |

---

## 3. Group Stage Schedule (Games 1-36)

### REQ-3.1: Round-Robin Format

Each group plays 6 games (every team plays 3): AvB, CvD, AvC, BvD, AvD, BvC.

### REQ-3.2: Game Format

- 30-minute games: 2 × 15-minute halves with 5-minute bench-switch break
- Hard clock (no stoppages except injury)
- 5 penalties, 1 TTO, 1 OR (neither in final 5 minutes)
- Buffer time between games for injury/delays

### REQ-3.3: Schedule — Thursday (Games 1-24, two venues)

| Game | Time | Venue | Home | Away | Group | Round |
|------|------|-------|------|------|-------|-------|
| 1 | 09:00 | Palais | FRA | JPN | 2 | AvB |
| 2 | 09:00 | CR/Argo | SPA | MEX | 1 | AvB |
| 3 | 10:05 | Palais | HI | AUS | 4 | AvB |
| 4 | 10:05 | CR/Argo | COL | IRE | 3 | AvB |
| 5 | 11:10 | Palais | USA | NZ | 6 | AvB |
| 6 | 11:10 | CR/Argo | KU | NL | 5 | AvB |
| 7 | 12:15 | Palais | CHI | WLS | 2 | CvD |
| 8 | 12:15 | CR/Argo | API | SCO | 1 | CvD |
| 9 | 13:20 | Palais | GER | ENG | 4 | CvD |
| 10 | 13:20 | CR/Argo | ARG | ITA | 3 | CvD |
| 11 | 14:25 | Palais | CAT | BEL | 6 | CvD |
| 12 | 14:25 | CR/Argo | CAN | SC | 5 | CvD |
| 13 | 15:30 | Palais | FRA | CHI | 2 | AvC |
| 14 | 15:30 | CR/Argo | SPA | API | 1 | AvC |
| 15 | 16:35 | Palais | HI | GER | 4 | AvC |
| 16 | 16:35 | CR/Argo | COL | ARG | 3 | AvC |
| 17 | 17:40 | Palais | NZ | CAT | 6 | AvC |
| 18 | 17:40 | CR/Argo | KU | CAN | 5 | AvC |
| 19 | 18:45 | Palais | MEX | SCO | 1 | BvD |
| 20 | 18:45 | CR/Argo | JPN | WLS | 2 | BvD |
| 21 | 19:50 | Palais | IRE | ITA | 3 | BvD |
| 22 | 19:50 | CR/Argo | AUS | ENG | 4 | BvD |
| 23 | 20:55 | Palais | NL | SC | 5 | BvD |
| 24 | 20:55 | CR/Argo | USA | BEL | 6 | BvD |

### REQ-3.4: Schedule — Friday (Games 25-36, two venues)

| Game | Time | Venue | Home | Away | Group | Round |
|------|------|-------|------|------|-------|-------|
| 25 | 09:00 | Palais | SPA | SCO | 1 | AvD |
| 26 | 09:00 | CR/Argo | FRA | WLS | 2 | AvD |
| 27 | 10:05 | Palais | COL | ITA | 3 | AvD |
| 28 | 10:05 | CR/Argo | HI | ENG | 4 | AvD |
| 29 | 11:10 | Palais | KU | SC | 5 | AvD |
| 30 | 11:10 | CR/Argo | NZ | BEL | 6 | AvD |
| 31 | 12:15 | Palais | JPN | CHI | 2 | BvC |
| 32 | 12:15 | CR/Argo | MEX | API | 1 | BvC |
| 33 | 13:20 | Palais | AUS | GER | 4 | BvC |
| 34 | 13:20 | CR/Argo | IRE | ARG | 3 | BvC |
| 35 | 14:25 | Palais | USA | CAT | 6 | BvC |
| 36 | 14:25 | CR/Argo | NL | CAN | 5 | BvC |

---

## 4. Group Standings & Ranking

### REQ-4.1: Group Standings Calculation

For each group, rank teams by:
1. **Wins** (descending)
2. **Adjusted point differential** (descending) — see REQ-4.2

### REQ-4.2: "Drop Worst Loss" Adjustment

> "The biggest loss will be removed from the point differential calculation so teams are not disadvantaged by the groupings."

- For each team, compute per-game differentials
- If the team has more than 1 game played AND their worst differential is negative, remove that single worst game from the differential sum
- This produces the "adjusted differential" used for ranking

### REQ-4.3: Overall Rankings (G1-G24)

After all 36 group games are complete, rank all 24 teams into tiers:
1. All 6 group winners (1st-place finishers), ranked among themselves by wins then adjusted diff
2. All 6 runners-up (2nd-place finishers), ranked among themselves
3. All 6 third-place finishers, ranked among themselves
4. All 6 fourth-place finishers, ranked among themselves

This produces ranks G1 through G24.

---

## 5. Bracket Stage (Games 37-54)

### REQ-5.1: Quarterfinals (Friday, Games 37-40)

Top 8 overall seeds play quarterfinals:

| Game | Label | Home Seed | Away Seed | Time | Venue |
|------|-------|-----------|-----------|------|-------|
| 37 | QF4 | G4 | G5 | 16:00 | Palais |
| 38 | QF2 | G3 | G6 | 16:00 | CR/Argo |
| 39 | QF3 | G2 | G7 | 18:00 | Palais |
| 40 | QF1 | G1 | G8 | 18:00 | CR/Argo |

### REQ-5.2: Rankings Games — Seeds 9-20 (Games 41-43, 46, 49-50)

Teams ranked 9-20 play ranking games for final placement:

| Game | Label | Home Seed | Away Seed | Day | Time | Venue |
|------|-------|-----------|-----------|-----|------|-------|
| 41 | R-17/18 | G17 | G18 | FRI | 20:00 | Palais |
| 42 | R-19/20 | G19 | G20 | FRI | 20:00 | CR/Argo |
| 43 | R-13/14 | G13 | G14 | SAT | 09:00 | Palais |
| 46 | R-15/16 | G15 | G16 | SAT | 15:00 | Palais |
| 49 | R-11/12 | G11 | G12 | SAT | 21:00 | Palais |
| 50 | R-9/10 | G9 | G10 | SUN | 09:00 | Palais |

### REQ-5.3: Seeds 21-24

Teams ranked G21-G24 are eliminated after group stage with no further games. Their final placement matches their overall seed (21st-24th).

### REQ-5.4: Tertiary Elimination — QF Losers (Games 44-45)

QF losers play TE rounds for 5th-8th placement:

| Game | Label | Home Seed | Away Seed | Day | Time |
|------|-------|-----------|-----------|-----|------|
| 44 | TE1 | LQ1 (Loser QF1) | LQ2 (Loser QF2) | SAT | 11:00 |
| 45 | TE2 | LQ3 (Loser QF3) | LQ4 (Loser QF4) | SAT | 13:00 |

### REQ-5.5: Semifinals (Games 47-48)

| Game | Label | Home Seed | Away Seed | Day | Time |
|------|-------|-----------|-----------|-----|------|
| 47 | SF1 | WQ1 (Winner QF1) | WQ2 (Winner QF2) | SAT | 17:00 |
| 48 | SF2 | WQ3 (Winner QF3) | WQ4 (Winner QF4) | SAT | 19:00 |

### REQ-5.6: Sunday Finals (Games 51-54)

| Game | Label | Home Seed | Away Seed | Time |
|------|-------|-----------|-----------|------|
| 51 | 7th/8th | LTE1 (Loser TE1) | LTE2 (Loser TE2) | 11:00 |
| 52 | 5th/6th | WTE1 (Winner TE1) | WTE2 (Winner TE2) | 13:00 |
| 53 | 3rd/4th | LS1 (Loser SF1) | LS2 (Loser SF2) | 17:00 |
| 54 | FINAL | WS1 (Winner SF1) | WS2 (Winner SF2) | 19:00 |

---

## 6. Seed Resolution Map

The bracket flows as follows:

```
Group Stage (G1-G24)
  │
  ├─ G1-G8 → Quarterfinals
  │    QF1: G1 vs G8  (Game 40)
  │    QF2: G3 vs G6  (Game 38)
  │    QF3: G2 vs G7  (Game 39)
  │    QF4: G4 vs G5  (Game 37)
  │
  ├─ QF Winners → Semifinals
  │    SF1: WQ1 vs WQ2  (Game 47)
  │    SF2: WQ3 vs WQ4  (Game 48)
  │
  ├─ QF Losers → Tertiary Elimination
  │    TE1: LQ1 vs LQ2  (Game 44)
  │    TE2: LQ3 vs LQ4  (Game 45)
  │
  ├─ SF Winners → Final (Game 54)
  ├─ SF Losers → 3rd/4th (Game 53)
  ├─ TE Winners → 5th/6th (Game 52)
  ├─ TE Losers → 7th/8th (Game 51)
  │
  ├─ G9-G20 → Ranking games (Games 41-43, 46, 49-50)
  └─ G21-G24 → Eliminated (no games)
```

---

## 7. App Functionality

### REQ-7.1: Score Entry

- Users enter integer scores for each game (home and away)
- Scores persisted to `localStorage` so they survive page refresh
- Score inputs should be numeric only

### REQ-7.2: Standings Display

- Show group standings per group with: W, L, PF, PA, raw diff, adjusted diff, dropped game indicator
- Highlight group winners

### REQ-7.3: Bracket Display

- Show bracket games with resolved team names (from seeds)
- Show "TBD" for unresolved seeds
- Bracket should update reactively as scores are entered

### REQ-7.4: Reset

- Users can reset all scores (with confirmation)

### REQ-7.5: Tabs/Navigation

- Groups, Schedule, Rankings, Bracket views

### REQ-7.6: Draw/Tie Handling

- The spreadsheet does not specify tie-breaking rules for draws within a game
- The code treats a tied game score (equal points) as no winner — neither team gets a win or loss

---

## 8. Sense Check: Excel vs Code

### 8.1: Teams & Groups — PASS

All 24 teams match between Excel and code. All 6 group compositions match exactly.

### 8.2: Group Game Schedule (Games 1-36) — PASS

All 36 games verified: matchups, times, venues, days, and round labels match the Excel "Outline" and "Full Timings" sheets exactly.

### 8.3: Round-Robin Completeness — PASS

Each group has exactly 6 games covering all 6 pairings (AvB, CvD, AvC, BvD, AvD, BvC). Each team plays exactly 3 games. Verified for all 6 groups.

### 8.4: Quarterfinal Seeding — PASS

Excel shows:
- Q1: G1 vs G8 → Code: Game 40, homeSeed "G1", awaySeed "G8" ✓
- Q2: G3 vs G6 → Code: Game 38, homeSeed "G3", awaySeed "G6" ✓
- Q3: G2 vs G7 → Code: Game 39, homeSeed "G2", awaySeed "G7" ✓
- Q4: G4 vs G5 → Code: Game 37, homeSeed "G4", awaySeed "G5" ✓

### 8.5: Quarterfinal Schedule — PASS

Excel: Game 37 at 16:00 Palais, Game 38 at 16:00 CR/Argo, Game 39 at 18:00 Palais, Game 40 at 18:00 CR/Argo. All match code.

### 8.6: TE (Tertiary Elimination) Seeding — ISSUE FOUND

Excel shows:
- TE1: LQ1 vs LQ2 (Game 44)
- TE2: LQ3 vs LQ4 (Game 45)

The question is which QF maps to which loser seed. The code maps:
- LQ1 = Loser of Game 40 (QF1: G1 vs G8) ✓
- LQ2 = Loser of Game 39 (QF3: G2 vs G7) ✓
- LQ3 = Loser of Game 37 (QF4: G4 vs G5) ✓
- LQ4 = Loser of Game 38 (QF2: G3 vs G6) ✓

The Excel labels TE1 as "LQ1 vs LQ2" and TE2 as "LQ3 vs LQ4". The numbering LQ1-LQ4 should correspond to QF1-QF4 losers respectively.

Code maps LQ1→QF1(Game 40), LQ2→QF2(Game 39). But QF2 in the bracket template is Game 38 (label "QF2"), while Game 39 is labeled "QF3". **So LQ2 should be the loser of QF2 (Game 38), not QF3 (Game 39).**

**BUG: LQ2/LQ4 mapping is swapped with LQ3/LQ4 in the code's `resolveBracketTeam()` function.**

Code currently has:
- LQ1 → Game 40 (QF1) ✓
- LQ2 → Game 39 (QF3) — should be Game 38 (QF2) ✗
- LQ3 → Game 37 (QF4) — should be Game 39 (QF3) ✗
- LQ4 → Game 38 (QF2) — should be Game 37 (QF4) ✗

### 8.7: Semifinal Seeding — SAME ISSUE

SF1: WQ1 vs WQ2 (Game 47) and SF2: WQ3 vs WQ4 (Game 48).

Code maps:
- WQ1 → Game 40 (QF1) ✓
- WQ2 → Game 39 (QF3) — should be Game 38 (QF2) ✗
- WQ3 → Game 37 (QF4) — should be Game 39 (QF3) ✗
- WQ4 → Game 38 (QF2) — should be Game 37 (QF4) ✗

This means SF1 pits the QF1 winner against the QF3 winner instead of QF2 winner, and SF2 pits the QF4 winner against the QF2 winner instead of QF3 vs QF4.

### 8.8: Rankings Games — PASS

All 6 ranking games (R-9/10 through R-19/20) match Excel for seeds, days, times, and venues.

### 8.9: Sunday Finals — PASS

Games 51-54 (7th/8th, 5th/6th, 3rd/4th, Final) all match Excel for seeds, day, times.

### 8.10: Seeds 21-24 — PASS

Excel shows ranks 21-24 as "Eliminated" with no further games. Code does not define games for them. Consistent.

### 8.11: "Drop Worst Loss" Rule — PASS (with caveat)

Excel states: "The biggest loss will be removed from the point differential calculation so teams are not disadvantaged by the groupings." Code implements this in `computeGroupStandings()`. The caveat: the rule says "biggest loss" — the code drops the most negative single-game differential, which correctly implements this. However, it only drops when the team has >1 game played (correct — you shouldn't drop your only game).

### 8.12: Tie Within a Game — AMBIGUOUS

The Excel does not address what happens when a game ends in a tie (equal score). The code treats ties as neither team winning. This may need clarification — roller derby typically doesn't end in ties, but the code should handle it if it occurs.

---

## 9. Summary of Discrepancies

| ID | Severity | Description |
|----|----------|-------------|
| BUG-1 | **HIGH** | QF winner/loser seed mapping (WQ2/LQ2 → QF3 instead of QF2, WQ3/LQ3 → QF4 instead of QF3, WQ4/LQ4 → QF2 instead of QF4). This means TE and SF matchups have incorrect pairings. |
| NOTE-1 | Low | Tie-game handling not specified in Excel. Code treats as 0-win draw. |
| NOTE-2 | Low | Tertiary tiebreaker for overall rankings (beyond wins + adj diff) not specified. |
