import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { track } from "@vercel/analytics";

const TEAMS = {
  FRA: "France", JPN: "Japan", SPA: "Spain", MEX: "Mexico",
  HI: "Hawaii", AUS: "Australia", COL: "Colombia", IRL: "Ireland",
  USA: "USA", NZ: "New Zealand", KU: "K.Union", NLD: "Netherlands",
  CHI: "Chile", WLS: "Wales", API: "API Fury", SCO: "Scotland",
  GER: "Germany", ENG: "England", ARG: "Argentina", ITA: "Italy",
  PDC: "P.Catalan", BEL: "Belgium", CAN: "Canada", SC: "S.Campaign"
};

const TEAM_COLORS = {
  FRA: "#002395", JPN: "#BC002D", SPA: "#AA151B", MEX: "#006341",
  HI: "#CE1126", AUS: "#FFCD00", COL: "#FCD116", IRL: "#169B62",
  USA: "#3C3B6E", NZ: "#1a1a1a", KU: "#D4213D", NLD: "#FF6600",
  CHI: "#D52B1E", WLS: "#D4213D", API: "#4B0082", SCO: "#005EB8",
  GER: "#DD0000", ENG: "#CF081F", ARG: "#75AADB", ITA: "#008C45",
  PDC: "#FCDD09", BEL: "#ED2939", CAN: "#FF0000", SC: "#C8102E"
};

const GROUPS = {
  1: { name: "Group 1", teams: ["MEX", "IRL", "SC", "NLD"], label: "A/B/C/D" },
  2: { name: "Group 2", teams: ["NZ", "FRA", "HI", "WLS"], label: "A/B/C/D" },
  3: { name: "Group 3", teams: ["GER", "PDC", "AUS", "ARG"], label: "A/B/C/D" },
  4: { name: "Group 4", teams: ["SCO", "COL", "SPA", "USA"], label: "A/B/C/D" },
  5: { name: "Group 5", teams: ["ITA", "KU", "JPN", "CAN"], label: "A/B/C/D" },
  6: { name: "Group 6", teams: ["BEL", "API", "ENG", "CHI"], label: "A/B/C/D" }
};

const GROUP_GAMES = [
  // Thursday - Round 1 (AvB)
  { id: 1, home: "MEX", away: "IRL", group: 1, day: "THU", time: "09:00", venue: "Palais", round: "AvB" },
  { id: 2, home: "NZ", away: "FRA", group: 2, day: "THU", time: "09:00", venue: "CR/Argo", round: "AvB" },
  { id: 3, home: "GER", away: "PDC", group: 3, day: "THU", time: "10:00", venue: "Palais", round: "AvB" },
  { id: 4, home: "SCO", away: "COL", group: 4, day: "THU", time: "10:00", venue: "CR/Argo", round: "AvB" },
  { id: 5, home: "ITA", away: "KU", group: 5, day: "THU", time: "11:00", venue: "Palais", round: "AvB" },
  { id: 6, home: "BEL", away: "API", group: 6, day: "THU", time: "11:00", venue: "CR/Argo", round: "AvB" },
  // Round 1 (CvD)
  { id: 7, home: "SC", away: "NLD", group: 1, day: "THU", time: "12:00", venue: "Palais", round: "CvD" },
  { id: 8, home: "HI", away: "WLS", group: 2, day: "THU", time: "12:00", venue: "CR/Argo", round: "CvD" },
  { id: 9, home: "AUS", away: "ARG", group: 3, day: "THU", time: "13:00", venue: "Palais", round: "CvD" },
  { id: 10, home: "SPA", away: "USA", group: 4, day: "THU", time: "13:00", venue: "CR/Argo", round: "CvD" },
  { id: 11, home: "JPN", away: "CAN", group: 5, day: "THU", time: "14:00", venue: "Palais", round: "CvD" },
  { id: 12, home: "ENG", away: "CHI", group: 6, day: "THU", time: "14:00", venue: "CR/Argo", round: "CvD" },
  // Round 2 (AvC)
  { id: 13, home: "NZ", away: "HI", group: 2, day: "THU", time: "15:00", venue: "Palais", round: "AvC" },
  { id: 14, home: "MEX", away: "SC", group: 1, day: "THU", time: "15:00", venue: "CR/Argo", round: "AvC" },
  { id: 15, home: "SCO", away: "SPA", group: 4, day: "THU", time: "16:00", venue: "Palais", round: "AvC" },
  { id: 16, home: "GER", away: "AUS", group: 3, day: "THU", time: "16:00", venue: "CR/Argo", round: "AvC" },
  { id: 17, home: "BEL", away: "ENG", group: 6, day: "THU", time: "17:00", venue: "Palais", round: "AvC" },
  { id: 18, home: "ITA", away: "JPN", group: 5, day: "THU", time: "17:00", venue: "CR/Argo", round: "AvC" },
  // Round 2 (BvD)
  { id: 19, home: "FRA", away: "WLS", group: 2, day: "THU", time: "18:00", venue: "Palais", round: "BvD" },
  { id: 20, home: "IRL", away: "NLD", group: 1, day: "THU", time: "18:00", venue: "CR/Argo", round: "BvD" },
  { id: 21, home: "COL", away: "USA", group: 4, day: "THU", time: "19:00", venue: "Palais", round: "BvD" },
  { id: 22, home: "PDC", away: "ARG", group: 3, day: "THU", time: "19:00", venue: "CR/Argo", round: "BvD" },
  { id: 23, home: "API", away: "CHI", group: 6, day: "THU", time: "20:00", venue: "Palais", round: "BvD" },
  { id: 24, home: "KU", away: "CAN", group: 5, day: "THU", time: "20:00", venue: "CR/Argo", round: "BvD" },
  // Friday - Round 3 (AvD)
  { id: 25, home: "MEX", away: "NLD", group: 1, day: "FRI", time: "09:00", venue: "Palais", round: "AvD" },
  { id: 26, home: "NZ", away: "WLS", group: 2, day: "FRI", time: "09:00", venue: "CR/Argo", round: "AvD" },
  { id: 27, home: "GER", away: "ARG", group: 3, day: "FRI", time: "10:00", venue: "Palais", round: "AvD" },
  { id: 28, home: "SCO", away: "USA", group: 4, day: "FRI", time: "10:00", venue: "CR/Argo", round: "AvD" },
  { id: 29, home: "ITA", away: "CAN", group: 5, day: "FRI", time: "11:00", venue: "Palais", round: "AvD" },
  { id: 30, home: "BEL", away: "CHI", group: 6, day: "FRI", time: "11:00", venue: "CR/Argo", round: "AvD" },
  // Round 3 (BvC)
  { id: 31, home: "FRA", away: "HI", group: 2, day: "FRI", time: "12:00", venue: "Palais", round: "BvC" },
  { id: 32, home: "IRL", away: "SC", group: 1, day: "FRI", time: "12:00", venue: "CR/Argo", round: "BvC" },
  { id: 33, home: "COL", away: "SPA", group: 4, day: "FRI", time: "13:00", venue: "Palais", round: "BvC" },
  { id: 34, home: "PDC", away: "AUS", group: 3, day: "FRI", time: "13:00", venue: "CR/Argo", round: "BvC" },
  { id: 35, home: "API", away: "ENG", group: 6, day: "FRI", time: "14:00", venue: "Palais", round: "BvC" },
  { id: 36, home: "KU", away: "JPN", group: 5, day: "FRI", time: "14:00", venue: "CR/Argo", round: "BvC" },
];

// Bracket & ranking games (ids determined by group results)
const BRACKET_TEMPLATE = [
  { id: 37, label: "QF4", homeSeed: "G4", awaySeed: "G5", day: "FRI", time: "16:00", venue: "Palais" },
  { id: 38, label: "QF2", homeSeed: "G3", awaySeed: "G6", day: "FRI", time: "16:00", venue: "CR/Argo" },
  { id: 39, label: "QF3", homeSeed: "G2", awaySeed: "G7", day: "FRI", time: "18:00", venue: "Palais" },
  { id: 40, label: "QF1", homeSeed: "G1", awaySeed: "G8", day: "FRI", time: "18:00", venue: "CR/Argo" },
  { id: 41, label: "R-17/18", homeSeed: "G17", awaySeed: "G18", day: "FRI", time: "20:00", venue: "Palais" },
  { id: 42, label: "R-19/20", homeSeed: "G19", awaySeed: "G20", day: "FRI", time: "20:00", venue: "CR/Argo" },
  { id: 43, label: "R-13/14", homeSeed: "G13", awaySeed: "G14", day: "SAT", time: "09:00", venue: "Palais" },
  { id: 44, label: "TE1", homeSeed: "LQ1", awaySeed: "LQ2", day: "SAT", time: "11:00", venue: "Palais" },
  { id: 45, label: "TE2", homeSeed: "LQ3", awaySeed: "LQ4", day: "SAT", time: "13:00", venue: "Palais" },
  { id: 46, label: "R-15/16", homeSeed: "G15", awaySeed: "G16", day: "SAT", time: "15:00", venue: "Palais" },
  { id: 47, label: "SF1", homeSeed: "WQ1", awaySeed: "WQ2", day: "SAT", time: "17:00", venue: "Palais" },
  { id: 48, label: "SF2", homeSeed: "WQ3", awaySeed: "WQ4", day: "SAT", time: "19:00", venue: "Palais" },
  { id: 49, label: "R-11/12", homeSeed: "G11", awaySeed: "G12", day: "SAT", time: "21:00", venue: "Palais" },
  { id: 50, label: "R-9/10", homeSeed: "G9", awaySeed: "G10", day: "SUN", time: "09:00", venue: "Palais" },
  { id: 51, label: "7th/8th", homeSeed: "LTE1", awaySeed: "LTE2", day: "SUN", time: "11:00", venue: "Palais" },
  { id: 52, label: "5th/6th", homeSeed: "WTE1", awaySeed: "WTE2", day: "SUN", time: "13:00", venue: "Palais" },
  { id: 53, label: "3rd/4th", homeSeed: "LS1", awaySeed: "LS2", day: "SUN", time: "17:00", venue: "Palais" },
  { id: 54, label: "FINAL", homeSeed: "WS1", awaySeed: "WS2", day: "SUN", time: "19:00", venue: "Palais" },
];

const DAY_LABELS = { THU: "Thursday", FRI: "Friday", SAT: "Saturday", SUN: "Sunday" };
const DAY_ORDER = ["THU", "FRI", "SAT", "SUN"];

const GAME_RULES = [
  "30-minute games: 2 \u00d7 15 min halves with 5-min break to swap benches",
  "Pool games: hard clock (no stoppages other than injury)",
  "5 penalties, 1 TTO, 1 OR (neither to be used in final 5 mins of game)",
  "Full-length bracket games as per standard play",
  "Buffer time factored in for injury/etc between games",
];

const DAY_SCHEDULES = [
  {
    day: "THU", label: "Thursday", tracks: 2,
    slots: [
      { time: "8:40–8:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "8:45–8:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "8:50–8:55", t1: "Warm up", t2: "Warm up" },
      { time: "8:55–9:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "9:00–9:15", t1: "Game 1 — 1st Half", t2: "Game 2 — 1st Half", game: true },
      { time: "9:15–9:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "9:25–9:40", t1: "Game 1 — 2nd Half", t2: "Game 2 — 2nd Half", game: true },
      { time: "9:40–9:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "9:45–9:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "9:50–9:55", t1: "Warm up", t2: "Warm up" },
      { time: "9:55–10:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "10:00–10:15", t1: "Game 3 — 1st Half", t2: "Game 4 — 1st Half", game: true },
      { time: "10:15–10:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "10:25–10:40", t1: "Game 3 — 2nd Half", t2: "Game 4 — 2nd Half", game: true },
      { time: "10:40–10:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "10:45–10:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "10:50–10:55", t1: "Warm up", t2: "Warm up" },
      { time: "10:55–11:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "11:00–11:15", t1: "Game 5 — 1st Half", t2: "Game 6 — 1st Half", game: true },
      { time: "11:15–11:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "11:25–11:40", t1: "Game 5 — 2nd Half", t2: "Game 6 — 2nd Half", game: true },
      { time: "11:40–11:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "11:45–11:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "11:50–11:55", t1: "Warm up", t2: "Warm up" },
      { time: "11:55–12:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "12:00–12:15", t1: "Game 7 — 1st Half", t2: "Game 8 — 1st Half", game: true },
      { time: "12:15–12:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "12:25–12:40", t1: "Game 7 — 2nd Half", t2: "Game 8 — 2nd Half", game: true },
      { time: "12:40–12:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "12:45–12:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "12:50–12:55", t1: "Warm up", t2: "Warm up" },
      { time: "12:55–13:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "13:00–13:15", t1: "Game 9 — 1st Half", t2: "Game 10 — 1st Half", game: true },
      { time: "13:15–13:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "13:25–13:40", t1: "Game 9 — 2nd Half", t2: "Game 10 — 2nd Half", game: true },
      { time: "13:40–13:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "13:45–13:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "13:50–13:55", t1: "Warm up", t2: "Warm up" },
      { time: "13:55–14:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "14:00–14:15", t1: "Game 11 — 1st Half", t2: "Game 12 — 1st Half", game: true },
      { time: "14:15–14:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "14:25–14:40", t1: "Game 11 — 2nd Half", t2: "Game 12 — 2nd Half", game: true },
      { time: "14:40–14:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "14:45–14:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "14:50–14:55", t1: "Warm up", t2: "Warm up" },
      { time: "14:55–15:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "15:00–15:15", t1: "Game 13 — 1st Half", t2: "Game 14 — 1st Half", game: true },
      { time: "15:15–15:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "15:25–15:40", t1: "Game 13 — 2nd Half", t2: "Game 14 — 2nd Half", game: true },
      { time: "15:40–15:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "15:45–15:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "15:50–15:55", t1: "Warm up", t2: "Warm up" },
      { time: "15:55–16:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "16:00–16:15", t1: "Game 15 — 1st Half", t2: "Game 16 — 1st Half", game: true },
      { time: "16:15–16:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "16:25–16:40", t1: "Game 15 — 2nd Half", t2: "Game 16 — 2nd Half", game: true },
      { time: "16:40–16:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "16:45–16:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "16:50–16:55", t1: "Warm up", t2: "Warm up" },
      { time: "16:55��17:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "17:00–17:15", t1: "Game 17 — 1st Half", t2: "Game 18 — 1st Half", game: true },
      { time: "17:15–17:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "17:25–17:40", t1: "Game 17 — 2nd Half", t2: "Game 18 — 2nd Half", game: true },
      { time: "17:40–17:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "17:45–17:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "17:50–17:55", t1: "Warm up", t2: "Warm up" },
      { time: "17:55–18:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "18:00–18:15", t1: "Game 19 — 1st Half", t2: "Game 20 — 1st Half", game: true },
      { time: "18:15–18:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "18:25–18:40", t1: "Game 19 — 2nd Half", t2: "Game 20 — 2nd Half", game: true },
      { time: "18:40–18:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "18:45–18:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "18:50–18:55", t1: "Warm up", t2: "Warm up" },
      { time: "18:55–19:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "19:00–19:15", t1: "Game 21 — 1st Half", t2: "Game 22 — 1st Half", game: true },
      { time: "19:15–19:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "19:25–19:40", t1: "Game 21 — 2nd Half", t2: "Game 22 — 2nd Half", game: true },
      { time: "19:40–19:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "19:45–19:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "19:50–19:55", t1: "Warm up", t2: "Warm up" },
      { time: "19:55–20:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "20:00–20:15", t1: "Game 23 — 1st Half", t2: "Game 24 — 1st Half", game: true },
      { time: "20:15–20:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "20:25–20:40", t1: "Game 23 — 2nd Half", t2: "Game 24 — 2nd Half", game: true },
    ]
  },
  {
    day: "FRI", label: "Friday", tracks: 2,
    slots: [
      { time: "8:40–8:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "8:45–8:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "8:50–8:55", t1: "Warm up", t2: "Warm up" },
      { time: "8:55–9:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "9:00–9:15", t1: "Game 25 — 1st Half", t2: "Game 26 — 1st Half", game: true },
      { time: "9:15–9:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "9:25–9:40", t1: "Game 25 — 2nd Half", t2: "Game 26 — 2nd Half", game: true },
      { time: "9:40–9:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "9:45–9:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "9:50–9:55", t1: "Warm up", t2: "Warm up" },
      { time: "9:55–10:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "10:00–10:15", t1: "Game 27 — 1st Half", t2: "Game 28 — 1st Half", game: true },
      { time: "10:15–10:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "10:25–10:40", t1: "Game 27 — 2nd Half", t2: "Game 28 — 2nd Half", game: true },
      { time: "10:40–10:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "10:45–10:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "10:50–10:55", t1: "Warm up", t2: "Warm up" },
      { time: "10:55–11:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "11:00–11:15", t1: "Game 29 — 1st Half", t2: "Game 30 — 1st Half", game: true },
      { time: "11:15–11:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "11:25–11:40", t1: "Game 29 — 2nd Half", t2: "Game 30 — 2nd Half", game: true },
      { time: "11:40–11:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "11:45–11:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "11:50–11:55", t1: "Warm up", t2: "Warm up" },
      { time: "11:55–12:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "12:00–12:15", t1: "Game 31 — 1st Half", t2: "Game 32 — 1st Half", game: true },
      { time: "12:15–12:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "12:25–12:40", t1: "Game 31 — 2nd Half", t2: "Game 32 — 2nd Half", game: true },
      { time: "12:40–12:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "12:45–12:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "12:50–12:55", t1: "Warm up", t2: "Warm up" },
      { time: "12:55–13:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "13:00–13:15", t1: "Game 33 — 1st Half", t2: "Game 34 — 1st Half", game: true },
      { time: "13:15–13:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "13:25–13:40", t1: "Game 33 — 2nd Half", t2: "Game 34 — 2nd Half", game: true },
      { time: "13:40–13:45", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "13:45–13:50", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "13:50–13:55", t1: "Warm up", t2: "Warm up" },
      { time: "13:55–14:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "14:00–14:15", t1: "Game 35 — 1st Half", t2: "Game 36 — 1st Half", game: true },
      { time: "14:15–14:25", t1: "Half Time / Switch Bench / Buffer", t2: "Half Time / Switch Bench / Buffer" },
      { time: "14:25–14:40", t1: "Game 35 — 2nd Half", t2: "Game 36 — 2nd Half", game: true },
      // BREAK
      { time: "15:30–15:35", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "15:35–15:45", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "15:45–15:55", t1: "Warm up", t2: "Warm up" },
      { time: "15:55–16:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "16:00–16:40", t1: "Game 37 — 1st Half", t2: "Game 38 — 1st Half", game: true },
      { time: "16:40–16:50", t1: "Half Time / Switch Bench", t2: "Half Time / Switch Bench" },
      { time: "16:50–17:30", t1: "Game 37 — 2nd Half", t2: "Game 38 — 2nd Half", game: true },
      { time: "17:30–17:35", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "17:35–17:45", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "17:45–17:55", t1: "Warm up", t2: "Warm up" },
      { time: "17:55–18:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "18:00–18:40", t1: "Game 39 — 1st Half", t2: "Game 40 — 1st Half", game: true },
      { time: "18:40–18:50", t1: "Half Time / Switch Bench", t2: "Half Time / Switch Bench" },
      { time: "18:50–19:30", t1: "Game 39 — 2nd Half", t2: "Game 40 — 2nd Half", game: true },
      { time: "19:30–19:35", t1: "Captains Meeting", t2: "Captains Meeting" },
      { time: "19:35–19:45", t1: "Warm up / Officials' Meeting", t2: "Warm up / Officials' Meeting" },
      { time: "19:45–19:55", t1: "Warm up", t2: "Warm up" },
      { time: "19:55–20:00", t1: "Buffer / Anthems", t2: "Buffer / Anthems" },
      { time: "20:00–20:40", t1: "Game 41 — 1st Half", t2: "Game 42 — 1st Half", game: true },
      { time: "20:40–20:50", t1: "Half Time / Switch Bench", t2: "Half Time / Switch Bench" },
      { time: "20:50–21:30", t1: "Game 41 — 2nd Half", t2: "Game 42 — 2nd Half", game: true },
    ]
  },
  {
    day: "SAT", label: "Saturday", tracks: 1,
    slots: [
      { time: "8:30–8:35", t1: "Captains Meeting" },
      { time: "8:35–8:45", t1: "Warm up / Officials' Meeting" },
      { time: "8:45–8:55", t1: "Warm up" },
      { time: "8:55–9:00", t1: "Buffer" },
      { time: "9:00–9:40", t1: "Game 43 — 1st Half", game: true },
      { time: "9:40–9:50", t1: "Half Time / Switch Bench" },
      { time: "9:50–10:30", t1: "Game 43 — 2nd Half", game: true },
      { time: "10:30��10:35", t1: "Captains Meeting" },
      { time: "10:35–10:45", t1: "Warm up / Officials' Meeting" },
      { time: "10:45–10:55", t1: "Warm up" },
      { time: "10:55–11:00", t1: "Buffer" },
      { time: "11:00–11:40", t1: "Game 44 — 1st Half", game: true },
      { time: "11:40–11:50", t1: "Half Time / Switch Bench" },
      { time: "11:50–12:30", t1: "Game 44 — 2nd Half", game: true },
      { time: "12:30–12:35", t1: "Captains Meeting" },
      { time: "12:35–12:45", t1: "Warm up / Officials' Meeting" },
      { time: "12:45–12:55", t1: "Warm up" },
      { time: "12:55–13:00", t1: "Buffer" },
      { time: "13:00–13:40", t1: "Game 45 — 1st Half", game: true },
      { time: "13:40–13:50", t1: "Half Time / Switch Bench" },
      { time: "13:50–14:30", t1: "Game 45 — 2nd Half", game: true },
      { time: "14:30–14:35", t1: "Captains Meeting" },
      { time: "14:35–14:45", t1: "Warm up / Officials' Meeting" },
      { time: "14:45–14:55", t1: "Warm up" },
      { time: "14:55–15:00", t1: "Buffer" },
      { time: "15:00–15:40", t1: "Game 46 — 1st Half", game: true },
      { time: "15:40–15:50", t1: "Half Time / Switch Bench" },
      { time: "15:50–16:30", t1: "Game 46 — 2nd Half", game: true },
      { time: "16:30–16:35", t1: "Captains Meeting" },
      { time: "16:35–16:45", t1: "Warm up / Officials' Meeting" },
      { time: "16:45–16:55", t1: "Warm up" },
      { time: "16:55–17:00", t1: "Buffer" },
      { time: "17:00–17:40", t1: "Game 47 — 1st Half", game: true },
      { time: "17:40–17:50", t1: "Half Time / Switch Bench" },
      { time: "17:50–18:30", t1: "Game 47 — 2nd Half", game: true },
      { time: "18:30–18:35", t1: "Captains Meeting" },
      { time: "18:35–18:45", t1: "Warm up / Officials' Meeting" },
      { time: "18:45–18:55", t1: "Warm up" },
      { time: "18:55–19:00", t1: "Buffer" },
      { time: "19:00–19:40", t1: "Game 48 — 1st Half", game: true },
      { time: "19:40–19:50", t1: "Half Time / Switch Bench" },
      { time: "19:50–20:30", t1: "Game 48 — 2nd Half", game: true },
      { time: "20:30–20:35", t1: "Captains Meeting" },
      { time: "20:35–20:45", t1: "Warm up / Officials' Meeting" },
      { time: "20:45–20:55", t1: "Warm up" },
      { time: "20:55–21:00", t1: "Buffer" },
      { time: "21:00–21:40", t1: "Game 49 — 1st Half", game: true },
      { time: "21:40–21:50", t1: "Half Time / Switch Bench" },
      { time: "21:50–22:30", t1: "Game 49 — 2nd Half", game: true },
    ]
  },
  {
    day: "SUN", label: "Sunday", tracks: 1,
    slots: [
      { time: "8:30–8:35", t1: "Captains Meeting" },
      { time: "8:35–8:45", t1: "Warm up / Officials' Meeting" },
      { time: "8:45–8:55", t1: "Warm up" },
      { time: "8:55–9:00", t1: "Buffer" },
      { time: "9:00–9:40", t1: "Game 50 — 1st Half", game: true },
      { time: "9:40–9:50", t1: "Half Time / Switch Bench" },
      { time: "9:50–10:30", t1: "Game 50 — 2nd Half", game: true },
      { time: "10:30–10:35", t1: "Captains Meeting" },
      { time: "10:35–10:45", t1: "Warm up / Officials' Meeting" },
      { time: "10:45–10:55", t1: "Warm up" },
      { time: "10:55–11:00", t1: "Buffer" },
      { time: "11:00–11:40", t1: "Game 51 — 1st Half", game: true },
      { time: "11:40–11:50", t1: "Half Time / Switch Bench" },
      { time: "11:50–12:30", t1: "Game 51 — 2nd Half", game: true },
      { time: "12:30–12:35", t1: "Captains Meeting" },
      { time: "12:35–12:45", t1: "Warm up / Officials' Meeting" },
      { time: "12:45–12:55", t1: "Warm up" },
      { time: "12:55–13:00", t1: "Buffer" },
      { time: "13:00–13:40", t1: "Game 52 — 1st Half", game: true },
      { time: "13:40–13:50", t1: "Half Time / Switch Bench" },
      { time: "13:50–14:30", t1: "Game 52 — 2nd Half", game: true },
      { time: "14:30–16:30", t1: "Parade of Nations", special: true },
      { time: "16:30–16:35", t1: "Captains Meeting" },
      { time: "16:35–16:45", t1: "Warm up / Officials' Meeting" },
      { time: "16:45–16:55", t1: "Warm up" },
      { time: "16:55–17:00", t1: "Buffer" },
      { time: "17:00–17:40", t1: "Game 53 — 1st Half", game: true },
      { time: "17:40–17:50", t1: "Half Time / Switch Bench" },
      { time: "17:50–18:30", t1: "Game 53 — 2nd Half", game: true },
      { time: "18:30–18:35", t1: "Captains Meeting" },
      { time: "18:35–18:45", t1: "Warm up / Officials' Meeting" },
      { time: "18:45–18:55", t1: "Warm up" },
      { time: "18:55–19:00", t1: "Buffer" },
      { time: "19:00–19:40", t1: "Game 54 — 1st Half", game: true },
      { time: "19:40–19:50", t1: "Half Time / Switch Bench" },
      { time: "19:50–20:30", t1: "Game 54 — 2nd Half", game: true },
      { time: "20:30–21:30", t1: "Awards Ceremony", special: true },
    ]
  },
];

function getInitialScores() {
  const s = {};
  for (let i = 1; i <= 54; i++) s[i] = { home: "", away: "" };
  return s;
}

function computeGroupStandings(groupId, scores) {
  const group = GROUPS[groupId];
  const games = GROUP_GAMES.filter(g => g.group === groupId);
  const stats = {};

  group.teams.forEach(t => {
    stats[t] = { team: t, wins: 0, losses: 0, pf: 0, pa: 0, diffs: [], gamesPlayed: 0 };
  });

  games.forEach(g => {
    const sc = scores[g.id];
    if (sc && sc.home !== "" && sc.away !== "") {
      const h = parseInt(sc.home), a = parseInt(sc.away);
      if (isNaN(h) || isNaN(a)) return;
      stats[g.home].pf += h; stats[g.home].pa += a;
      stats[g.away].pf += a; stats[g.away].pa += h;
      stats[g.home].diffs.push(h - a);
      stats[g.away].diffs.push(a - h);
      stats[g.home].gamesPlayed++;
      stats[g.away].gamesPlayed++;
      if (h > a) { stats[g.home].wins++; stats[g.away].losses++; }
      else if (a > h) { stats[g.away].wins++; stats[g.home].losses++; }
    }
  });

  // Calculate adjusted differential: remove biggest loss
  Object.values(stats).forEach(s => {
    if (s.diffs.length > 0) {
      const sorted = [...s.diffs].sort((a, b) => a - b);
      const worstLoss = sorted[0];
      if (worstLoss < 0 && s.diffs.length > 1) {
        const idx = s.diffs.indexOf(worstLoss);
        const adjusted = [...s.diffs];
        adjusted.splice(idx, 1);
        s.adjDiff = adjusted.reduce((a, b) => a + b, 0);
        s.droppedGame = worstLoss;
      } else {
        s.adjDiff = s.diffs.reduce((a, b) => a + b, 0);
        s.droppedGame = null;
      }
      s.rawDiff = s.diffs.reduce((a, b) => a + b, 0);
    } else {
      s.adjDiff = 0; s.rawDiff = 0; s.droppedGame = null;
    }
  });

  return Object.values(stats).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.adjDiff - a.adjDiff;
  });
}

function computeOverallRankings(scores) {
  const allStandings = [];
  for (let g = 1; g <= 6; g++) {
    const standings = computeGroupStandings(g, scores);
    standings.forEach((s, idx) => {
      allStandings.push({ ...s, groupRank: idx + 1, group: g });
    });
  }

  // Rank within each position tier
  const tiers = [[], [], [], []];
  allStandings.forEach(s => tiers[s.groupRank - 1].push(s));
  tiers.forEach(tier => tier.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.adjDiff - a.adjDiff;
  }));

  const ranked = [...tiers[0], ...tiers[1], ...tiers[2], ...tiers[3]];
  return ranked.map((s, i) => ({ ...s, overallRank: i + 1 }));
}

function allGroupGamesComplete(scores) {
  return GROUP_GAMES.every(g => {
    const sc = scores[g.id];
    return sc && sc.home !== "" && sc.away !== "" && !isNaN(parseInt(sc.home)) && !isNaN(parseInt(sc.away));
  });
}

function resolveTeamForSeed(seed, scores) {
  if (!allGroupGamesComplete(scores)) return null;
  const rankings = computeOverallRankings(scores);
  const rank = parseInt(seed.replace("G", ""));
  if (isNaN(rank)) return null;
  const team = rankings.find(r => r.overallRank === rank);
  return team ? team.team : null;
}

function gameResult(scores, gameId) {
  const s = scores[gameId];
  if (!s || s.home === "" || s.away === "") return null;
  const h = parseInt(s.home), a = parseInt(s.away);
  if (isNaN(h) || isNaN(a)) return null;
  return { h, a, gameId };
}

function resolveBracketTeam(seed, scores) {
  if (seed.startsWith("G")) return resolveTeamForSeed(seed, scores);
  const seedMap = {
    WQ1: [40, "w"], WQ2: [38, "w"], WQ3: [39, "w"], WQ4: [37, "w"],
    LQ1: [40, "l"], LQ2: [38, "l"], LQ3: [39, "l"], LQ4: [37, "l"],
    WS1: [47, "w"], WS2: [48, "w"], LS1: [47, "l"], LS2: [48, "l"],
    WTE1: [44, "w"], WTE2: [45, "w"], LTE1: [44, "l"], LTE2: [45, "l"],
  };
  const entry = seedMap[seed];
  if (!entry) return null;
  const [gameId, wl] = entry;
  const r = gameResult(scores, gameId);
  if (!r || r.h === r.a) return null;
  const winnerSide = r.h > r.a ? "home" : "away";
  const side = wl === "w" ? winnerSide : (winnerSide === "home" ? "away" : "home");
  return resolveBracketGame(gameId, scores, side);
}

function resolveBracketGame(gameId, scores, side) {
  const tmpl = BRACKET_TEMPLATE.find(b => b.id === gameId);
  if (!tmpl) return null;
  if (side === "home") return resolveBracketTeam(tmpl.homeSeed, scores);
  return resolveBracketTeam(tmpl.awaySeed, scores);
}

// Score Input Component
function ScoreInput({ value, onChange, onBlur }) {
  return (
    <input
      type="number"
      min="0"
      max="999"
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      style={{
        width: 52, height: 36, textAlign: "center", fontSize: 16, fontWeight: 700,
        border: "2px solid #334155", borderRadius: 6, background: value !== "" ? "#f0fdf4" : "#f8fafc",
        color: "#0f172a", fontFamily: "'JetBrains Mono', monospace"
      }}
      placeholder="—"
    />
  );
}

// Team Badge
function TeamBadge({ code, size = "md" }) {
  if (!code) return <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: size === "sm" ? 11 : 13 }}>TBD</span>;
  const s = size === "sm" ? { fontSize: 11, padding: "2px 6px" } : { fontSize: 13, padding: "3px 10px" };
  return (
    <span style={{
      ...s, background: TEAM_COLORS[code] || "#64748b", color: "#fff",
      borderRadius: 4, fontWeight: 700, display: "inline-block", letterSpacing: 0.5,
      textShadow: "0 1px 2px rgba(0,0,0,0.3)", whiteSpace: "nowrap",
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      {code}
    </span>
  );
}

// Game Row for group stage
function GameRow({ game, score, onScoreChange, onScoreBlur }) {
  const homeWin = score.home !== "" && score.away !== "" && parseInt(score.home) > parseInt(score.away);
  const awayWin = score.home !== "" && score.away !== "" && parseInt(score.away) > parseInt(score.home);
  const played = score.home !== "" && score.away !== "";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "26px 1fr 54px 30px 54px 1fr",
      alignItems: "center", gap: 6, padding: "6px 10px",
      background: played ? "#f0fdf4" : "transparent",
      borderRadius: 6, borderLeft: played ? "3px solid #22c55e" : "3px solid transparent"
    }}>
      <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>G{game.id}</span>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
        <span style={{ fontSize: 12, color: homeWin ? "#16a34a" : "#475569", fontWeight: homeWin ? 700 : 400 }}>
          {TEAMS[game.home]}
        </span>
        <TeamBadge code={game.home} size="sm" />
      </div>
      <ScoreInput value={score.home} onChange={v => onScoreChange(game.id, "home", v)} onBlur={() => onScoreBlur(game.id)} />
      <span style={{ textAlign: "center", color: "#94a3b8", fontWeight: 700, fontSize: 11 }}>vs</span>
      <ScoreInput value={score.away} onChange={v => onScoreChange(game.id, "away", v)} onBlur={() => onScoreBlur(game.id)} />
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <TeamBadge code={game.away} size="sm" />
        <span style={{ fontSize: 12, color: awayWin ? "#16a34a" : "#475569", fontWeight: awayWin ? 700 : 400 }}>
          {TEAMS[game.away]}
        </span>
      </div>
    </div>
  );
}

// Group standings table
function GroupTable({ groupId, scores }) {
  const standings = computeGroupStandings(groupId, scores);
  const group = GROUPS[groupId];

  return (
    <div style={{
      background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0",
      overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1e293b, #334155)", color: "#fff",
        padding: "10px 14px", fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        {group.name}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={thStyle}>#</th>
            <th style={{ ...thStyle, textAlign: "left" }}>Team</th>
            <th style={thStyle}>W</th>
            <th style={thStyle}>L</th>
            <th style={thStyle}>PF</th>
            <th style={thStyle}>PA</th>
            <th style={thStyle}>Diff</th>
            <th style={thStyle}>Adj</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr key={s.team} style={{
              background: i === 0 ? "#f0fdf4" : i < 2 ? "#fefce8" : "transparent",
              borderTop: "1px solid #f1f5f9"
            }}>
              <td style={{ ...tdStyle, fontWeight: 700, color: i === 0 ? "#16a34a" : "#64748b" }}>{i + 1}</td>
              <td style={{ ...tdStyle, textAlign: "left" }}><TeamBadge code={s.team} size="sm" /> <span style={{ marginLeft: 4, fontSize: 11, color: "#475569" }}>{TEAMS[s.team]}</span></td>
              <td style={{ ...tdStyle, fontWeight: 700, color: "#16a34a" }}>{s.wins}</td>
              <td style={{ ...tdStyle, color: "#ef4444" }}>{s.losses}</td>
              <td style={tdStyle}>{s.pf}</td>
              <td style={tdStyle}>{s.pa}</td>
              <td style={{ ...tdStyle, color: s.rawDiff > 0 ? "#16a34a" : s.rawDiff < 0 ? "#ef4444" : "#64748b", fontWeight: 600 }}>
                {s.rawDiff > 0 ? "+" : ""}{s.rawDiff}
              </td>
              <td style={{ ...tdStyle, fontWeight: 700, color: s.adjDiff > 0 ? "#16a34a" : s.adjDiff < 0 ? "#ef4444" : "#64748b" }}>
                {s.adjDiff > 0 ? "+" : ""}{s.adjDiff}
                {s.droppedGame !== null && (
                  <span style={{ fontSize: 9, color: "#94a3b8", marginLeft: 2 }}>({s.droppedGame})</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "6px 4px", textAlign: "center", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 };
const tdStyle = { padding: "6px 4px", textAlign: "center", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" };

// Bracket game component
function BracketGame({ tmpl, scores, onScoreChange, onScoreBlur }) {
  const homeTeam = resolveBracketTeam(tmpl.homeSeed, scores);
  const awayTeam = resolveBracketTeam(tmpl.awaySeed, scores);
  const sc = scores[tmpl.id] || { home: "", away: "" };
  const played = sc.home !== "" && sc.away !== "";
  const h = parseInt(sc.home), a = parseInt(sc.away);
  const homeWin = played && h > a;
  const awayWin = played && a > h;

  return (
    <div style={{
      background: "#fff", borderRadius: 10,
      border: played ? "2px solid #22c55e" : "1px solid #e2e8f0",
      padding: 12, minWidth: 220,
      boxShadow: played ? "0 0 12px rgba(34,197,94,0.15)" : "0 1px 3px rgba(0,0,0,0.06)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: "#fff", padding: "2px 8px", borderRadius: 4,
          background: tmpl.label.includes("FINAL") ? "#eab308" : tmpl.label.includes("SF") ? "#8b5cf6" : tmpl.label.includes("QF") ? "#3b82f6" : "#64748b",
          fontFamily: "'JetBrains Mono', monospace"
        }}>{tmpl.label}</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>G{tmpl.id} · {DAY_LABELS[tmpl.day]} {tmpl.time}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderLeft: homeWin ? "3px solid #22c55e" : "3px solid transparent", paddingLeft: 8 }}>
          <TeamBadge code={homeTeam} />
          <span style={{ flex: 1, fontSize: 12, fontWeight: homeWin ? 700 : 400 }}>{homeTeam ? TEAMS[homeTeam] : tmpl.homeSeed}</span>
          <ScoreInput value={sc.home} onChange={v => onScoreChange(tmpl.id, "home", v)} onBlur={() => onScoreBlur(tmpl.id)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderLeft: awayWin ? "3px solid #22c55e" : "3px solid transparent", paddingLeft: 8 }}>
          <TeamBadge code={awayTeam} />
          <span style={{ flex: 1, fontSize: 12, fontWeight: awayWin ? 700 : 400 }}>{awayTeam ? TEAMS[awayTeam] : tmpl.awaySeed}</span>
          <ScoreInput value={sc.away} onChange={v => onScoreChange(tmpl.id, "away", v)} onBlur={() => onScoreBlur(tmpl.id)} />
        </div>
      </div>
    </div>
  );
}

// Overall Rankings Table
function OverallRankings({ scores }) {
  const rankings = computeOverallRankings(scores);
  const anyData = rankings.some(r => r.gamesPlayed > 0);
  if (!anyData) return <div style={{ color: "#94a3b8", textAlign: "center", padding: 40, fontStyle: "italic" }}>Enter group stage scores to see overall rankings</div>;

  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={thStyle}>Seed</th>
            <th style={{ ...thStyle, textAlign: "left" }}>Team</th>
            <th style={thStyle}>Grp</th>
            <th style={thStyle}>Pos</th>
            <th style={thStyle}>W</th>
            <th style={thStyle}>L</th>
            <th style={thStyle}>Adj Diff</th>
            <th style={thStyle}>Dest</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((r, i) => {
            let dest = "";
            let destColor = "#64748b";
            if (i < 8) { dest = "Bracket"; destColor = "#3b82f6"; }
            else if (i < 20) { dest = "Rankings"; destColor = "#f59e0b"; }
            else { dest = "Eliminated"; destColor = "#ef4444"; }

            return (
              <tr key={r.team} style={{
                background: i < 8 ? "#eff6ff" : i < 20 ? "#fffbeb" : "#fef2f2",
                borderTop: i === 8 || i === 20 ? "3px solid #cbd5e1" : "1px solid #f1f5f9"
              }}>
                <td style={{ ...tdStyle, fontWeight: 700 }}>{i + 1}</td>
                <td style={{ ...tdStyle, textAlign: "left" }}><TeamBadge code={r.team} size="sm" /> <span style={{ marginLeft: 4, fontSize: 11 }}>{TEAMS[r.team]}</span></td>
                <td style={tdStyle}>G{r.group}</td>
                <td style={tdStyle}>{r.groupRank}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: "#16a34a" }}>{r.wins}</td>
                <td style={{ ...tdStyle, color: "#ef4444" }}>{r.losses}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: r.adjDiff > 0 ? "#16a34a" : r.adjDiff < 0 ? "#ef4444" : "#64748b" }}>{r.adjDiff > 0 ? "+" : ""}{r.adjDiff}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: destColor, fontSize: 10 }}>{dest}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Tab component
// Event Schedule Component
function EventSchedule() {
  const [expandedDay, setExpandedDay] = useState("THU");
  return (
    <div>
      {/* Rules */}
      <div style={{
        background: "#1e293b", borderRadius: 8, padding: 16, marginBottom: 20,
        border: "1px solid #334155"
      }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>
          Game Rules
        </h3>
        <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
          {GAME_RULES.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      {/* Day selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {DAY_SCHEDULES.map(ds => (
          <button
            key={ds.day}
            onClick={() => setExpandedDay(expandedDay === ds.day ? null : ds.day)}
            style={{
              flex: 1, padding: "8px 12px", border: expandedDay === ds.day ? "2px solid #3b82f6" : "1px solid #334155",
              borderRadius: 6, background: expandedDay === ds.day ? "#1e3a5f" : "#1e293b",
              color: expandedDay === ds.day ? "#93c5fd" : "#94a3b8", cursor: "pointer",
              fontWeight: 700, fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.15s ease"
            }}
          >
            {ds.label}
            <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, opacity: 0.7 }}>
              {ds.tracks === 2 ? "2 Venues" : "Palais Only"}
            </div>
          </button>
        ))}
      </div>

      {/* Timeline */}
      {DAY_SCHEDULES.filter(ds => ds.day === expandedDay).map(ds => (
        <div key={ds.day} style={{
          background: "#1e293b", borderRadius: 8, border: "1px solid #334155", overflow: "hidden"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: ds.tracks === 2 ? "110px 1fr 1fr" : "110px 1fr",
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace"
          }}>
            {/* Header row */}
            <div style={{ padding: "8px 10px", background: "#0f172a", color: "#64748b", fontWeight: 700, borderBottom: "1px solid #334155" }}>
              Time
            </div>
            <div style={{ padding: "8px 10px", background: "#0f172a", color: "#64748b", fontWeight: 700, borderBottom: "1px solid #334155" }}>
              Palais des Sports
            </div>
            {ds.tracks === 2 && (
              <div style={{ padding: "8px 10px", background: "#0f172a", color: "#64748b", fontWeight: 700, borderBottom: "1px solid #334155" }}>
                CR / Argonaut
              </div>
            )}

            {/* Rows */}
            {ds.slots.map((slot, i) => {
              const isGame = slot.game;
              const isSpecial = slot.special;
              const bg = isSpecial ? "#312e81" : isGame ? "#0c4a6e" : "transparent";
              const color = isSpecial ? "#c4b5fd" : isGame ? "#7dd3fc" : "#94a3b8";
              const borderColor = "#334155";
              return [
                <div key={`t${i}`} style={{
                  padding: "4px 10px", borderBottom: `1px solid ${borderColor}`, color: "#64748b",
                  background: bg, fontSize: 10, display: "flex", alignItems: "center"
                }}>
                  {slot.time}
                </div>,
                <div key={`e1${i}`} style={{
                  padding: "4px 10px", borderBottom: `1px solid ${borderColor}`,
                  color, background: bg, fontWeight: isGame || isSpecial ? 600 : 400
                }}>
                  {slot.t1}
                </div>,
                ds.tracks === 2 && (
                  <div key={`e2${i}`} style={{
                    padding: "4px 10px", borderBottom: `1px solid ${borderColor}`,
                    color, background: bg, fontWeight: isGame || isSpecial ? 600 : 400
                  }}>
                    {slot.t2 || ""}
                  </div>
                ),
              ];
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tab({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px", border: "none", borderBottom: active ? "3px solid #3b82f6" : "3px solid transparent",
        background: active ? "#eff6ff" : "transparent", color: active ? "#1d4ed8" : "#64748b",
        fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer",
        transition: "all 0.15s ease", fontFamily: "'JetBrains Mono', monospace",
        display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

export default function TournamentTracker() {
  const [scores, setScores] = useState(getInitialScores);
  const [tab, setTab] = useState("groups");
  const [loaded, setLoaded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [drawAlert, setDrawAlert] = useState(null);
  const sessionStart = useRef(Date.now());
  const maxScroll = useRef(0);

  // Load from storage
  useEffect(() => {
    let isReturn = false;
    try {
      const stored = localStorage.getItem("tournament-scores-2026");
      if (stored) {
        const parsed = JSON.parse(stored);
        setScores(prev => ({ ...prev, ...parsed }));
        isReturn = true;
      }
    } catch (e) { /* no saved data */ }
    setLoaded(true);
    track("session_start", {
      is_return_visit: isReturn,
      day: new Date().toLocaleDateString("en-US", { weekday: "long" })
    });
  }, []);

  // Save to storage on change
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("tournament-scores-2026", JSON.stringify(scores)); } catch (e) {}
  }, [scores, loaded]);

  // Track scroll depth
  useEffect(() => {
    const onScroll = () => {
      const scrollPct = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPct > maxScroll.current) maxScroll.current = scrollPct;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track time on page + max scroll on unload
  useEffect(() => {
    const onUnload = () => {
      const seconds = Math.round((Date.now() - sessionStart.current) / 1000);
      track("session_end", { duration_seconds: seconds, max_scroll_pct: maxScroll.current, tab });
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [tab]);

  // Track tab views
  const handleTabChange = useCallback((newTab) => {
    track("tab_view", { tab: newTab });
    setTab(newTab);
  }, []);

  const handleScoreChange = useCallback((gameId, side, value) => {
    setScores(prev => {
      const next = { ...prev, [gameId]: { ...prev[gameId], [side]: value === "" ? "" : value } };
      const updated = next[gameId];
      if (updated.home !== "" && updated.away !== "") {
        const groupGame = GROUP_GAMES.find(g => g.id === gameId);
        const bracketGame = BRACKET_TEMPLATE.find(b => b.id === gameId);
        track("score_update", {
          game_id: gameId,
          type: groupGame ? "group" : "bracket",
          group: groupGame ? groupGame.group : undefined,
          round: bracketGame ? bracketGame.label : groupGame?.round
        });
        // Check if bracket is fully filled
        const bracketIds = BRACKET_TEMPLATE.map(b => b.id);
        const allBracketFilled = bracketIds.every(id => next[id]?.home !== "" && next[id]?.away !== "");
        if (allBracketFilled) track("bracket_complete");
      }
      return next;
    });
  }, []);

  const handleScoreBlur = useCallback((gameId) => {
    setScores(prev => {
      const s = prev[gameId];
      if (!s || s.home === "" || s.away === "") return prev;
      const h = parseInt(s.home), a = parseInt(s.away);
      if (!isNaN(h) && !isNaN(a) && h === a) {
        setDrawAlert(gameId);
        return { ...prev, [gameId]: { home: "", away: "" } };
      }
      return prev;
    });
  }, []);

  const resetAll = () => {
    track("reset_all", { games_played: gamesPlayed });
    setScores(getInitialScores());
    setConfirmReset(false);
    try { localStorage.removeItem("tournament-scores-2026"); } catch(e) {}
  };

  const exportScores = () => {
    const data = JSON.stringify(scores, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tournament-scores-2026.json";
    a.click();
    URL.revokeObjectURL(url);
    track("export_scores", { games_played: gamesPlayed });
  };

  const importScores = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          setScores(prev => ({ ...prev, ...parsed }));
          track("import_scores", { games_played: Object.values(parsed).filter(s => s.home !== "" && s.away !== "").length });
        } catch {
          alert("Invalid file. Please select a valid tournament scores JSON file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const gamesPlayed = useMemo(() => Object.values(scores).filter(s => s.home !== "" && s.away !== "").length, [scores]);
  const groupGamesPlayed = useMemo(() => GROUP_GAMES.filter(g => { const s = scores[g.id]; return s && s.home !== "" && s.away !== ""; }).length, [scores]);
  const groupsComplete = useMemo(() => allGroupGamesComplete(scores), [scores]);

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      maxWidth: 1100, margin: "0 auto", background: "#f8fafc", minHeight: "100vh",
      overflowX: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {drawAlert !== null && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          zIndex: 1000, background: "#dc2626", color: "#fff", padding: "12px 24px",
          borderRadius: 8, fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px rgba(220,38,38,0.4)",
          display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 0.2s ease-out"
        }}>
          <span>Draws are not allowed — scores for Game {drawAlert} have been reset</span>
          <button onClick={() => setDrawAlert(null)} style={{
            background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
            borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontWeight: 700, fontSize: 16
          }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        color: "#fff", padding: "20px 24px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, fontFamily: "'JetBrains Mono', monospace" }}>
              🏆 2026 TOURNAMENT TRACKER
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
              24 Teams · 54 Games · 4 Days — {gamesPlayed}/54 completed
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => handleTabChange("eventinfo")} style={{
              background: tab === "eventinfo" ? "#475569" : "#334155", color: "#cbd5e1", border: "1px solid #475569",
              borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 500, cursor: "pointer",
              transition: "all 0.15s ease", fontFamily: "'JetBrains Mono', monospace"
            }}>Event Info</button>
            <div style={{
              background: "#1e40af", borderRadius: 20, padding: "6px 14px", fontSize: 12,
              fontWeight: 700, fontFamily: "'JetBrains Mono', monospace"
            }}>
              {Math.round((gamesPlayed / 54) * 100)}%
            </div>
            <button onClick={exportScores} style={{
              background: "#0d9488", color: "#fff", border: "none", borderRadius: 6,
              padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer"
            }}>Export</button>
            <button onClick={importScores} style={{
              background: "#2563eb", color: "#fff", border: "none", borderRadius: 6,
              padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer"
            }}>Import</button>
            {!confirmReset ? (
              <button onClick={() => setConfirmReset(true)} style={{
                background: "#dc2626", color: "#fff", border: "none", borderRadius: 6,
                padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer"
              }}>Reset</button>
            ) : (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#fca5a5" }}>Sure?</span>
                <button onClick={resetAll} style={{
                  background: "#fff", color: "#dc2626", border: "1px solid #dc2626", borderRadius: 6,
                  padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer"
                }}>Yes, reset all</button>
                <button onClick={() => setConfirmReset(false)} style={{
                  background: "transparent", color: "#94a3b8", border: "1px solid #475569", borderRadius: 6,
                  padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer"
                }}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 10, background: "#334155", borderRadius: 4, height: 6, overflow: "hidden" }}>
          <div style={{
            width: `${(gamesPlayed / 54) * 100}%`, height: "100%",
            background: "linear-gradient(90deg, #22c55e, #3b82f6)", borderRadius: 4,
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 0, borderBottom: "1px solid #e2e8f0", background: "#fff",
        overflowX: "auto", position: "sticky", top: 90, zIndex: 99
      }}>
        <Tab label="Groups" active={tab === "groups"} onClick={() => handleTabChange("groups")} icon="📊" />
        <Tab label="Schedule" active={tab === "schedule"} onClick={() => handleTabChange("schedule")} icon="📅" />
        <Tab label="Rankings" active={tab === "rankings"} onClick={() => handleTabChange("rankings")} icon="🏅" />
        <Tab label="Bracket" active={tab === "bracket"} onClick={() => handleTabChange("bracket")} icon="🏆" />
        <Tab label="9-20 Play" active={tab === "lower"} onClick={() => handleTabChange("lower")} icon="📋" />
        <Tab label="Finals" active={tab === "finals"} onClick={() => handleTabChange("finals")} icon="⭐" />
      </div>

      <div style={{ padding: 16 }}>
        {/* GROUPS TAB */}
        {tab === "groups" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 16, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5, 6].map(gId => (
                <GroupTable key={gId} groupId={gId} scores={scores} />
              ))}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: 10 }}>
              Enter Group Stage Scores
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                background: groupsComplete ? "#dcfce7" : "#fef3c7",
                color: groupsComplete ? "#166534" : "#92400e",
                fontFamily: "'JetBrains Mono', monospace"
              }}>{groupGamesPlayed}/36 {groupsComplete ? "✓ Complete" : "remaining"}</span>
            </h3>
            {["THU", "FRI"].map(day => (
              <div key={day} style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 13, fontWeight: 700, color: "#fff", padding: "8px 14px",
                  background: day === "THU" ? "#6366f1" : "#f59e0b", borderRadius: 8,
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: 8
                }}>{DAY_LABELS[day]} — Group Stage</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "#fff", borderRadius: 8, padding: 8, border: "1px solid #e2e8f0" }}>
                  {GROUP_GAMES.filter(g => g.day === day).map(g => (
                    <GameRow key={g.id} game={g} score={scores[g.id]} onScoreChange={handleScoreChange} onScoreBlur={handleScoreBlur} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <div>
            {DAY_ORDER.map(day => {
              const dayGroupGames = GROUP_GAMES.filter(g => g.day === day);
              const dayBracketGames = BRACKET_TEMPLATE.filter(b => b.day === day);
              if (dayGroupGames.length === 0 && dayBracketGames.length === 0) return null;
              return (
                <div key={day} style={{ marginBottom: 20 }}>
                  <h3 style={{
                    fontSize: 15, fontWeight: 700, color: "#fff", padding: "10px 16px",
                    background: "linear-gradient(135deg, #1e293b, #475569)", borderRadius: 8,
                    fontFamily: "'JetBrains Mono', monospace", marginBottom: 10
                  }}>{DAY_LABELS[day]}</h3>
                  {dayGroupGames.length > 0 && (
                    <div style={{ background: "#fff", borderRadius: 8, padding: 8, border: "1px solid #e2e8f0", marginBottom: 10 }}>
                      {dayGroupGames.map(g => (
                        <GameRow key={g.id} game={g} score={scores[g.id]} onScoreChange={handleScoreChange} onScoreBlur={handleScoreBlur} />
                      ))}
                    </div>
                  )}
                  {dayBracketGames.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 12 }}>
                      {dayBracketGames.map(b => (
                        <BracketGame key={b.id} tmpl={b} scores={scores} onScoreChange={handleScoreChange} onScoreBlur={handleScoreBlur} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* RANKINGS TAB */}
        {tab === "rankings" && (
          <div>
            <div style={{
              background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #e2e8f0", marginBottom: 16
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                Ranking Criteria
              </h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Teams ranked by: <strong>Wins</strong> (primary), then <strong>Adjusted Point Differential</strong> (biggest loss dropped from differential calculation).
                Ranked within group position tiers: all 1st-place finishers ranked 1-6, then 2nd-place 7-12, then 3rd-place 13-18, then 4th-place 19-24.
                Top 8 → Bracket Play · Seeds 9-20 → Rankings Play · Seeds 21-24 → Eliminated.
              </p>
            </div>
            <OverallRankings scores={scores} />
            {!groupsComplete && (
              <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 14px", marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>⏳</span>
                <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>Provisional rankings — {groupGamesPlayed}/36 group games complete. Final seedings locked when all group results are entered.</span>
              </div>
            )}
          </div>
        )}

        {/* BRACKET TAB - Top 8 */}
        {tab === "bracket" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
              Seeds 1–8 Bracket Play
            </h3>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Quarter-finals → Semi-finals → Championship</p>
            {!groupsComplete && (
              <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>⏳</span>
                <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>Group stage incomplete ({groupGamesPlayed}/36 games). Teams will be seeded into the bracket once all group results are entered.</span>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, color: "#3b82f6", fontWeight: 700, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                Quarter-Finals — Friday
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 12 }}>
                {BRACKET_TEMPLATE.filter(b => b.label.startsWith("QF")).map(b => (
                  <BracketGame key={b.id} tmpl={b} scores={scores} onScoreChange={handleScoreChange} onScoreBlur={handleScoreBlur} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, color: "#8b5cf6", fontWeight: 700, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                Top Eight Elimination — Saturday
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 12 }}>
                {BRACKET_TEMPLATE.filter(b => b.label.startsWith("TE")).map(b => (
                  <BracketGame key={b.id} tmpl={b} scores={scores} onScoreChange={handleScoreChange} onScoreBlur={handleScoreBlur} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, color: "#8b5cf6", fontWeight: 700, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                Semi-Finals — Saturday
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 12 }}>
                {BRACKET_TEMPLATE.filter(b => b.label.startsWith("SF")).map(b => (
                  <BracketGame key={b.id} tmpl={b} scores={scores} onScoreChange={handleScoreChange} onScoreBlur={handleScoreBlur} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOWER BRACKET TAB - Seeds 9-20 */}
        {tab === "lower" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
              Seeds 9–20 Rankings Play
            </h3>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Placement games to determine final positions 9th through 20th</p>
            {!groupsComplete && (
              <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>⏳</span>
                <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>Group stage incomplete ({groupGamesPlayed}/36 games). Teams will be seeded once all group results are entered.</span>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 12 }}>
              {BRACKET_TEMPLATE.filter(b => b.label.startsWith("R-")).map(b => (
                <BracketGame key={b.id} tmpl={b} scores={scores} onScoreChange={handleScoreChange} onScoreBlur={handleScoreBlur} />
              ))}
            </div>
          </div>
        )}

        {/* FINALS TAB */}
        {tab === "finals" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
              Championship Sunday
            </h3>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Final placement matches</p>
            {!groupsComplete && (
              <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>⏳</span>
                <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>Group stage incomplete ({groupGamesPlayed}/36 games). Teams will be seeded once all group results are entered.</span>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
              {BRACKET_TEMPLATE.filter(b => ["7th/8th", "5th/6th", "3rd/4th", "FINAL"].includes(b.label)).map(b => (
                <BracketGame key={b.id} tmpl={b} scores={scores} onScoreChange={handleScoreChange} onScoreBlur={handleScoreBlur} />
              ))}
            </div>

            {/* Final standings summary */}
            <div style={{ marginTop: 24, background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                🏆 Final Standings
              </h4>
              {(() => {
                const positions = [];
                const placings = [
                  [54, "1st", "2nd"],
                  [53, "3rd", "4th"],
                  [52, "5th", "6th"],
                  [51, "7th", "8th"],
                ];
                for (const [gameId, winLabel, loseLabel] of placings) {
                  const r = gameResult(scores, gameId);
                  if (!r) continue;
                  const h = resolveBracketGame(gameId, scores, "home"), a = resolveBracketGame(gameId, scores, "away");
                  if (r.h > r.a) { positions.push({ pos: winLabel, team: h }); positions.push({ pos: loseLabel, team: a }); }
                  else { positions.push({ pos: winLabel, team: a }); positions.push({ pos: loseLabel, team: h }); }
                }

                if (positions.length === 0) return <p style={{ color: "#94a3b8", fontStyle: "italic" }}>Complete the final games to see podium</p>;

                return (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {positions.map(p => (
                      <div key={p.pos} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
                        background: p.pos === "1st" ? "#fef9c3" : p.pos === "2nd" ? "#f1f5f9" : p.pos === "3rd" ? "#fef3e2" : "#f8fafc",
                        borderRadius: 8, border: "1px solid #e2e8f0",
                        boxShadow: p.pos === "1st" ? "0 0 12px rgba(234,179,8,0.3)" : "none"
                      }}>
                        <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", color: p.pos === "1st" ? "#b45309" : "#475569" }}>
                          {p.pos === "1st" ? "🥇" : p.pos === "2nd" ? "🥈" : p.pos === "3rd" ? "🥉" : ""} {p.pos}
                        </span>
                        <TeamBadge code={p.team} />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{p.team ? TEAMS[p.team] : "TBD"}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* EVENT INFO TAB */}
        {tab === "eventinfo" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
              Event Info
            </h3>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Full day-by-day event timelines, game rules, and venue schedules</p>
            <EventSchedule />
          </div>
        )}
      </div>
    </div>
  );
}
