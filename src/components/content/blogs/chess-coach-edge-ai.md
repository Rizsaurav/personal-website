---
title: "I Built a Chess Coach That Lives Entirely on the Edge"
date: 2026-05-02
author: Saurav Rijal
summary: "A chess app where the engine, the AI coach, and the database all run on Cloudflare's edge — with move feedback in under a millisecond and Llama 3.3 coaching on demand."
tags:
  - ai
  - cloudflare
  - react
  - chess
featured: true
---

# I Built a Chess Coach That Lives Entirely on the Edge

Most chess apps are a frontend stapled to a server. I wanted to see how far the edge could go: frontend, API, LLM inference, and session storage — all on Cloudflare, no external services, no separate backend. The result is Chess Coach, live at chess-coach.rizsaurav.workers.dev.

## Why it needed to exist

I was learning chess and noticed a gap. Playing bots teaches pattern recognition, but bots don't *teach* — they just beat you silently. Human coaches explain. I wanted the middle ground: an opponent that plays at your level *and* explains itself like a coach, available instantly, with zero setup.

## What it does

- **Play vs CPU** at five ELO-calibrated levels (800 → 1800), powered by a client-side minimax engine with alpha-beta pruning and difficulty-tuned noise so each level genuinely feels like its rating
- **Instant move classification** — every move gets labeled Best ★ / Good ✓ / Inaccuracy ?! / Mistake ? / Blunder ??, computed locally in under a millisecond with no network call
- **On-demand AI coaching** — hit "Analyse this move" and Llama 3.3 70B (via Workers AI) writes a natural-language critique with a concept tag, an eval score, and a best-move arrow drawn on the board
- **Play vs Friend** with auto board-flip, live eval bar, and full move history with classification symbols

Session state lives in SQLite-backed Durable Objects, static assets serve through Workers Assets. The whole thing — inference included — never leaves Cloudflare's network.

## How I thought of it

The key decision was splitting "fast feedback" from "deep feedback." Move classification had to feel instant, so it runs as a local heuristic — no round trip. The LLM is reserved for what it's actually good at: explaining *ideas* in words. That split is the whole UX: the app feels instant because the slow thing (the 70B model) only runs when you ask for depth.

The ELO calibration was the fun hard part. Raw minimax strength isn't a rating — I had to tune search depth plus calibrated noise so that "1200" actually plays like a 1200: solid tactics, shaky endgames, occasional blunders. Playtesting against my own games was the calibration loop.

## What I'd do next

Opening repertoire trainer, puzzle generation from your own blunders, and PGN export. The coaching loop is there — now I want it to remember you across sessions.
