---
title: "TRAC: Catching Cheaters With Autoencoders and Simulated Eyes"
date: 2026-05-09
author: Saurav Rijal
summary: "An ML pipeline for detecting cheating behavior: gaze simulation with MediaPipe, autoencoder anomaly detection, and RL agents modeling gaze dynamics."
tags:
  - machine-learning
  - computer-vision
  - pytorch
  - reinforcement-learning
---

# TRAC: Catching Cheaters With Autoencoders and Simulated Eyes

Online exams have a trust problem. Proctoring software mostly watches for tab switches — crude, invasive, and easy to game. I wanted to explore whether *behavioral* signals, specifically gaze, could flag suspicious test-taking more intelligently.

## Why it needed to exist

Rule-based proctoring ("looked away more than 5 times = cheating") punishes honest nervous behavior and misses clever cheating. Human proctors don't count glances — they sense *patterns*. Machine learning can learn patterns; hardcoded rules can't. The question was whether gaze dynamics contain enough signal to separate honest from dishonest behavior.

## What it does

TRAC is a full ML pipeline:

- **Gaze simulation (MediaPipe)** — generates synthetic gaze trajectories so the system can be developed and tested without harvesting real students' eye data
- **Autoencoder anomaly detection (PyTorch)** — learns what normal test-taking behavior looks like, then flags deviations as anomalies
- **Reinforcement learning (stable-baselines3, Gymnasium)** — agents model gaze dynamics as a sequential decision process
- **Training, evaluation, visualization, and demo tooling** — the whole loop from experiment to interpretable output

The autoencoder approach matters: instead of defining "cheating" top-down, the model learns "normal" bottom-up, and anything sufficiently weird gets flagged for human review. It's triage, not verdict.

## How I thought of it

The privacy angle drove the design. Real gaze data from real students is sensitive and hard to obtain ethically — so I simulated it. That constraint became a feature: a simulator means unlimited training data, edge cases on demand, and experiments no IRB would approve on humans. Simulation-first development is underused in ML, and this was my proof it works.

## What I'd do next

Calibrate against real (consented, anonymized) proctoring datasets, add uncertainty quantification so flags come with confidence intervals, and write the ethics section this project clearly deserves.
