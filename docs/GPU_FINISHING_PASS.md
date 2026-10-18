# GPU experience finishing pass

Implemented on `finish/gpu-experience`, based on `0821565`.

- Preserves full GSAP/Lenis motion and explicit-only Lite mode.
- Trims the invisible boot tail; synchronizes camera, previews and depth layers around steady reading beats.
- Restricts velocity lean and hardware props to camera travel. Reading cards remain clear of props.
- Adds bounded signal pulses to existing boot rails and the rack ruler.
- Makes rack units keyboard-accessible project navigation.
- Fixes chip heat indexing and batches pointer updates to one per animation frame.
- Preserves the 144-cell scale wave with one glow surface in place of per-cell animated shadows.
- Limits large-layer promotion hints to nearby scenes; this reduces retention hints, not a guarantee of browser GPU-memory release.
- Caches research controls and extends completed-chart reading time.
- Reduces the route shutter to 850ms and reduces incoming-page displacement.
- Adds verified build/output summaries without assigning undocumented individual ownership of team work.
- Uses stable screenshot windows, corrected source dimensions, responsive stills, and accessible on-demand enlargement.
- Shows real Interviewer setup and three static frames from the owner's existing Zanzibar render. Frame provenance is in `public/projects/videomaxx/SOURCES.md`.
- Reuses signal-field wave computations/buffers while preserving original dot values and pointer response; removes scroll-only layout/style reads.

## Verification

Production build, app TypeScript check, focused ESLint on changed modules, and Git whitespace check passed. Existing optional Firebase comments chunk still produces Vite's size warning.

Chrome verified project-unit navigation, settled preview transforms, unchanged preview geometry across BioTwin screenshot selection, dialog focus and Escape closing, completed article transition, real film frames, and no failed images. DOM layout checks at 390px and 320px found no page or preview overflow. Desktop-to-phone transition retains motion and clears desktop-only visibility gates.

Numerical comparison of the original and optimized signal-field sampler passed across three grid/flow/pointer scenarios. A local calculation-only benchmark showed about 13 percent less computation time; this is not a whole-page FPS or GPU-memory measurement. No end-to-end memory ceiling is claimed.
