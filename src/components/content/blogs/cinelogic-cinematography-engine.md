---
title: "CineLogic: Giving an AI Film Pipeline a Camera Department"
date: "2026-10-18"
author: Saurav Rijal
kind: project
summary: "Two Python MCP servers, four production skills, a deterministic virtual camera, and Fourier-based motion inspection. How CineLogic turns cinematography decisions into inspectable tools—and where the current implementation stops."
tags:
  - python
  - mcp
  - cinematography
  - signal-processing
  - numpy
  - ffmpeg
  - agents
featured: true
coverImage: "/projects/cinelogic/cover.svg"
visuals:
  - type: pipeline
    kind: "Architecture"
    after: "Two servers, two kinds of work"
    title: "A camera department an agent can call"
    caption: "Implemented tools and documented production procedures are separate layers. The servers expose nine tools; external image and diffusion generation remain outside this repository."
    stages:
      - name: "Production skills"
        tag: "four roles"
        desc: "Scripting, direction, keyframes, and QC/fallback instructions guide an agent through the work."
      - name: "Studio MCP"
        tag: "six tools"
        desc: "Shot planning, prompt formatting, sentence audit, failure advice, frame QC, and pacing inspection."
      - name: "Motion MCP"
        tag: "three tools"
        desc: "A deterministic image-to-video dolly renderer, style-bible template, and exposure/corner screening heuristic."
      - name: "Media engine"
        tag: "Pillow + FFmpeg"
        desc: "Cubic easing drives a cropped camera window; RGB frames stream into a 1080p H.264 encode."
      - name: "Inspection"
        tag: "NumPy + FFT"
        desc: "Frame metrics and approximate camera-compensated residuals expose specific defects for review."
      - name: "Repair decision"
        tag: "explicit boundaries"
        desc: "Return measurements and corrective advice. Depth-based multiplane fallback is documented, not implemented in this checkout."
pull:
  after: "Why a film pipeline needs more than generation"
  text: "A moving frame is not necessarily a moving scene."
---

# CineLogic: Giving an AI Film Pipeline a Camera Department

CineLogic is the cinematography and inspection layer I built around AI film production: a way to describe a shot, produce a controlled camera move over an image, and ask concrete questions about the resulting media. It packages that work as two Python Model Context Protocol servers, standalone inspection scripts, and a plugin with four production skills.

The interesting engineering problem is the boundary between creative intent and executable checks. “Make this feel alive” is a direction. A frame's mean brightness, a proposed shot duration, or the residual left after compensating for camera motion is a measurement. CineLogic puts those together without treating one as proof of the other.

This build story follows [source revision 9f29a24](https://github.com/Rizsaurav/CineLogic/tree/9f29a242f9b58f681d9b43f67bac01a0363d7098). It distinguishes the functions implemented there, the production procedures described by the skills, and what a synthetic test can actually establish.

## What it does

A concrete CineLogic session starts with narration and an approved image. An agent can estimate whether a sentence fits a shot, turn the scene into a structured camera proposal, format the performance prompt, and return a deterministic video move. It can then inspect exposure, sharpness, edit boundaries, and whether visible change remains after approximating the camera transformation. Each step returns a small artifact or measurement the next decision can use.

CineLogic and [VideoMaxx](/blogs/videomaxx-agentic-video-pipeline) address different levels of the same production problem. VideoMaxx connects research, narration, assets, editing, and assembly. CineLogic packages the cinematography procedures and selected media utilities into a smaller agent-facing toolkit. The [architecture document](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/docs/ARCHITECTURAL_DEEP_DIVE.md) explicitly relates the two. This checkout makes those extracted interfaces available without requiring a full film production run.

## Why a film pipeline needs more than generation

A moving frame is not necessarily a moving scene.

Suppose a character is supposed to unfold a map. A video can change every pixel because the camera slowly zooms toward an otherwise frozen illustration. A simple frame-difference score sees motion. The intended performance is still missing. The opposite problem also matters: a quiet, deliberate shot can be artistically right even when a crude motion threshold dislikes it.

The repository's production documents frame CineLogic around these problems: repetitive push-ins, shots that outlast a model's useful temporal window, inconsistent characters, malformed anatomy, and generations that need a different repair rather than another seed. The goal is to make those decisions explicit. I treat the numerical gates as operational defaults, not universal laws of filmmaking or measured guarantees of audience retention. [The production runbook](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/skills/cinelogic-cinematics/runbooks/PRODUCTION_PIPELINE.md) describes the broader workflow; the smaller Python programs establish what this extraction can execute independently.

## Two servers, two kinds of work

The **Studio server** handles planning and inspection. Its six tools are:

- `cinelogic_design_shot`: normalize a shot proposal and recommend a split when its duration exceeds ten seconds.
- `cinelogic_format_prompt`: assemble style, subject, performance, and environmental clauses into a bounded prompt.
- `cinelogic_audit_script`: estimate sentence durations and flag financial-number patterns.
- `cinelogic_diagnose_failure`: map a symptom description to corrective advice.
- `cinelogic_check_qc`: run the standalone frame and boundary checker.
- `cinelogic_analyze_pacing`: run the standalone video-motion inspector.

The **Motion server** handles three image-related operations: `cinelogic_render_virtual_dolly`, `cinelogic_generate_style_bible`, and `cinelogic_screen_footage`. The first produces video. The second returns a structured style template. The third applies inexpensive image heuristics. Their names share a prefix, but their responsibilities and outputs are deliberately inspectable. [Studio tool registry](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/server.py#L17-L119), [Motion tool registry](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/image_motion_server.py#L28-L69).

Both servers use newline-delimited JSON-RPC over standard input and output. Initialization advertises protocol version `2024-11-05`; clients can list tools, call them, and ping the process. Successful tool payloads are JSON serialized inside MCP text-content blocks. An agent therefore receives a structured result it can parse, rather than an unstructured console transcript. The transport itself uses the Python standard library. Image operations still require Pillow; numerical checks require NumPy; video work requires FFmpeg. [Studio request loop](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/server.py#L303-L407).

The separation also exposes a useful constraint: a render is synchronous. While the Motion process is encoding a shot, it is occupied with that request. This is a small local tool server, not a distributed render queue with cancellation, progress events, and workers.

## Turning a sentence into a shot contract

A shot proposal contains a subject, duration, framing scale, camera movement, performance beat, and secondary motion. The schema lists five shot sizes and eleven camera moves, including lateral tracks, dollies, cranes, arcs, handheld follow, focus pull, and tilt up.

The implementation supplies a medium shot and rightward track by default. Missing performance and environment fields become a posture shift and ambient air drift. When a proposed duration exceeds ten seconds, the result changes to `SPLIT_RECOMMENDED`, caps the returned shot duration at ten, and proposes two half-length shots. A fourteen-second input therefore produces a seven-plus-seven recommendation. This is a planning response; it does not cut narration or render either shot. Inputs longer than twenty seconds would need further splitting because dividing once does not ensure both halves fit the target. [Shot handler](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/server.py#L122-L154).

For example, a client sends one JSON line to Studio:

```json
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"cinelogic_design_shot","arguments":{"subject":"An officer unfolds a map","duration_sec":14,"shot_size":"medium","camera_move":"track_right"}}}
```

The response is an MCP `result.content` array. Parsing the JSON string in its first text block gives this abbreviated planning result:

```json
{
  "status": "SPLIT_RECOMMENDED",
  "validated_shot": {"duration_sec": 10, "shot_size": "medium"},
  "recommended_splits": [
    {"shot_id": "shot_01a", "duration_sec": 7, "shot_size": "medium", "camera_move": "track_right"},
    {"shot_id": "shot_01b", "duration_sec": 7, "shot_size": "close", "camera_move": "dolly_out"}
  ]
}
```

This is a handler-derived example with nonessential fields omitted. The recorded smoke run exercised the same fourteen-second split behavior with a cavalry subject.

The production skills go further: no three consecutive framing sizes or camera families should repeat, and push-ins should occupy at most a quarter of the planned shots. Those rules need sequence history. The current stateless shot handler does not receive that history or enforce those aggregate constraints. A client following the director skill must maintain the plan and check them.

That distinction matters for an agent-facing API. A schema enumerates valid-looking inputs, but this server does not independently validate every argument against it. I would add explicit runtime validation and a sequence-level audit before presenting the planning endpoint as a complete cinematic constraint solver.

## Prompt economy, with a visible implementation boundary

The prompt formatter joins four clauses: style, subject, a physical performance, and secondary environmental movement. An example is a named historical subject, an observable hand action, and smoke drifting through the scene. This is easier to inspect than a paragraph mixing framing, editing, style, and several competing actions.

Both the MCP handler and standalone formatter cap output at 42 whitespace-separated words. They trim the tail and add terminal punctuation when needed. That bounds a prompt; it can also remove the environmental clause or finish partway through an idea. A more careful compiler would budget words per clause rather than truncate the concatenated result.

The documentation recommends excluding camera terms from image-conditioned prompts. At this revision, the `conditioned_on_image` argument does not change compilation and no camera-word stripping is implemented. Style is still included when supplied. I describe the tool as a formatter with a length guard, not an automatic conflict resolver. [MCP formatter](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/server.py#L156-L185), [standalone formatter](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/skills/cinelogic-cinematics/scripts/format_prompt.py#L15-L55).

The scripting tool has a similarly precise scope. It estimates spoken duration as word count divided by 2.5 words per second and flags sentences above ten seconds. A regular expression marks dollar amounts and expressions such as millions or billions for verification. It does not verify those claims, detect private individuals, or freeze a factsheet. Those remain production responsibilities described by the scripting skill. [Sentence audit](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/server.py#L251-L284).

## The virtual camera: a small renderer with explicit math

The implemented renderer starts with an approved still. Pillow converts it to RGB and fits it to a 3840 × 2160 base, twice the output dimensions. That creates a consistent 16:9 working image. Fitting also crops source compositions to that ratio, an important tradeoff when the subject is close to an edge.

For a requested duration `D`, it generates `ceil(24 × D)` frames. For frame `i`, normalized time is `u = i / max(1, N − 1)`. The camera uses cubic smoothstep:

```
s(u) = u² × (3 − 2u)
zoom(u) = 1 + (end_zoom − 1) × s(u)
```

Smoothstep has zero slope at both ends, so the move accelerates away from rest and decelerates into its destination. The crop width and height are the base dimensions divided by the current zoom. With the default `end_zoom = 1.20`, the camera ends at a 20% enlargement.

The horizontal center adds a smooth lateral drift. Its displacement is clamped to the margin available around the crop, which prevents that drift from moving the sampling window outside the image during the normal zoom-in path. Each crop is resized with Lanczos filtering to 1920 × 1080. Frames stream as RGB24 bytes to FFmpeg, which encodes H.264, `yuv420p`, at 24 fps and CRF 16. [Full renderer](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/image_motion_server.py#L71-L126).

The raw pipe avoids a directory containing every intermediate frame. The Python loop retains the source and current frame rather than an entire uncompressed movie. It still performs substantial CPU image processing and encoding; “no diffusion GPU required” does not mean zero compute or measured real-time performance.

There are two details I keep explicit. The code computes a continuous crop window, but converts its coordinates to integers before cropping: the current operation is not a genuinely fractional-coordinate sampler despite the subpixel wording in its result label. And `duration_sec` in the response is the requested clip length, not elapsed rendering time. A four-second response is not evidence that encoding took four seconds.

This tool is also a camera move over one image. It does not animate a character's limbs, reconstruct hidden geometry, or estimate depth. A pleasing dolly can still score as a static scene under a non-rigid-motion test. That is a useful separation between a rendering technique and a content-quality criterion.

## What was hard: choosing the right approximation

The central design tradeoff is separating a useful approximation from a promise it cannot keep. Dense scene understanding would be expensive and difficult to make repeatable. A small zoom-and-translation search is inspectable, cheap enough to apply to sampled frames, and directly targets the failure where camera motion masks a static scene. Its limits become part of the result's interpretation.

The renderer takes the same approach: one prepared image, one camera path, one streamed encode. It trades reconstructed depth and subject animation for a predictable operation whose crop, easing, frame count, and codec are explicit. The skill layer supplies the larger editorial context—when to use that move, when to ask for a different keyframe, and when a quiet shot is intentional. The challenge is making the handoff legible so an agent can reason about the production rather than repeatedly regenerate everything.

## Frame QC before expensive judgment

The standalone checker begins with grayscale images resized to 640 pixels wide. It computes three measurements: mean luma, variance of a discrete four-neighbor Laplacian, and the percentage of consecutive dark rows at each vertical edge.

The default gates are mean luma at least 42, Laplacian variance at least 25, and top or bottom black borders no larger than 3%. Border rows count as dark until their mean exceeds 12. These are measurements on the resized image, so resolution and preprocessing are part of the contract; a sharpness score cannot be compared casually with one computed on the original pixels. [Frame metrics and gates](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/skills/cinelogic-cinematics/scripts/qc_checker.py#L20-L80).

An optional next frame enables a seam check. Both images are resized to 160 pixels wide, their common height is compared, and mean absolute grayscale difference above 45 marks a failure. It is a low-cost warning about a discontinuity, not a semantic judgment that two shots should match. An intentional cut can differ radically; a subtle identity change can have a small pixel difference.

The Motion server's footage screener is lighter still. It downsizes to 320 × 180, rejects mean luma below 30, and checks whether either right-hand corner differs from the overall mean by more than 65. That can flag a potential corner logo. It cannot establish that the element persists across time, recognize a watermark, or determine narrative relevance. The supplied target sentence is returned in the result but never compared with image content. [Footage screener](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/image_motion_server.py#L144-L176).

I use these checks to make review cheaper and more specific. Human or model-based visual judgment still has to decide whether the shot communicates the intended action.

## Measuring what remains after the camera moves

The pacing inspector addresses the frozen-character problem by looking for movement that a simple camera transformation cannot explain. FFmpeg extracts grayscale frames at one sample per second, each 320 × 180. The first score is raw mean absolute difference between adjacent samples.

The second score searches for a better alignment. It tries fifteen logarithmically spaced zoom factors between 1.0 and 1.15, considering magnification in either direction by applying the transform to one image or the other. For each candidate, it estimates translation using Fourier phase correlation. [Sampling and zoom search](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/skills/cinelogic-cinematics/scripts/inspect_pacing.py#L69-L112).

The Fourier step subtracts each image's mean, applies a Hann window, and takes a two-dimensional FFT. It multiplies the conjugate of one spectrum by the other and normalizes by magnitude plus a small epsilon. The peak of the inverse FFT supplies a translation estimate. The window reduces edge effects that would otherwise interfere with finding that peak.

After shifting, the inspector compares only overlapping regions, averaging four-by-four blocks before taking the residual. It rejects implausibly large translation candidates and keeps the smallest residual found. A rigid pan or modest zoom should become more explainable; independently moving subjects should leave a larger difference. [Phase correlation and overlap](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/skills/cinelogic-cinematics/scripts/inspect_pacing.py#L30-L80).

The returned verdict uses mean local residual below 4.0 as the static-zoom flag and mean raw difference below 4.5 as a freeze flag. Either marks the clip as dead runtime. These units are grayscale-intensity differences after a particular sampling and alignment process; they are not physical motion units or a calibrated probability.

There are real limits. The search approximates translation and centered uniform scale, not a general affine camera or 3D scene. Rotation, parallax, lighting changes, edits, noise, and compression can affect the result. One sample per second can miss short actions. The current output contains a whole-clip verdict and averages; it does not return a shot timeline or a percentage of dead seconds despite broader runbook language. Frame extraction captures the whole sampled stream and retains all float arrays, so long-form analysis would benefit from streaming adjacent pairs.

## Repair decisions and the fallback boundary

The failure advisor accepts a symptom and attempt number. Walking, running, feet, or treadmill language leads first to a tighter traveling-camera retry; at attempt two or later it returns `TERMINAL_FALLBACK_2.5D_PARALLAX`. Face and anatomy language recommends a new keyframe. Static-photo language recommends a stronger performance beat. Jump or morph language recommends removing in-shot transition wording. Unrecognized descriptions request frame review. [Failure handler](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/server.py#L209-L249).

This is keyword routing with a bounded retry recommendation. It does not inspect video or dispatch a repair. The eight-category taxonomy in the QC skill is richer than the four recognized cause categories plus unknown in the current handler.

The documented terminal fallback is more ambitious: estimate depth, refine edges against color, quantize three to five planes, fill newly exposed regions with push-pull inpainting, then warp planes at different speeds. The runbook also describes a small exposure variation and drifting particles. That is a concrete production design, but this repository does not implement that depth pipeline. Its executable fallback-related renderer is the single-image dolly described above. I do not present the runbook's illustrative motion ranges as measurements from this checkout. [Fallback doctrine](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/skills/cinelogic-cinematics/runbooks/FALLBACK_DOCTRINE.md).

## Skills, manifests, and continuity

The plugin splits production into four skills. Each defines what the agent needs, what it should produce, and what to inspect before proceeding. They are written procedures backed by callable tools.

- **Scripting** takes a topic and gathered evidence. Its workflow produces a `factsheet.json` and sentence-by-sentence narration, budgeting roughly 25 words for a ten-second shot and marking financial claims for verification. Acceptance combines duration checks with editorial verification; the Python auditor covers the mechanical subset. [Scripting skill](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/plugin/cinelogic-studio/skills/cinelogic-scripting/SKILL.md).
- **Director** takes those sentences and the sequence history. It assigns framing, camera family, an observable action, and environmental motion. Its output is a varied shot plan and compiled prompts; acceptance includes the project push-in budget and repetition rules. Sequence history remains the agent's responsibility. [Director skill](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/plugin/cinelogic-studio/skills/cinelogic-director/SKILL.md).
- **Keyframes** takes the visual direction and recurring subjects. Its prescribed outputs are a hero style anchor, reference sheets, location plates, and conditioned scene frames. Acceptance means checking visual continuity and using the outgoing frame as the next anchor when an action should continue. Image generation is performed by the connected production environment. [Keyframe skill](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/plugin/cinelogic-studio/skills/cinelogic-keyframes/SKILL.md).
- **QC and fallback** takes candidate frames, clips, and defects. It calls for measurements, a causal diagnosis, and an acceptance or repair decision. The specification includes depth-based fallback after model limitations; the available tools provide the frame checks, motion inspection, and diagnosis advice described here. [QC/fallback skill](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/plugin/cinelogic-studio/skills/cinelogic-qc-fallback/SKILL.md).

The keyframe procedure asks for a text-generated hero anchor, recurring-character sheets and location plates, then image-conditioned scene frames. For an action intended to continue across a boundary, it specifies reusing the previous shot's final frame. The Motion tool's style bible returns topic, chapter, visual language, character guidance, negative-style text, and a chaining rule. It does not generate an anchor image or pass conditioning images to a model. [Keyframe skill](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/plugin/cinelogic-studio/skills/cinelogic-keyframes/SKILL.md), [style template](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/mcp/image_motion_server.py#L128-L142).

The plugin manifest identifies the bundle, and its MCP configuration registers both servers. A separate umbrella cinematics skill links the standalone scripts and production runbooks. Neither manifest is a persisted film-state database. The scripting skill names a `factsheet.json` workflow, but the exported tools do not hash, persist, or enforce it. That work belongs to the surrounding production system or a future implementation. [Plugin package](https://github.com/Rizsaurav/CineLogic/tree/9f29a242f9b58f681d9b43f67bac01a0363d7098/plugin/cinelogic-studio).

## Installing and using the checkout

I would start from a clone and an isolated environment, retaining the source tree because Studio locates its inspection scripts relative to the repository:

```bash
git clone https://github.com/Rizsaurav/CineLogic.git
cd CineLogic
git checkout 9f29a242f9b58f681d9b43f67bac01a0363d7098
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python setup_mcp.py --json
```

FFmpeg and ffprobe must also be available on the executable search path. The setup helper prints two registrations using the active Python interpreter and absolute source paths. A visitor can inspect that JSON before adding it to a client. The plugin's static configuration uses a workspace placeholder, whose expansion depends on the host. [Configuration helper](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/setup_mcp.py).

A local still-to-video run does not require a model provider:

```bash
python examples/quickstart_virtual_dolly.py input.jpg output.mp4
python skills/cinelogic-cinematics/scripts/qc_checker.py input.jpg --json
python skills/cinelogic-cinematics/scripts/inspect_pacing.py output.mp4 --json
```

The two arguments to the quickstart matter: its no-argument path expects a synthetic fixture created by the intensive test harness. Running the pacing checker on the dolly is an instructive check, not a promise it will pass the non-rigid-motion gate.

The package metadata advertises Python 3.9 or later and exposes `cinelogic-studio` and `cinelogic-motion` entry points. Its setuptools configuration packages only `mcp`; the root-relative skill scripts are not declared as package data. A source checkout is therefore the clearest installation path for the complete toolset at this revision. A distributable wheel needs explicit resource packaging and installation tests. [Package definition](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/pyproject.toml).

## What the tests establish

The repository provides two RPC smoke scripts and an intensive harness. The smoke scripts exercise initialization, registration, and selected tool calls. They print responses with PASS labels, so their output is useful transport evidence but not a substitute for assertions over every advertised contract.

The intensive harness constructs synthetic sharp, dark, blurred, letterboxed, and jump-boundary images. It encodes a still-image zoom and a moving-rectangle-and-arm sequence, compares their pacing results, checks prompt length, renders a three-second virtual dolly, and probes its output. It also tests malformed JSON and unknown-tool responses on both processes. [Test harness](https://github.com/Rizsaurav/CineLogic/blob/9f29a242f9b58f681d9b43f67bac01a0363d7098/tests/run_intensive_tests.py).

Those are valuable, repeatable cases. They can establish that a fixture is rejected for an intended metric and that an encoder produces a conforming file. They do not establish broad cinematographic judgment, watermark recognition, general MCP-client compatibility, diffusion-model quality, production throughput, or accuracy on an independently labeled film corpus. For the portfolio review on **October 18, 2026**, both smoke scripts and the intensive harness were actually executed in an isolated Python 3.14.7 environment. The harness reported **16 checks passed, zero failed**. These were local CPU tests with synthetic media: no external generation API, diffusion model, or real-film evaluation was run. The [recorded validation data](/projects/cinelogic/validation.json) and [readable execution log](/projects/cinelogic/validation-log.txt) are available alongside this article.

The clearest result is the paired motion experiment:

| Synthetic fixture | Raw motion | Camera-compensated residual | Verdict |
|---|---:|---:|---|
| Camera-only still zoom | 23.78 | 2.41 | Static-scene flag |
| Moving subject and arm | 47.72 | 46.51 | Active-motion verdict |

The first fixture has substantial raw pixel change, yet drops below the 4.0 local-motion gate after compensation. The second retains a large residual. This demonstrates the intended distinction on these two constructed cases; it is not an accuracy score over films.

The encoded dolly was also probed: 1920 × 1080, H.264/yuv420p, 72 frames, three seconds. The harness reported 5.53 seconds for its overall run, including fixture generation and all checks. That is a single recorded execution, not a renderer throughput benchmark. The test's own broad production-readiness slogan is not a conclusion I infer from sixteen bounded checks.

## The next reliability work

The most useful next changes follow directly from these boundaries: validate arguments in the handlers, add sequence-level invariants, make prompt compilation preserve essential clauses, and represent deliberate editorial exceptions explicitly. The tools should report missing optional files as errors rather than quietly skipping a requested seam comparison.

For execution, I would add subprocess timeouts, cancellation, atomic output publication, and distinct transport versus tool-execution errors. Currently handler exceptions share the outer parse-error response path, and FFmpeg writes directly to the requested destination with overwrite enabled. A successful API status should eventually mean the output was probed and accepted, not just that the encoder returned zero.

For motion inspection, streaming frames and returning interval-level evidence would make long films cheaper to analyze and failed moments easier to repair. For the agent layer, persisting a shot manifest with provenance, attempts, measurements, and acceptance decisions would turn the written workflow into an enforceable state machine.

CineLogic's contribution is the interface between these pieces: creative intent represented as small contracts, media operations with explicit math, and repair advice that can be inspected before spending more compute. The current implementation is useful precisely where those contracts are concrete, and its build story includes the work still required to make the broader production doctrine executable.
