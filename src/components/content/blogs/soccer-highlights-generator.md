---
title: "Teaching a Computer to Edit Soccer Highlights"
date: 2025-07-12
author: Saurav Rijal
summary: "Audio excitement detection plus computer-vision scene classification turns full matches into 10-minute highlight reels, automatically."
tags:
  - computer-vision
  - machine-learning
  - fastapi
  - nextjs
coverImage: "/blog-covers/cover-soccer-highlights.jpg"
---

# Teaching a Computer to Edit Soccer Highlights

A 90-minute match compresses to a 10-minute highlight reel. Human editors do it by feel: the crowd roars, the commentator's voice spikes, the camera cuts to a replay. I wondered if I could formalize "feel", detect excitement in the audio, detect action in the video, and let an algorithm make the cuts.

## Why it needed to exist

Manual highlight editing is slow and inconsistent. Two editors cut the same match differently, and the process doesn't scale to the thousands of amateur and semi-pro matches that never get highlights at all. The interesting question: is "exciting" measurable? Crowd noise says yes.

## What it does

Upload a full match; get back a ~10-minute reel:

- **Audio excitement detection (Librosa)**: RMS energy peaks and smoothed thresholds find the moments the stadium erupts: goals, near-misses, controversial calls
- **Scene classification (OpenCV + scikit-learn)**: BRIEF descriptors with a k-Means bag-of-visual-words model scores action intensity per segment: attacking play, replays, celebrations
- **Context preservation**: cuts include pre/post buffers around key moments, so you see the buildup and the aftermath, not just the goal
- **Full-stack delivery**: FastAPI backend for upload/process/retrieve, Next.js frontend to monitor progress and play the result, MoviePy cutting the video programmatically

## How I thought of it

The core insight came from watching matches on mute: without audio, highlights are much harder to spot. That told me audio is the primary excitement signal and video is the confirmation, not the other way around. So the architecture detects candidate moments in the audio stream first (cheap), then spends the expensive computer-vision compute only on those candidates. It's a cascade, like a hiring funnel: audio screens, vision interviews.

## What I'd do next

Player tracking, automatic scoreboard OCR for event labels, and a "controversy detector" trained on referee-whistle plus crowd-groan patterns.
