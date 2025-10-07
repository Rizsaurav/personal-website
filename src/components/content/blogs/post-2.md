# Soccer Highlights Generator

Automatically generate **10-minute soccer highlight reels** using **audio-based excitement detection** and **computer vision scene analysis**. The system pairs a **FastAPI** backend with a **Next.js** frontend and uses a **scene classifier (BRIEF + k-Means BoVW)** to identify high-action segments. Video cutting/merging is handled in Python via **MoviePy**.

---

## Overview
Creating great highlights manually is slow and inconsistent. This project automates the process by analyzing **audio spikes** (crowd noise, commentary surges) and **visual cues** (attacking play, replays, celebrations), then stitching segments together while preserving **context** before and after key moments. The result is a natural, watchable **~10-minute** highlight reel.

---

## Features
- **Audio Excitement Detection (Librosa):** Finds energetic moments using RMS/energy peaks and smoothed thresholds.  
- **Scene Classification (OpenCV + scikit-learn):** BRIEF descriptors + **k-Means Bag-of-Visual-Words** to score action intensity per segment.  
- **Context Preservation:** Adds pre/post buffers to avoid choppy cuts and keep buildup/aftermath.  
- **Web UI (Next.js):** Upload videos, monitor processing status, and play/download results.  
- **FastAPI Backend:** Simple, reliable endpoints for upload, process, and retrieval.  
- **MoviePy Pipeline:** Cuts and concatenates clips programmatically in Python.  
- **File-Based Storage:** Inputs/outputs and intermediate artifacts saved to disk (no external DB).

---

## Tech Stack
**Frontend:** Next.js (React), HTML, CSS, JavaScript  
**Backend:** FastAPI (Python)  
**Audio/Video/CV:** Librosa, MoviePy, OpenCV  
**ML:** scikit-learn (k-Means BoVW), NumPy  
**Storage:** File system (uploads/, processed/, models/)

---

## Workflow
1. **Upload**: User submits a `.mp4` via the Next.js UI → FastAPI saves to `uploads/`.  
2. **Audio Analysis**: Librosa computes per-frame energy and finds excitement spikes.  
3. **Visual Analysis**:  
   - Sample frames per time window.  
   - Extract **BRIEF** descriptors; convert to **BoVW** using a k-Means codebook.  
   - Score segments for action intensity.  
4. **Segment Selection**: Merge audio peaks + visual scores, apply non-max suppression and minimum spacing.  
5. **Context Windows**: Expand each selected segment with pre/post buffers.  
6. **Editing**: Use **MoviePy** to `subclip(...)` and `concatenate_videoclips(...)`.  
7. **Output**: Write final **~10-minute** highlight to `processed/{job_id}.mp4`.

---

## Model Training (Scene Classifier)
**Goal:** Classify time windows into *high-action* vs. *normal* play.

1. **Data Prep:** Extract labeled frames/windows from matches (goals, chances, fouls, replays).  
2. **Descriptors:** Compute **BRIEF** on keypoints per frame.  
3. **Codebook:** Cluster descriptors with **k-Means** (k = *N*, e.g., 256/512) to build a visual vocabulary.  
4. **BoVW Vectors:** Quantize descriptors to histogram features per window.  
5. **Classifier:** Train a lightweight model (e.g., Logistic Regression / Linear SVM) on BoVW features.  
6. **Persistence:** Save codebook + scaler + classifier to `models/` for inference.  

---

## Results (Example Metrics)
- **+20%** improvement in correct highlight localization vs. audio-only baseline.  
- Smooth viewing flow due to **context buffers**, reducing abrupt cuts.  
- Typical 90-min match processed into a **~10-min** reel with strong event coverage.

---

## Future Improvements
- **Persistence/Metadata:** Add SQLite to track jobs, durations, and quality scores.  
- **Richer Audio Features:** Spectral roll-off, MFCC deltas, crowd vs. commentary separation.  
- **Model Upgrade:** Try a shallow CNN or MobileNet features with temporal pooling.  
- **UX:** In-browser preview of candidate segments with manual fine-tuning before export.  
- **Batch Mode:** CLI for processing multiple matches and producing a playlist.

---

## Contributing
Contributions are welcome! Open an issue to discuss improvements or submit a PR with a clear description, test data, and before/after results.

---

## License
Distributed under the **MIT License**. See `LICENSE` for details.
