---
title: "T-Flash: The News, But Spoken"
date: 2025-10-26
author: Saurav Rijal
summary: "A voice-first pipeline that turns live headlines into AI-narrated audio briefings, NewsAPI in, ElevenLabs voice out, orchestrated with n8n and no traditional backend."
tags:
  - ai
  - nextjs
  - tts
  - automation
coverImage: "/blog-covers/cover-tflash.svg"
---

# T-Flash: The News, But Spoken

I read the news on my phone like everyone else, hunched over, scrolling, losing twenty minutes to headlines. On a commute, that doesn't work. I wanted a briefing: pick a topic, press play, get caught up. So I built T-Flash: real-time headlines converted into AI-generated audio.

## Why it needed to exist

Text news assumes your eyes are free. Commuters, multitaskers, runners, and anyone with a visual impairment: get a worse deal. Podcasts exist, but they're not *current* and not *yours*. T-Flash closes that gap: your topics, this morning's headlines, spoken clearly.

## What it does

Pick a category and within seconds:

1. **NewsAPI** fetches live headlines for the topic
2. **Gemini** summarizes them into a tight briefing script
3. **ElevenLabs** converts the script to natural voice
4. **Supabase** stores the audio for instant playback

The twist: there's no traditional backend. The whole pipeline is orchestrated with **n8n workflows**, webhook in, audio out. The web client is Next.js, and there's a Flutter mobile app for listening on the go.

## How I thought of it

I started by asking what the *minimum* backend for this could be. A briefing pipeline is really just a DAG: fetch → summarize → speak → store. Standing up Express servers and job queues for a DAG felt like overkill, and n8n gave me the workflow as a visual artifact I could iterate on in minutes. It was a bet that "backend as workflow" is enough for a whole class of apps, and for this one, it was.

## What I'd do next

Personalized briefing lengths ("give me the 3-minute version"), multi-voice dialogues for debates, and offline caching for subway commutes.
