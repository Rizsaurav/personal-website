---
title: "VideoMaxx: Teaching an Army of AI Agents to Produce a Whole YouTube Video"
date: 2026-05-30
author: Saurav Rijal
summary: "Give it a topic, get back a finished video, researched, fact-checked, narrated, animated, and uploaded. Here's how I built a 15-stage agentic production pipeline that runs entirely on my laptop."
tags:
  - ai-agents
  - python
  - llm
  - video
featured: true
coverImage: "/blog-covers/cover-videomaxx.jpg"
---

# VideoMaxx: Teaching an Army of AI Agents to Produce a Whole YouTube Video

Making a single good YouTube video is a production pipeline: research, script, fact-check, gather assets, record narration, animate graphics, edit, caption, cut Shorts, upload. I wanted to know, could AI agents do *all* of it? Not assist. Do it. `vidmaxx new "topic"` in, finished `.mp4` out.

## Why it needed to exist

Every "AI video generator" I'd tried was a black box that hallucinated facts with total confidence. That was the real problem to solve: not generating video, but generating video **you can trust**. If an agent pipeline invents statistics, it's worse than useless, it's misinformation with nice transitions.

So I designed VideoMaxx around one non-negotiable rule: **no unverified claim ever reaches the render stage.** The pipeline has a fact-freezing step where every claim is cross-verified and SHA-256 hashed into a fact sheet committed to SQLite. If the hash doesn't match at render time, the build stops. Tamper-evident video production.

## What it does

One command runs 15 sequential stages:

1. **Research**: Gemini 2.5 Pro with Google Search grounding, in a two-pass Finder → Architect pattern
2. **Verify**: every source URL cross-checked via Tavily
3. **Freeze**: fact sheet hashed and committed; hallucinated claims hard-block the pipeline
4. **Architect / Critic / Optimizer**: the script gets a 9-scene structure, then an LLM self-review pass flags factual drift, pacing issues, and weak hooks, and an optimizer rewrites the flagged beats
5. **Assets**: multi-source fetch (Wikimedia → Archive.org → Pexels → Pixabay), then CLIP ViT-B/32 semantically ranks assets against each sentence
6. **TTS**: Kokoro-82M narrates, faster than real-time on Apple Silicon
7. **Alignment**: WhisperX forced alignment for word-level timestamps
8. **Render**: FFmpeg, chapter-parallel, plus an automatic YouTube Shorts cut and upload via the YouTube Data API

The part I'm proudest of: five specialized **Manim animation agents** running in parallel (asyncio semaphore), each generating custom data visualizations per sentence. The video doesn't just show stock footage, it draws its own charts.

Everything is deterministic and resumable. Crash mid-run, fix the issue, re-run, and it picks up exactly where it left off.

## How I thought of it

I'd been watching the "agent" discourse and felt most demos were toys, a chatbot calling two tools. I wanted a stress test: a task with *fifteen* dependent stages where one bad output poisons everything downstream. Video production is that task. The architecture insight was treating it like a compiler pipeline, each stage a pure transformation with validated inputs and outputs, checkpoints between stages, and a verifier (the fact-freeze) acting like a type checker for truth.

## What I'd do next

Multi-speaker dialogue scenes, better music scoring, and a web dashboard for monitoring long runs. The pipeline works; now it's about taste.
