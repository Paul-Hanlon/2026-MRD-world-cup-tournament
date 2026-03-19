---
sidebar_position: 3
---

# Ranking Algorithm

## Group Standings

Within each group, teams are ranked by:

1. **Wins** (descending)
2. **Adjusted point differential** (descending) — see below

### "Drop Worst Loss" Adjustment

> "The biggest loss will be removed from the point differential calculation so teams are not disadvantaged by the groupings."

The algorithm:

1. For each team, compute the point differential for every game played (score for − score against)
2. If the team has played **more than 1 game** AND their worst differential is **negative**, remove that single game from the sum
3. The remaining sum is the **adjusted differential** used for ranking

This means a team can never be unfairly penalised by one very lopsided loss. The rule only kicks in when there is more than one game played (you can't drop your only game).

**Example**: A team scores +15, −40, +5 across three games.
- Raw differential: −20
- Drop worst (−40): adjusted differential = +20

---

## Overall Rankings (G1–G24)

After all 36 group games, all 24 teams are ranked into four tiers across groups:

| Tier | Teams | Ranked by |
|------|-------|-----------|
| 1st | 6 group winners | Wins, then adjusted diff |
| 2nd | 6 runners-up | Wins, then adjusted diff |
| 3rd | 6 third-place finishers | Wins, then adjusted diff |
| 4th | 6 fourth-place finishers | Wins, then adjusted diff |

Within each tier the teams are sorted by wins (descending) then adjusted differential (descending), producing a contiguous block of seeds:

- Tier 1 → **G1–G6**
- Tier 2 → **G7–G12**
  *(actually G7–G12 based on all runners-up combined)*
- ...continuing through to **G24**

The exact position within each tier is determined by comparing wins and adjusted diff across all six groups.

:::note
The tournament spec does not define a tertiary tiebreaker beyond wins + adjusted differential. If two teams are exactly tied on both, their relative seeding is undefined. In practice this is unlikely to occur.
:::

---

## Bracket Seed Resolution

The `resolveBracketTeam()` function in `tournament.jsx` recursively resolves seed strings to actual team codes:

| Seed | Resolves to |
|------|-------------|
| `G1`–`G24` | Overall ranking position |
| `WQ1` | Winner of QF1 (Game 40: G1 vs G8) |
| `WQ2` | Winner of QF2 (Game 38: G3 vs G6) |
| `WQ3` | Winner of QF3 (Game 39: G2 vs G7) |
| `WQ4` | Winner of QF4 (Game 37: G4 vs G5) |
| `LQ1` | Loser of QF1 |
| `LQ2` | Loser of QF2 |
| `LQ3` | Loser of QF3 |
| `LQ4` | Loser of QF4 |
| `WS1` | Winner of SF1 (Game 47) |
| `WS2` | Winner of SF2 (Game 48) |
| `LS1` | Loser of SF1 |
| `LS2` | Loser of SF2 |
| `WTE1` | Winner of TE1 (Game 44) |
| `WTE2` | Winner of TE2 (Game 45) |
| `LTE1` | Loser of TE1 |
| `LTE2` | Loser of TE2 |

If the prerequisite game has no score entered, the seed resolves to `"TBD"`.
