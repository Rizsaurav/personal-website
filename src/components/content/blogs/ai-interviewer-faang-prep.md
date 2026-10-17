---
title: "FAANG Prep AI: A Mock Interview Room That Listens to Your Code"
date: 2026-05-02
author: Saurav Rijal
summary: "A voice-first mock interview built for a Google interview-prep hackathon. Gemini Live runs the conversation, the editor syncs to the interviewer as you type, and a feedback engine returns a Hire or No Hire verdict."
tags:
  - ai
  - gemini
  - nextjs
  - fastapi
  - voice
featured: false
coverImage: "/projects/interview/landing.jpg"
visuals:
  - type: pipeline
    after: "How a session works"
    title: "From settings to the verdict"
    caption: "Stage names are the routes and modules in the public repo. Descriptions cover the demoed build and the public copy where they differ."
    stages:
      - name: "Token"
        tag: "POST /api/live/token"
        desc: "FastAPI mints a short-lived Gemini Live token. The dashboard requests it while the candidate is still choosing settings."
      - name: "Live session"
        tag: "Gemini Live"
        desc: "The browser opens the WebSocket straight to Gemini. The system prompt sets the interviewer, the problem and the rules for follow-up questions."
      - name: "Mic and VAD"
        tag: "16 kHz PCM"
        desc: "Microphone frames are checked locally for speech and are held back while the interviewer is talking."
      - name: "Code sync"
        tag: "[CODE_UPDATE]"
        desc: "The editor's code is sent to the interviewer as it changes, so follow-ups refer to the candidate's own implementation."
      - name: "Feedback"
        tag: "gemini-2.5-flash"
        desc: "Feedback verdict: on end, one JSON report scores Communication, Code Quality and Problem Solving and returns the decision."
      - name: "Save"
        tag: "Firestore"
        desc: "The report is saved to users/{uid}/sessions/{sessionId}."
pull:
  after: "Why it needed to exist"
  text: "The interviewer had to feel like a person, and the code had to reach it without anyone pressing a button."
---

# FAANG Prep AI: A Mock Interview Room That Listens to Your Code

The README and the final code were not fully pushed to the repository, so the public copy lags the build that was demoed. Where the two differ, I say which one I mean.

Explaining a solution out loud to someone who is watching you type is a different skill from solving the problem alone. FAANG Prep AI is a voice interview room built around that gap. An AI interviewer named Sarah talks with you, follows your code as you write it, asks follow-up questions about your actual implementation, and gives a verdict at the end. Shivendra Bhagat, Aaditya Baniya and I built it as a team of three for a Google interview-prep hackathon, and the team won AI-tool credits as part of the prize. The code is in the `google-interview-prep/` folder: a Next.js 16 frontend and a FastAPI backend.

## What it is

The goal was a real interview environment rather than a chat window. The dashboard lets you pick an interview type, a language, a session length, a difficulty and a company. The coding track gives you a DSA problem in a Monaco editor. The behavioral track asks STAR-style questions and can switch to a coding problem partway through.

Sarah is meant to run the interview the way the chosen company does, in the same mannerisms, and to keep track of the conversation so that her questions come from what you just said. During the session she gives live feedback and cross-questions your answers. The coding prompt asks for progressive hints and for no full solution.

![Landing page of FAANG Prep AI from the local dev server](/projects/interview/landing.jpg)
*The landing page from my local dev server at localhost:3000.*

## Why it needed to exist

Practicing alone skips the part interviews actually test, which is talking through a solution while someone watches. Mock interviews with real engineers are hard to schedule, and text chatbots are asynchronous: you type, you wait, you read. Neither one feels like the room.

So the goal was a session that feels like a call and reacts to the candidate's own work. That pushed two decisions. The conversation had to be voice first, and the code had to be visible to the interviewer without a submit step. The interviewer had to feel like a person, and the code had to reach it without anyone pressing a button.

## How a session works

The setup screen is where a session starts. Choosing settings also starts work in the background.

![Setup screen for choosing the interview type and session settings](/projects/interview/setup.jpg)
*The setup screen: interview type, programming language, session duration and difficulty. The duration choices depend on the interview type in `src/app/dashboard/page.tsx`.*

1. The dashboard calls `POST /api/live/token` as soon as the settings are set, stores the token in `sessionStorage` under `live_token_{sessionId}`, and requests it again when the type, difficulty or resume changes.
2. The interview page (`src/app/interview/page.tsx`) creates a `GeminiLiveClient` from `src/lib/gemini-live.ts`. It reuses the stored token if it is under 50 minutes old.
3. For coding sessions, the backend picks a problem from `backend/tools/problem_bank.py` by difficulty. `get_interviewer_system_instruction` in `backend/tools/gemini_live.py` writes the system prompt with the full problem text inside it.
4. The browser opens the Live WebSocket and sends a setup message. It names the model from the token (the default is `gemini-3.1-flash-live-preview`), asks for audio output with the voice `Aoede`, and turns on input and output transcription and automatic activity detection.
5. The microphone streams 16 kHz PCM as `realtimeInput` audio. Sarah's replies come back as 24 kHz audio plus transcript text, and the transcript is added to the chat panel as each turn completes.

Gemini Live keeps the conversation in its own session, so the app does not run a separate retrieval step. It adds context as text turns:

- **Code.** The editor's code goes to the interviewer as a `[CODE_UPDATE]` message with the language and the full text. The demoed build synced it every second. The public copy uses a trailing debounce: a `useEffect` keyed on `[code, selectedLanguage]` with a 10-second timeout, so a snapshot goes out 10 seconds after the last edit.
- **Silence.** If nothing has happened for 22 seconds in a coding round or 14 seconds in a behavioral round, the client sends a `[SYSTEM]` nudge asking Sarah to fill the pause. It only fires when the mic is on and Sarah is not talking.
- **Round change.** The system instruction is fixed at setup, so switching from behavioral to coding works differently. `transitionToCoding` sends the fetched problem (title, description, examples, constraints) as a user turn that tells Sarah to drop the behavioral questions.

Resume text is cut to 6,000 characters before it goes into the prompt, and the `/api/resume/parse` route caps extracted text at 8,000 characters.

## The latency problem

The main technical challenge we solved was latency in a real-time conversation that mixes voice with the code on screen. A pause that stretches from a few hundred milliseconds to a second or more makes the exchange feel like a bad phone line, and it breaks the interview illusion. The team treated latency as the main constraint from the start.

The repo has no latency measurements, so this article has none. These are the decisions the code makes to keep the loop short:

- **Direct socket.** Audio goes from the browser to Gemini. FastAPI only mints the token, so audio never takes a backend hop.
- **Token prefetch.** The token is requested while the candidate is still on the dashboard, and the interview page reuses it. That skips one round trip at the moment the candidate clicks start.
- **Greeting kickoff.** Two seconds after setup, the client sends a text turn telling Sarah to begin, so the first words do not wait for the candidate to speak.
- **Local voice detection.** Each 4096-sample frame (about 256 ms at 16 kHz) is measured for RMS energy. Speech needs two loud frames in a row. Barge-in needs three frames above a stricter threshold, and it is ignored for the first 500 ms of Sarah's audio so her own voice coming through the speakers does not cut her off.
- **Playback gate.** Mic frames are not sent while Sarah is talking, and not for 300 ms after she stops. Without this, the speaker's audio goes back into the mic and the model treats it as the candidate.
- **Resampling.** Some browsers, including iOS Safari, ignore the 16 kHz request. When the device rate differs, the client downsamples to 16 kHz before sending.

The setup also sets `silenceDurationMs` to 4000, so the server waits four seconds of silence before it closes a turn. That gives a candidate room to think, and it is a trade against responsiveness.

## How feedback and the verdict are decided

When the candidate ends the session, the browser posts the transcript, the final code and language, the time used, and three conduct counters (seconds with the mic off, seconds with the camera off, and breaks taken) to `/api/interview/{sessionId}/generate-feedback`.

The backend sends one prompt to gemini-2.5-flash in `backend/main.py`. The prompt asks the model to act as a staff engineer serving as a bar raiser, to score the candidate the way a senior engineer would, and to return JSON only. The fields it asks for are:

- **Communication:** clarity and approach, each 1 to 5, plus an estimate of hints used.
- **Problem Solving and Code Quality:** for coding rounds, 1 to 5 each, along with code correctness, detected and optimal time and space complexity, and an optimal solution.
- **Code annotations:** 4 to 8 notes that point to line numbers in the candidate's code, marked as warning, suggestion, info or praise.
- **Engagement:** eye contact and confidence, each 1 to 5, and five written recommendations.

The verdict is the `overallDecision` field. The demoed build reported Hire or No Hire. The public prompt asks for one of four labels (Hire, Lean Hire, Lean No Hire, No Hire) together with a 0 to 100 score. In the public copy, the engagement scores come from the transcript and the conduct counters only, because no video frames are sent to the backend.

The report is kept in `sessionStorage` and written to Firestore at `users/{uid}/sessions/{sessionId}`. The feedback page reads `sessionStorage` first, then Firestore, then the backend.

## What was not finished or pushed

These are the gaps between the demoed build and the public copy, plus the work I would do next.

- **Company-specific prompts.** The public interviewer prompt reads as a single generic Google style because the per-company prompts were not pushed. The company picker currently filters the practice question list in Firestore and does not change how Sarah interviews.
- **Run button.** The public copy's Run button returns hardcoded sample results. `backend/tools/judge0.py` and `/api/code/run` exist, but the interview page does not call them yet.
- **Verdict bands.** The score ranges for each label are written in `backend/agents/feedback_generator.py`, an ADK agent file the public backend does not import. They belong in the live prompt.
- **Session state.** The backend keeps live session state (problem, transcript, code snapshots) in an in-memory dictionary, so it does not survive a server restart.
- **Latency measurements.** The next useful step is to log the time from the end of the candidate's speech to the first audio chunk, so the latency decisions above can be tuned against numbers.
