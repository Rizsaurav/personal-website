---
title: How I built a Soccer Highlights Generator
date: 2025-08-02
author: Saurav Rijal
authorImage: /images/authors/saurav.jpg
tags:
  - blogging
  - react
  - scalability
  - markdown
---

# Soccer Highlights Generator

Automatically generate **10-minute soccer highlight reels** using **audio-based excitement detection** and **computer vision scene analysis**.  
The system pairs a **FastAPI** backend with a **Next.js** frontend and uses a **scene classifier (BRIEF + k-Means BoVW)** to identify high-action segments.  
Video cutting and merging are handled in Python via **MoviePy**.

---

## Overview

Creating great highlights manually is slow and inconsistent.  
This project automates the process by analyzing **audio spikes** (crowd noise, commentary surges) and **visual cues** (attacking play, replays, celebrations), then stitching segments together while preserving **context** before and after key moments.  
The result is a natural, watchable **~10-minute** highlight reel.

---

## Features

- 🎧 **Audio Excitement Detection (Librosa):** Detects energetic moments using RMS/energy peaks and smoothed thresholds.  
- 🎥 **Scene Classification (OpenCV + scikit-learn):** BRIEF descriptors + **k-Means Bag-of-Visual-Words** to score action intensity per segment.  
- 🕒 **Context Preservation:** Adds pre/post buffers to retain buildup and aftermath.  
- 💻 **Web UI (Next.js):** Upload, monitor, and play results seamlessly.  
- ⚙️ **FastAPI Backend:** Reliable endpoints for upload, process, and retrieval.  
- 🎬 **MoviePy Pipeline:** Programmatic cutting and concatenation in Python.  
- 💾 **File-Based Storage:** Inputs, outputs, and intermediates saved to disk (no external DB).

---

## Tech Stack

**Frontend:** Next.js (React), HTML, CSS, JavaScript  
**Backend:** FastAPI (Python)  
**Audio/Video/CV:** Librosa, MoviePy, OpenCV  
**ML:** scikit-learn (k-Means BoVW), NumPy  
**Storage:** File system (`uploads/`, `processed/`, `models/`)

---

## Workflow (Summary)

1. **Upload:** User submits a `.mp4` via the Next.js UI → FastAPI saves to `uploads/`.  
2. **Audio Analysis:** Librosa computes per-frame energy and finds excitement spikes.  
3. **Visual Analysis:**  
   - Sample frames per time window.  
   - Extract **BRIEF** descriptors; convert to **BoVW** using a k-Means codebook.  
   - Score segments for action intensity.  
4. **Segment Selection:** Merge audio peaks + visual scores, apply non-max suppression and spacing.  
5. **Context Windows:** Expand segments with pre/post buffers.  
6. **Editing:** Use **MoviePy** to `subclip(...)` and `concatenate_videoclips(...)`.  
7. **Output:** Write final **~10-minute** highlight to `processed/{job_id}.mp4`.

---

## How It Works

The system processes full-match videos through a multi-stage pipeline that combines audio signal processing, computer vision, and machine learning to automatically identify and extract exciting moments.

### 1. Video Upload & Job Initialization

The user uploads a full soccer match video through the **Next.js web interface**.  
The frontend sends the file via a POST request to the FastAPI backend, which:

- Generates a unique **job ID** for tracking  
- Saves the video to the `uploads/` directory  
- Initializes processing metadata  
- Returns the job ID to enable status polling

---

### 2. Audio Analysis Pipeline

The audio track is extracted and analyzed using **Librosa** to detect excitement peaks.

#### Audio Feature Extraction
- The audio waveform is loaded at **22kHz** sample rate.  
- Frame-by-frame **Root Mean Square (RMS)** energy is computed to measure intensity.  
- RMS values are smoothed using a **moving average filter** to reduce noise and create stability.

#### Peak Detection
- A **dynamic threshold** is calculated from the energy distribution.  
- Peaks above the threshold are marked as excitement moments.  
- Nearby peaks are merged to avoid redundancy.  
- Each peak gets a **confidence score** based on amplitude and duration.

**Output:** A list of time intervals with corresponding audio excitement scores.

---

### 3. Visual Analysis Pipeline

In parallel with audio processing, video frames undergo computer vision analysis to classify scene intensity.

#### Frame Sampling
- The video is divided into **fixed windows** (e.g., 5 seconds).  
- Key frames are extracted using **OpenCV**, converted to grayscale, and normalized.

#### Feature Extraction (BRIEF Descriptors)
- **BRIEF (Binary Robust Independent Elementary Features)** are computed on keypoints detected via a fast corner detector.  
- Descriptors from all frames in a window are pooled together.

#### Bag-of-Visual-Words (BoVW) Encoding
- A pre-trained **k-Means codebook** (visual vocabulary) is loaded from `models/`.  
- Each BRIEF descriptor is assigned to its nearest cluster center.  
- A **normalized histogram** of cluster frequencies forms the BoVW feature vector.

#### Scene Classification
- The BoVW feature vector is passed into a **trained Logistic Regression / SVM** classifier.  
- It outputs an **action intensity score (0–1)** — high for attacking play or celebrations, low for static or calm scenes.

**Output:** A list of time windows with visual action scores.

---

### 4. Multi-Modal Fusion & Segment Selection

Audio and visual signals are merged to produce the final highlight segments.

#### Score Fusion
`final_score = α × audio_score + β × visual_score`  
Scores are normalized to a common scale; weights α and β are tunable.

#### Candidate Filtering
- **Non-maximum suppression** removes overlapping segments.  
- Minimum temporal spacing ensures variety.  
- Top-ranked segments are selected for ~10 total minutes.

#### Context Window Expansion
- Each segment expands with pre/post buffers (5–10s before, 3–5s after).  
- Overlapping segments are merged to avoid repetition and preserve narrative flow.

**Output:** Final list of (start, end) timestamps for highlight extraction.

---

### 5. Video Editing & Rendering

Selected segments are extracted and merged using **MoviePy**.

#### Clip Extraction
Each segment interval → `VideoFileClip.subclip(start, end)` (audio preserved).

#### Concatenation
- All clips concatenated via `concatenate_videoclips()`  
- Optional fade transitions and audio crossfades for smooth playback.

#### Export
- Final composite rendered to `processed/{job_id}.mp4`  
- Encoded with **H.264** for web playback.  
- Metadata (duration, segment count, scores) logged for monitoring.

**Output:** A polished **~10-minute highlight reel**.

---

### 6. Result Delivery

The frontend polls the backend using the job ID.  
Once processing completes:

- The status updates to **"ready"**.  
- Users can **stream or download** the highlight video.  
- Processed videos are cached for a configurable retention period.

---

## Model Training (Scene Classifier)

**Goal:** Classify time windows into *high-action* vs. *normal play*.

1. **Data Prep:** Extract labeled frames/windows (goals, chances, fouls, replays).  
2. **Descriptors:** Compute **BRIEF** on keypoints per frame.  
3. **Codebook:** Cluster descriptors using **k-Means (k=256/512)** → visual vocabulary.  
4. **BoVW Vectors:** Quantize descriptors into histograms per window.  
5. **Classifier:** Train a **Logistic Regression / Linear SVM** on BoVW vectors.  
6. **Persistence:** Save the **codebook**, **scaler**, and **classifier** to `models/` for inference.

---

## Results (Example Metrics)

- **+20% improvement** in highlight localization vs. audio-only baseline  
- Smooth viewing flow via **context buffers**, minimizing abrupt cuts  
- A typical **90-min match** → concise **~10-min** reel with strong event coverage

---

## Future Improvements

- **Persistence & Metadata:** Add SQLite for job tracking and analytics.  
- **Richer Audio Features:** Use MFCC deltas, spectral roll-off, crowd vs. commentary separation.  
- **Model Upgrade:** Explore shallow CNNs or MobileNet features with temporal pooling.  
- **UX Enhancements:** In-browser segment preview and manual fine-tuning.  
- **Batch Mode:** CLI for multi-match processing and playlist generation.

---
