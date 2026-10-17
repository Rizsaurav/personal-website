---
title: "PlayScript: Turning Romeo & Juliet Into a Game, With a Crew of Agents"
date: 2026-09-20
author: Saurav Rijal
summary: "PlayScript turns a classic book into a playable, chapter-by-chapter story. You play a character, make decisions, and get an analysis of how far you strayed. The shipped Romeo & Juliet build is a native SwiftUI app with 19 beats and three decisions, built from scenes and audio made by a crew of agents."
tags:
  - swift
  - swiftui
  - ios
  - agents
  - agentic
  - interactive-fiction
  - elevenlabs
  - lottie
featured: false
coverImage: "/blog-covers/cover-playscript.svg"
visuals:
  - type: pipeline
    kind: "Architecture"
    after: "How the agents work"
    title: "From a classic book to a playable scene"
    caption: "Agent roles follow the author's account of the system, in the order it lists them. The scripts and the app are in the public repository; the agents are not (see How it is built)."
    stages:
      - name: "Director agent"
        tag: "two passes"
        desc: "Plans each scene as a playable chapter. Its draft goes to the scene critic."
      - name: "Scene critic"
        tag: "two passes"
        desc: "Reviews the director's draft, and its notes go back into the second pass."
      - name: "Visual director"
        tag: "two passes"
        desc: "Sets the look of each scene, with its own two passes."
      - name: "Animation agent"
        tag: "Lottie and SVG"
        desc: "Builds Lottie animations and reusable SVGs in the background for a cinematic look."
      - name: "Voice agents and speech agent"
        tag: "ElevenLabs"
        desc: "Produce emotive text-to-speech on the go, with an ElevenLabs model."
      - name: "Scripting agent"
        tag: "scripts"
        desc: "Writes the script that the scenes are built from."
      - name: "Narration and score scripts"
        tag: "create_narration.py"
        desc: "In the public repo: generate 25 narration clips and five mood cues with seven effects, reusing cached clips when text and settings match."
      - name: "Lottie and project scripts"
        tag: "create_lottie.py"
        desc: "In the public repo: write six Lottie JSON files with the standard library, then add the Swift files and generated resources to the Xcode project."
      - name: "Story engine"
        tag: "StoryCore"
        desc: "StoryRun moves through the 19 beats in a fixed order. A choice changes the flavor text, not the destination."
      - name: "Playback"
        tag: "AVFoundation, Lottie"
        desc: "The app plays the bundled files offline: NarrationPlayer highlights words, Soundscape crossfades the mood loops, and LivingScene and LottieLayer draw each setting."
pull:
  after: "Why it needed to exist"
  text: "Books often end with us thinking the ending should have been different, or that a character would have changed had he gotten another chance."
---

# PlayScript: Turning Romeo & Juliet Into a Game, With a Crew of Agents

PlayScript is a literary interactive-fiction game. It turns a classic book into playable, bite-sized, chapter-by-chapter scenes. You play a character and make decisions as you go. At the end you get an analysis of how far you strayed from the original story, and of what your decisions say about you. I built it for the TXST Shipathon.

The shipped build plays *Romeo & Juliet* through Juliet's eyes, as a native SwiftUI app for iOS 18 and later.

## What it is

The Romeo & Juliet build has 19 beats and three decisions. It ends with a closing reflection and a "What if" scene that follows Romeo. You read in short beats, tap to turn the page, and choose at the decision points. The app runs offline. The narration, music, and animation are bundled inside it, and the app makes no account, API key, or network calls at play time.

![The library home screen with the Romeo & Juliet card, a story labeled 8 to 10 minutes, and the "Book Library" heading above it.](/projects/playscript/library.jpg)

The library also has an "On the horizon" shelf for other books. In this build those titles are marked Coming soon.

![The "On the horizon" shelf. Sherlock Holmes, Dracula, Vampire Diaries, and Lord of the Rings are each marked Coming soon.](/projects/playscript/horizon.jpg)

## Why it needed to exist

Books often end with us thinking the ending should have been different, or that a character would have changed had he gotten another chance. PlayScript is built for that feeling. It lets you play inside the book, make the choices a character did or did not make, and reimagine the scenarios the book left closed.

It is also a way to change how we read. Reading is mostly passive. PlayScript keeps the original text as the spine of the story and asks the reader to make decisions along it.

The shipped build handles the story with care. The main telling keeps the secret marriage, Tybalt's death, the banishment, the arranged marriage to Paris, the sleeping potion, the letter that never arrives, and the tragic ending. Death has no graphic imagery. The "What if" sequence at the end is counterfactual, and the app says so.

## How the story plays

Each beat is one of four kinds: narration, a decision, the "What if" page, or the closing reflection. The engine checks the content when it loads. A decision must have exactly two choices, only decisions may have choices, and the story must end with a reflection.

![A narration beat showing the chapter, progress at 1 of 19, the narrator text, and a Voice on control. The highlighted word is the one being read aloud.](/projects/playscript/story.jpg)

There are three decisions. At the window, Juliet either leans into the moonlight or stays hidden to listen. At the vow, she either says her heart is already his or asks him to tell her he is certain. At the potion, she either steadies herself for "To our tomorrow" or admits she is afraid and still his. Both potion choices end with her drinking.

![A decision beat with two choices under the heading "Let your heart answer". Each choice has its own flavor text, and both lead to the same next beat.](/projects/playscript/choices.jpg)

The design intent goes further than the shipped build. In the author's account, the story also records your path, and at the end you see how far it moved from the original and what your decisions say about you. A personality read is part of that design. The shipped build's closing screen shows only a fixed reflection line, "Some letters hold a whole lifetime," and does not yet show that analysis.

In the shipped build, a choice never changes where the story goes. Choices have no destination field. To change a choice's tone, you edit its flavor text, and the plot moves to the next beat. Saved places use stable beat IDs, so the text can be reworded without breaking a saved place.

## The ending and the "What if"

After the tomb, the story stops on a page titled "What if...". It asks the question the book leaves open: "What if the letter had found him?" It says plainly that in Shakespeare's ending neither lover survives, and that what follows is a glimpse of the life they never had.

![The "What if..." screen with a letter and the question "What if the letter had found him?", and the note that in Shakespeare's ending neither lover survives.](/projects/playscript/what-if.jpg)

The shipped build plays one such scenario: a letter on the road, a ride, and a reunion at dawn, seen through Romeo's eyes. The design goal is the one in the question on that page. Readers should be able to reimagine the scenarios books leave closed, and the agents are what turns a scenario into a playable one.

## How the agents work

The author's design gives each task its own agent. The director agent plans a scene as a playable chapter. The scene critic reviews the director's draft, and the director takes those notes into a second pass. The director and the critic each run two passes. The visual director sets the look of each scene, also in two passes. The animation agent builds Lottie animations and reusable SVGs in the background, so the scenes feel cinematic. Voice agents, working with a speech agent, produce emotive text-to-speech on the go with an ElevenLabs model. A scripting agent writes the script the scenes are built from.

The agents are the design. Each one has one job, and the critic loop is the check on the director's work.

## How it is built

This part needs a note. The agent code and an updated README were not pushed to the public repository before the event closed. The public repo therefore shows the generated output and the offline scripts, not the agents themselves. The README still describes an earlier state of the project.

What the repository does contain is the build-time half of the pipeline. `Scripts/create_narration.py` generates the narration clips and checks each clip's character timings against the text before saving it. If the timings do not match exactly, it saves nothing. That is what lets the highlight follow the real audio position at adjusted playback rates. `Scripts/create_score.py` makes the mood cues and effects. `Scripts/create_lottie.py` writes the Lottie JSON, using only the standard library, and `Scripts/test_lottie.py` checks the structure, such as matching first and last keyframes so the loops close cleanly. `Scripts/create_project.py` adds the Swift files and generated resources to the Xcode project.

The app is SwiftUI with one third-party dependency, lottie-ios. The story logic lives in a local Swift package called StoryCore, which has its own tests. `LivingScene.swift` draws four settings (orchard, chamber, tomb, and dawn road) as SwiftUI vector shapes, adds the Lottie motion on top, and uses a Canvas layer for particles such as fireflies, embers, and dust. A decision slows the Lottie layer to 40 percent and dims it, so the scene gives way to the choice.

The public repo's main branch has 12 commits, all dated September 14, 2026.

## What was hard

The highlight had to be honest. It is meant to stay on the right word at any playback speed, so the player follows the audio clock rather than a timer. That is why the narration script refuses approximate timings.

The validation notes in the repo are direct about the state of the newest code. The Swift changes were only checked for syntax, not built. No audio was played back on the machine used for the notes, so the voices, the music, and the mix balance are unverified. The Lottie animations pass their structural tests, but none has been rendered in Xcode yet.

The gap between the agent design and the public repo was also hard to hold together honestly. The output is in the repo, the agents are not, and the README is out of date. This article tries to say which is which.

## What I'd do next

- Push the agent code and an updated README, so the repository matches the build.
- Build and run the app in Xcode and the simulator. The newest scene and sound code has never been compiled or rendered.
- Listen to every narration clip and mood cue. The mix levels were chosen, not tuned by ear.
- Build the end-of-story analysis, so the closing screen reads the path a player took.
- Connect a real sign-in provider. Login currently uses a placeholder that accepts any well-formed email and a password of six characters. The `AuthService` protocol is there for the real backend.
- Add the titles on the "On the horizon" shelf.
