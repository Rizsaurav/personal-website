---
title: "BioTwin: Forecasting Body Battery Before You Feel It"
date: 2026-09-12
author: Saurav Rijal
summary: "A Garmin-first recovery app built at HackRice 2026. It forecasts Body Battery an hour ahead with a ridge model fitted in MATLAB, picks a training window around your calendar, and answers questions by voice from your own data."
tags:
  - ml
  - forecasting
  - matlab
  - agents
  - voice
  - wearables
featured: false
coverImage: "/projects/biotwin/overview.jpg"
visuals:
  - type: pipeline
    kind: "Pipeline"
    after: "How the forecast is built"
    title: "From the watch to a served forecast"
    caption: "Stages as the repository runs them. The fitting steps run offline in MATLAB; the API only reads exported numbers."
    stages:
      - name: "Collect"
        tag: "Garmin Connect export"
        desc: "Heart rate, sleep, stress and Body Battery arrive as Garmin exports and activity files. Garmin Connect is the only data path the project uses."
      - name: "Prepare"
        tag: "5-minute table"
        desc: "Readings are summarised into one table on a 5-minute grid. Gaps stay gaps; they are not filled with the watch's own estimates."
      - name: "Baselines"
        tag: "matlab/s01_baselines.m"
        desc: "Simple rules are scored on the validation split and locked before any learned model is trained."
      - name: "Features and models"
        tag: "s02_features.m, s03_models.m"
        desc: "Features are selected leave-one-day-out, then ridge, bagged, boosted and Gaussian models are compared against the locked baselines."
      - name: "Export"
        tag: "export_forecast_params.py"
        desc: "The winning ridge model is written as coefficients in params_forecast.json. MATLAB is not needed at request time."
      - name: "Serve"
        tag: "modeling/forecast.py"
        desc: "The API scores each request from the latest measured level and the trend, and refuses when the reading is stale."
pull:
  after: "Why it needed to exist"
  text: "Wearables give you numbers. BioTwin gives you understanding."
---

# BioTwin: Forecasting Body Battery Before You Feel It

Garmin watches show a number called Body Battery. It goes down when you are active and up when you rest. What the number does not tell you is what it will be later today, or when the best window to train is. BioTwin is my attempt at that. It was built at HackRice 2026 in a weekend, and the current version in the repository is a Garmin-first recovery app with a forecast, a daily plan and a voice interface.

A note on the repository, since a reader may open it. The public `dev` branch and its README describe the version that was demoed, and some of the newer files, including the voice and calendar agent notes, are documentation ahead of the code. Where something below is a design intent rather than code I could read, I say so.

## What it is

The app has four views: Overview, Signals, Daily plan and Connections. Overview is the twin, a 3D figure with a chat box and a microphone. Signals shows heart rate, sleep, calories and steps from your watch. Daily plan shows the forecast and the training window. Connections is where you import a Garmin `.FIT` activity or a JSON export.

![The Overview screen. The twin answers a question about Body Battery, and the suggested questions include How did I sleep? and When should I work out?](/projects/biotwin/overview.jpg)

The default workspace is a synthetic demo. A new account starts empty, and real measurements are never mixed with synthetic readings. The model card in the repository says the work has not been clinically validated, and it does not diagnose, prescribe or promise outcomes. I agree with that framing, and the rest of this article is written inside it.

## Why it needed to exist

Body Battery is a proprietary composite. BioTwin does not compute it and does not claim to. The app reads what the watch reports and asks a more useful question: given the current level and the recent trend, where will it be in an hour, and does that change the plan for today?

Most wearable apps stop at the reading. A number with no forecast and no plan leaves the person to do the arithmetic, which is most of what the app was supposed to save them.

## How the forecast is built

The model was fitted in MATLAB, and I kept the fitting steps in the repository so the numbers can be reproduced.

The first step is the baselines. Before any learned model was trained, I wrote down a set of simple rules and scored them on the validation split. The table in `matlab/results/BASELINES.md` is fixed rather than recomputed, so later models are measured against the same yardstick. At 30 minutes, the simple extrapolation rule has a mean absolute error of 1.21 points, and a time-of-day rule has 8.88. The rules were locked first so that a learned model would have to beat something real, not just the clock.

The learned model that won at the one-hour horizon is a ridge regression. Its inputs are the measured Body Battery level, its change over the last hour, hour of day as sine and cosine terms, the last heart-rate reading, whether sleep context is present, REM minutes, and the maximum stress reading. On the 791 validation rows, with 4,405 training rows from 23 days, it has an MAE of 1.91, an RMSE of 2.45 and an R² of 0.99. The same file records the comparisons: an extrapolation rule at 2.35, a controls-only model at 2.14, and a boosted-trees model in MATLAB at 1.92. The ridge model is a little worse than boosted trees on this split and much simpler to ship, which is why it was the one exported.

The features were chosen leave-one-day-out, so no day was used to pick the features that were then judged on that same day.

The repository also has a second check. A Python port of each MATLAB step runs against the same files, and the ports agree with the MATLAB results to the stated precision.

## The predictions

The forecast is served from `modeling/forecast.py`. It takes the latest measured level, which must be recent enough to trust, and the hourly trend, and it writes out a short sequence of points. If the latest reading is too old, the endpoint refuses to forecast and says why. A forecast from a stale number would look confident and be wrong, so refusing is the behaviour I wanted.

Readiness, the separate score in the app, is a weighted sum of sleep, heart-rate variability, resting heart rate and a decayed sleep deficit, with weights of 0.35, 0.30, 0.20 and 0.15. The weights come from the engineering specification, not from learned outcomes. Missing signals are renormalised out and reduce confidence rather than being filled in.

The training window is the part a person actually uses. It combines the forecast curve with the calendar and the workout length to pick a block of time. On the day-ahead screen from my test account, the best window was 4:30 to 6:00 PM for a 30-minute mobility session, with a projected energy of 47 and a confidence marked Low. I put the Low label in the screenshot on purpose. The app would rather say it is unsure than pretend to know.

![Day ahead. The forecast curve, the calendar workout marker, and the best training window, with a confidence of Low.](/projects/biotwin/day-ahead.jpg)

Two limits from the model card are worth stating. The one-hour error band on the chart is twice the held-out RMSE, and the model card calls it an error visualisation rather than a calibrated prediction interval. The full-day outlook is a separate, experimental projection, and the app labels it that way.

## The twin and the agent

The twin answers questions from your own data. A question such as "how did I sleep" is routed to the stored sleep and readiness records, and the answer is read back in the twin's voice. The voice path uses ElevenLabs for speech, and the narration is produced on the server, so a visitor on the same network needs no keys of their own.

Calendar actions go through a two-step path, which is the part I am most careful about. The agent can draft an event, and drafting checks the requested slot. Booking re-checks free and busy time, refuses a past event, and uses a derived event ID, so a repeated tool call cannot book the same slot twice. If the time or length is wrong, the reason comes back as a sentence the twin can say out loud, rather than an exception nobody hears.

The repository also has a design note for a coach-and-calendar agent. That note is a plan, and I have not written it up as shipped.

![Signals. Heart rate, sleep, calories and steps from the watch, with the source of each reading.](/projects/biotwin/signals.jpg)

## What makes it different

A wearable's app tells you what happened. BioTwin tries to say what happens next, when the best time to train is, and how sure it is. It also refuses to forecast from a stale reading, keeps measured data separate from simulated data, and reports missing signals instead of covering them up.

I want to be clear about what I can and cannot show. The one-hour result is measured on a validation split from my own data and is reproducible from the repository. The longer-horizon numbers in the pipeline diagram below come from the screenshot I made at the time, and I have not found the matching run in the repository, so I am not presenting them as verified.

![The pipeline, from a watch to a served forecast. The fitting steps run offline in MATLAB; the app reads exported numbers.](/projects/biotwin/pipeline.jpg)

## What was hard

The hard part was refusing to be impressive. It is easy to show a curve that looks right. It is harder to keep the baselines honest, to keep the simulated day separate from the measured one, and to keep the confidence label visible when the data is thin. Garmin also does not offer a partner API, so getting the data in meant working from exports and activity files.

## What I'd do next

- **Score the sealed test split.** The validation numbers are good, but the held-out test split has not been scored yet. That is the number I would trust most.
- **Wire the calendar agent to the plan.** The design note exists. The next step is to connect the draft and confirm path to the training window end to end.
- **Calibrate the band.** The error band is honest but not calibrated. A proper interval needs more than one person's data.
