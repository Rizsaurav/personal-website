# Compute Rack

Branch: `motion-UI`. Local development: `npm ci` then `npm run dev` (port 8080).

The existing Hero component is unchanged. The homepage below it uses a monochrome rack with four featured projects, six archived projects, Field Notes, About, and contact links.

## Motion

`ComputeJourney` (GSAP ScrollTrigger + Lenis, `src/lib/motion.ts`) replaces the CSS-variable scroll scenes. Scroll is a single playhead; both scenes are pinned timelines with `scrub`, so every move reverses.

1. **Boot** (pinned, ~3.4 viewports): the page colour morphs into the machine, "Compute in." rises in and shrinks to a corner label, a 12x12 GPU die tilts up in 3D, lights from the centre out, flattens to face the camera while the stats count up, then the camera pushes through it.
2. **Manifesto** (pinned, ~5.4 viewports): a summary of what I do flies through the camera one phrase at a time (z-axis fly-through, characters popping in, emphasis words in light italic) over two PCB trace layers streaming past at different depths. The last phrase gives way to an annotated "die shot": my portrait as a chip package with pins and four callouts (education, role, research, next). The camera dives into the package.
3. **Rig** (pinned, ~4.6 viewports): the tunnel opens on bay 01. Each bay-to-bay move also carries its own prop at its own depth: a heatsink fin wall (foreground), a cooling fan (background, rotating with scroll), memory modules (mid-ground). The camera dollies sideways along the rack in three eased moves with held beats between them. Cards rotate through depth, enclosure panels peel apart on arrival and close on exit, and the ghost numeral, live output, back layer and foreground ruler travel at different speeds. The HUD shows only real state (scroll %, active bay, its stack); scroll velocity skews the background and ghost layers. The machine powers down back to the page colour with a closing beat.

Under 1024px wide, under 620px tall, or with reduced motion, nothing is pinned: the static layout renders (phones get a scrubbed card tilt, reduced motion gets none). Lenis is skipped under reduced motion. Keyboard focus on an off-screen bay scrolls the playhead to it, and there is a skip link.

## Content provenance

Research numbers come from the existing Open-Weight Oligopoly article. Project descriptions, technologies, and destinations come from `src/data/projects.ts`. The rack, production stages, document flow, and chess position are authored illustrations labeled as such. The linked VideoMaxx, Sortify, and Chess Coach GitHub trees were also inspected: they contain logos and a few charts, but no suitable application screenshots or coherent generated-film frame sequence. Actual GPU benchmark assets, application screenshots, and generated-film frames are not supplied in this checkout; these are still needed to replace the illustrative previews with the requested real output media. The existing `.jpg` cover files are text rather than valid JPEG images, so they were not used as output thumbnails.

## Reliability and loading

Blog routes are lazy loaded. Optional Firebase comments load only when `VITE_FIREBASE_API_KEY` is configured, preventing the missing-key startup crash in a clean checkout. Article entrance animations and the perpetual custom cursor loop were removed. Two existing WorkIndex state-type errors were corrected so the project typechecks.

## Validation

- Production build passed; the optional Firebase comments chunk still triggers Vite's 500 KB warning.
- TypeScript app check passed.
- Focused ESLint check on changed TSX files passed.
- Git whitespace check passed.
- Chrome: desktop scroll-scrubbed layer separation and card expansion, 390px and 320px stacked layouts without horizontal or preview overflow, dark palette, archive disclosure, and a project article route verified.
- Reduced-motion fallback is implemented in CSS and observer setup; OS-level reduced-motion emulation was not performed.
- No commit, push, or deployment performed.

References for the manifesto direction: Codrops, "How to Build Cinematic 3D Scroll Experiences with GSAP" (tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/) and "Creating 3D Scroll-Driven Text Animations with CSS and GSAP" (tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/).

## Reading scenes (Field Notes, About, Contact)

Pinned like the rest, but the pacing is the reading: each passage is revealed word by word as the playhead moves, so the text is read at the speed of the scroll.

- **Field Notes**: one article at a time. A large numeral rolls like an odometer, the title rises out of a mask, the summary reads through, then the link appears. Ruled log lines and a ghost word drift behind at different speeds.
- **About**: the lede reads through over a drifting blueprint grid, recedes, and a datasheet assembles beside it row by row. A soccer pitch then draws itself with the 4-3-3 for the closing line.
- **Contact**: the page powers down to the machine palette, rails draw in, the headline rises, the sentence reads through, and the links pop in.

Phones get the same word-by-word read-through, scrubbed but unpinned. Reduced motion gets static, fully visible text. Scenes set `refreshPriority` in page order because Field Notes mounts after its articles load.

## Revision: fused About, boot story, phones, lite mode

- **About is the whiteboard.** The standalone About scene is gone. The whiteboard scene ("01 / ABOUT") accumulates eight entries on the left and never erases them (independent experiments, research, AI systems, HPC & inference, hackathons & teams, full-stack, end-to-end automation, away from the keyboard), lighting a node and a trace to the chip for each. It ends in the annotated die shot (education, role, projects, next). Nothing claims published papers.
- **Boot has no counters.** The numbers are replaced by three story beats ("A question worth asking." / "A pipeline that runs itself." / "Something people can use.") that re-form the die as they land. The die is touch/hover interactive: cells under the pointer and their neighbours heat to the status-LED green and cool again.
- **Section order and numbering:** boot → 01 About (whiteboard) → 02 Selected systems (rig, `#work`) → 03 Writing → 04 Contact. Nav: About, Work, Writing, with a menu button on phones.
- **Phones:** nothing is pinned; the die tilts and lights on scroll, whiteboard entries and callouts arrive on scroll and stay, the chip scales in, project cards tilt in, Field Notes reads through word by word.
- **Lite mode** (`html.lite`, set when `deviceMemory <= 4`, `hardwareConcurrency <= 4` or Save-Data): no Lenis smoothing, no scrub lag, no blur or backdrop filters, no masks on the board layers, and the heaviest decorative layers (near trace layer, fin wall, outlined background text, scan line) are hidden.

## Performance

Measured with a throttled Chrome (Slow 4G, 4x CPU, DPR 2), production build, before to after:

| | Before | After |
|---|---|---|
| Main JS (first load) | 661 kB (222 gz) | 180 kB (59 gz) |
| First contentful paint | ~2.2 s | ~0.95 s |
| Requests on the homepage | 24 | 13 |
| Transferred on load | ~700 kB | ~370 kB |
| Decorative layers composited at once | 245-330 | 20-160 |

What was done:
- **Split the load.** The hero paints from a 180 kB shell. GSAP, Lenis and all scenes (about 190 kB) load in a separate chunk after idle. The hero and header use CSS animation, not an animation library. GSAP is imported lazily by the route transition. Unused app scaffolding (toast, tooltip and query providers) was removed.
- **No article bodies on the homepage.** Field Notes reads title, date, summary and read time from a build-time index (`virtual:articles`), instead of downloading every article to read its front matter.
- **Fonts.** One non-blocking stylesheet request (preload then swap) instead of three render-blocking ones; the unused Poppins family was dropped.
- **Images.** The favicon was a 163 kB, 1024 px PNG; it is now 4.8 kB. The portrait is 33 kB, down from 67 kB, with explicit dimensions and async decoding.
- **GPU memory.** Per-character `will-change` (hundreds of layers), oversized 3D trace layers (now 140vw/170vw instead of 210vw/320vw, fewer paths) and always-on layers were the main cost. Each scene now hides its heavy decorative layers while it is more than a screen away (`gate()` toggles `.is-off`, `visibility: hidden`).
- **CPU and battery.** Lenis' ticker only runs while the user is scrolling and sleeps 0.7 s after; an idle tab does no work. The header's backdrop blur was removed.
- **Adaptive.** `html.lite` is applied up front for low memory or cores, Save-Data, 2G/3G and prefers-reduced-data, and at runtime if the median frame time during the first 120 frames of scrolling exceeds 30 ms (verified: triggers under 40x CPU throttle). Lite drops Lenis, scrub lag, blurs, masks and the heaviest layers.
- **Mobile browsers.** `ignoreMobileResize` stops address-bar resizes from rebuilding every pin, and pinned stages use `100svh`.

Not measured: real GPU memory on real devices (headless Chrome only), Safari and Firefox rendering speed (code paths are standard transforms and opacity, but not profiled there), and real iOS toolbar behaviour.

## Boot stage never opens empty

The first beat is time-based, not scrubbed: it starts when the stage is 8% into view, while the hero is still on screen, so by the time it pins the headline, rails and signal field are already alive. The scrubbed timeline only drives what comes after (card to full-bleed, the headline shrinking to a corner, the die, the dive).

`DotField` is the ambient layer: one canvas of interfering waves that flow with scroll and lean toward the pointer. Cost controls (patterns from small canvas-background components: single canvas, batched paths, pause off-screen, window-level pointer, click-through): three batched fills per frame, square dots, 24 fps cap, DPR capped at 1.5, ink colour sampled every 8 frames, paused by IntersectionObserver and `visibilitychange`, drawn once with no loop for touch, reduced motion and `html.lite`. Throttled to Slow 4G with a 4x slower CPU, whole-page scrolling had 4-9 frames over 33 ms out of about 620.

## Revision: research scene, archive, and the way back

- **Research replaces Field Notes.** The homepage scene now shows only articles marked `kind: research` (the other articles are software build stories and appear in the rack and archive, so nothing is repeated). Each study gets its own chart, drawn from the numbers in its article front matter (`virtual:articles` carries the first line/bars visual): bars grow, the line draws, points pop in, and hovering or focusing a bar or point shows that article's own note. A rolling numeral, drifting graph paper and an outlined ghost word sit behind. Nothing is invented: labels and values are the article's.
- **More experiments is an unfolding list.** Rows open on hover (mouse) or tap into a short brief with a Build story / Code / Live demo row, animated with a `grid-template-rows` 0fr to 1fr transition and a trace line down the left edge. One row is open at a time and it stays open until another row is hovered or tapped, the surrounding space is tapped, or Escape is pressed.
- **Scrolling back up has its own design.**
  - *Ratchet:* whiteboard entries are added by time the first time the playhead reaches them and are never taken away on the way back up. The board keeps what you have read.
  - *Memory trail:* a chapter rail on the right edge (About, Work, More, Research, Contact) fills to the furthest point reached and never drains, keeps visited chapters lit, shows where you are, and every chapter is a jump link. It uses `mix-blend-mode: difference` so it reads on both the dark machine and the light page.
  - *Rewind cue:* when the direction of travel is up (`html[data-dir="up"]`) the rail shows a rewind label and a pulse runs down the trail, and the rig HUD label gets a rewind mark.
  - The footer has "Replay from the top".

## Engineering pass (profile first, then fix)

Measured with Chrome DevTools Protocol traces and a CPU profile (Slow 4G, 4x CPU, DPR 2), then fixed what the profile showed:

- **Per-frame cost was already low** (about 1 ms of JavaScript and 0.5 ms of style recalculation per frame at 1x CPU; raster time was a few ms per scene), so the work went into the places a profile pointed at.
- **Startup was dominated by GSAP initialising tweens.** About 1 s of the 4x-CPU startup was `getComputedStyle` reads inside tween setup, proportional to how many elements are tweened. The 144 die cells (576 property tweens) are now driven by three CSS variables on one element (`--w` wave, `--k` story beat, `--out` drain), and long titles animate per word rather than per character. Scene mounting is staged: the rack builds first, the rest on the next idle slot.
- **The signal field runs in a Web Worker** on an OffscreenCanvas (1x, three batched fills, 24 fps, paused off-screen), so the main thread and the scroll scrubbing never wait for it. Browsers without OffscreenCanvas fall back to the same drawing on the main thread. Confirmed the worker is live in Chrome.
- **Raster scale.** Chrome re-rasterises script-scaled layers on every scale change unless the element has `will-change: transform` ([Chrome for Developers](https://developer.chrome.com/blog/re-rastering-composite)). The three elements that scale by large factors (die, chip map, rack track) get it; nothing else does, to keep layer count down.
- **Fonts are self-hosted** (latin subset, variable, 3 files, about 190 kB): no third-party origin, no CSS round trip. Preloaded at low priority; without the preload, first paint was sooner on some runs but largest paint was about 2.8 s instead of 1.9 s.
- **Fewer callbacks and a shorter scrub tail**: `ScrollTrigger.limitCallbacks`, scrub smoothing 0.5 s instead of 0.8 s, `content-visibility: auto` on the archive, route transition no longer imports GSAP.
- **Heads-up on memory.** Total browser memory with the page open is about 165 MB above a blank Chrome tab at load and about 220 MB at peak while scrolling; it settles lower after garbage collection. That is higher than the earlier measurement (about 80-130 MB) because the page now has more content (research charts, real app screenshots, the archive). The Lite switch in the header drops the heaviest layers.
