---
kind: research
title: "What Waiting Buys: Live Soccer Game State Reconstruction"
date: 2026-10-17
author: Saurav Rijal
summary: "I built a causal game state reconstruction pipeline. On 49 SoccerNet test clips it scores 34.6 GS-HOTA live and 43.6 with the whole clip, at 32 FPS on one H100."
tags:
  - research
  - computer-vision
  - sports-analytics
  - real-time-systems
featured: true
coverImage: "/blog-covers/cover-what-waiting-buys-live-gsr.svg"
visuals:
  - type: bars
    after: "Results"
    title: "GS-HOTA vs output delay"
    unit: ""
    max: 50
    caption: "End-to-end GS-HOTA on 49 SoccerNet-GSR test clips, settings frozen from validation."
    data:
      - { label: "Live", value: 34.6, display: "34.6" }
      - { label: "1 s", value: 37.1, display: "37.1" }
      - { label: "5 s", value: 39.9, display: "39.9" }
      - { label: "10 s", value: 42.1, display: "42.1" }
      - { label: "Whole clip", value: 43.6, display: "43.6" }
---

# What Waiting Buys: Live Soccer Game State Reconstruction

![Broadcast frame turning into a top-down minimap, player dots in coral and white](/blog-covers/what-waiting-buys-cinematic.webp)
*Broadcast in, minimap out. One feed, every player position, team, role, and jersey number.*

Published game state reconstruction systems run offline. They cluster teams over the whole clip, read jersey numbers anywhere in a track and paint them back, and merge tracklets after the fact. They report accuracy without speed. A live system cannot do any of that, so I asked a narrow question: how much accuracy does each second of output delay buy, and where does it come from?

## The problem

Game state reconstruction turns one moving broadcast feed into a top-down minimap: every player pitch position, identity, team, role, and jersey number. The metric, GS-HOTA, credits a predicted player only when its pitch position and all attributes are correct. One wrong jersey number or team side zeroes the match. Offline systems win by using the whole clip. Live broadcast graphics already delay output by a bounded amount. I measured what that delay is worth.

## What I built

Every decision is causal. A YOLO26s detector fine-tuned on SoccerNet-GSR with four classes (player, goalkeeper, referee, ball) gives roles. McByte tracking uses camera-motion compensation shared with keyframe pitch calibration. PnLCalib calibrates every 10th frame, and optical flow propagates the homography between keyframes. Teams come from online torso-colour clustering, refit every second. Jersey numbers come from confidence-gated voting over pose-guided torso crops, committed only once evidence passes a threshold. Nothing sees beyond the output delay.

![Pipeline walkthrough, broadcast to minimap, jersey numbers commit as delay grows](/blog-covers/pipeline-walkthrough.gif)
*How it works. Waiting commits jersey numbers.*

## Results

On the 49 labeled SoccerNet test clips, with settings frozen from validation, GS-HOTA rises from 34.6 live to 37.1 at 1 s, 39.9 at 5 s, 42.1 at 10 s, and 43.6 with the whole clip.

```stat
34.6 GS-HOTA | live, 0 s delay on 49 test clips
37.1 GS-HOTA | 1 s delay, plus 2.5 over live (95% CI 2.1 to 2.9)
43.6 GS-HOTA | whole clip, plus 9.0 over live
```

Paired gains over live: plus 2.5 at 1 s (95% CI 2.1 to 2.9), plus 5.3 at 5 s, plus 9.0 for the whole clip. The first second recovers 28% of the live-to-offline gap. Ten seconds recovers 84%.

Delay helps unequally. On validation, with every other attribute from ground truth, jersey recognition gains 17.3 points from live to whole clip, team assignment gains 9.1, and calibration is flat. Jersey numbers are legible only now and then, so evidence keeps arriving for seconds. Team colour settles in about 10 s.

Speed: perception stages sustain 32 FPS on one H100 with the jersey reader running concurrently, at 56 ms median and 64 ms p95 latency. That is above the 25 FPS broadcast rate.

![GS-HOTA vs output delay, bars animating from live to whole clip](/blog-covers/gshota-delay.gif)
*GS-HOTA vs delay on 49 test clips. The first second recovers 28% of the gap.

## What did not help

Better tracking barely moved the score. McByte with shared camera-motion compensation cut identity switches from 3,462 to 2,015 versus ByteTrack, but GS-HOTA moved by under 1 point. Attributes dominate, not tracks.

A fine-tuned jersey reader did not help either. Fine-tuning PARSeq raised exact accuracy on held-out legible crops from 81.0% to 90.6%, but test GS-HOTA stayed flat (34.7 live and 43.0 whole clip, versus 34.6 and 43.6). The remaining jersey loss is coverage and identity breaks, not misreads.

## Limitations

These are public test split numbers, not the hidden challenge split, so they are not directly comparable to the leaderboard. Offline winners score about 64 on the hidden challenge split, a different split. Each configuration was trained and run once, so run-to-run variance is not in the intervals. Speed is measured on one clip and one GPU type. The detector and jersey reader are trained only on SoccerNet broadcast footage, with no evaluation on other leagues, camera setups, or amateur video yet.

![Technical infographic, pipeline, GS-HOTA vs delay, speed, error budget, what did not help](/blog-covers/infographic-what-waiting-buys.png)
*Full picture. Pipeline, delay curve, speed, error budget, and negative results.*

Code and full paper: [github.com/Rizsaurav/realtime-sports-vision](https://github.com/Rizsaurav/realtime-sports-vision)
