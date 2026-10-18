# CineLogic portfolio evidence

Reviewed 2026-10-18. Repository: https://github.com/Rizsaurav/CineLogic

Pinned source: `9f29a242f9b58f681d9b43f67bac01a0363d7098` (`9f29a24`). Read-only review checkout: `/tmp/cinelogic-portfolio-review`.

Article: `src/components/content/blogs/cinelogic-cinematography-engine.md`. Published date is quoted `"2026-10-18"`; kind `project`; featured true; cover `/projects/cinelogic/cover.svg`. Its architecture pipeline is inserted after the exact heading `Two servers, two kinds of work`. Authorial description is based on code and repository production procedures, without invented personal chronology or customer outcomes.

## Source anchors and supported facts

All paths below are relative to the pinned CineLogic source. GitHub links in the article use the full SHA.

| Source | Exact lines | Supported fact |
|---|---|---|
| `mcp/server.py` | 17–119 | Six Studio tool declarations and input schemas. |
| `mcp/server.py` | 122–154 | Shot defaults; ten-second cap; one two-way split recommendation. |
| `mcp/server.py` | 156–185 | Four-part clause concatenation and 42-word tail truncation. |
| `mcp/server.py` | 187–207 | Frame QC subprocess delegation; optional next file silently skipped if absent. |
| `mcp/server.py` | 209–249 | Keyword diagnosis; locomotion retry on attempt one and terminal recommendation from two onward. |
| `mcp/server.py` | 251–284 | Sentence duration = words/2.5; regex financial-figure flags. |
| `mcp/server.py` | 286–301 | Video pacing subprocess; JSON stdout parsing and raw-error fallback. |
| `mcp/server.py` | 303–407 | Line-oriented JSON-RPC, initialization, ping, discovery, tools/call; broad exception handler. |
| `mcp/image_motion_server.py` | 28–69 | Three Motion tool schemas. |
| `mcp/image_motion_server.py` | 71–125 | Cubic smoothstep, 24 fps, double-size base, clamp, crop, Lanczos, rawvideo pipe, H.264 CRF16. |
| `mcp/image_motion_server.py` | 128–142 | Template style bible and chaining instruction, not model generation. |
| `mcp/image_motion_server.py` | 144–176 | Grayscale exposure and right-corner-contrast screening; target sentence echoed only. |
| `mcp/image_motion_server.py` | 178–245 | Separate synchronous JSON-RPC process. |
| `skills/cinelogic-cinematics/scripts/qc_checker.py` | 20–80 | Luma42, Laplacian25, black-edge3%, edge-row darkness12, grayscale640. |
| Same QC script | 51–55, 93–100 | Boundary comparison at width160, common height, mean absolute difference45. |
| `skills/cinelogic-cinematics/scripts/inspect_pacing.py` | 25–80 | 320×180 geometry, Hann-windowed phase correlation, 15 log-spaced zooms up to1.15, overlap residual. |
| Same pacing script | 82–130 | One-fps full-stream extraction, retained float arrays, whole-clip averaged verdict, local4/raw4.5. |
| `skills/cinelogic-cinematics/scripts/format_prompt.py` | 15–55 | Standalone formatter; unused conditioned flag; no camera-term removal. |
| `plugin/cinelogic-studio/plugin.json` | full file | Plugin identification manifest; not a renderer/task-state database. |
| `plugin/cinelogic-studio/mcp_config.json` | full file | Both source-script server registrations using workspace placeholders. |
| `plugin/cinelogic-studio/skills/cinelogic-scripting/SKILL.md` | full file | Narration/factsheet/verification instructions, not implemented factual verification. |
| `plugin/cinelogic-studio/skills/cinelogic-director/SKILL.md` | full file | Project-level push-in ceiling and no-three-repeat doctrine. |
| `plugin/cinelogic-studio/skills/cinelogic-keyframes/SKILL.md` | full file | Text-first hero anchor, reference sheets, conditioning and boundary procedures. |
| `plugin/cinelogic-studio/skills/cinelogic-qc-fallback/SKILL.md` | full file | Eight-cause doctrine and specified depth-based fallback. |
| `skills/cinelogic-cinematics/SKILL.md` and `runbooks/` | full files | Umbrella playbook, production stages, motion grammar, root-cause and fallback design. |
| `setup_mcp.py` | 32–82 | Print configurations using active interpreter and absolute paths; optional config mutations. |
| `pyproject.toml` | 6–35 | Python>=3.9 declared; NumPy/Pillow dependencies; two entry points; only `mcp` packaged. |
| `examples/quickstart_virtual_dolly.py` | 22–45 | Two positional paths required for own still; default fixture; duration reported is clip length. |
| `mcp/test_server.py`, `mcp/test_image_motion_server.py` | full files | RPC smoke scripts print responses, limited assertions. |
| `tests/run_intensive_tests.py` | 49–351 | Synthetic fixture generation and sixteen concrete checks; probe and error tests. |

## Implemented versus documented

- **Implemented**: two MCP-style stdio processes; nine registered tools; duration recommendations; prompt formatting; word-rate and financial-pattern audit; keyword-based failure advice; frame QC; approximate camera-compensated video inspection; deterministic single-image dolly; style template and simple screening.
- **Instructions/specification**: four modular plugin skills plus the umbrella playbook; shot-sequence variety and push-in budgets; factsheet freezing; anchor generation and image chaining; depth-estimation/multiplane fallback; full-film pipeline orchestration.
- **External/not established here**: model training, image or diffusion generation, successful depth fallback, vision critic, factual correctness, audience retention, real-film motion-classification accuracy, published-client interoperability matrix, long-duration throughput, industrial readiness.

## Discrepancies deliberately corrected in article

1. Tool description says shot vocabulary and <=25% push-in enforcement; handler does not validate enums or receive project history. No claim that it enforces aggregate grammar.
2. A duration over20s split once can yield halves still over10s. Article describes recommendation, not guaranteed valid segmentation.
3. Formatter descriptions say camera terms are removed; neither formatter implements removal, and conditioned flags are unused. Style clauses remain included despite some instructions saying keyframe-conditioned prompts omit style.
4. Audit metadata claims PII/compliance and fact freezing; implementation estimates words and matches finance strings only. No private-person detector, claim verification, or persisted hash.
5. Eight diagnosis states are doctrine; current runtime recognizes four cause categories plus unknown. It returns repair advice, not repair execution.
6. “Subpixel” renderer label is broader than code: crop coordinates are converted to ints before Lanczos resize. Continuous parameter path does not imply fractional crop sampling.
7. `duration_sec` response is requested media duration. Quickstart prints it as though rendering elapsed; no throughput inference is made.
8. Motion renderer is a single-plane crop, not depth-estimated 2.5D parallax or character animation. Depth Anything, edge refinement, k-means and inpainting exist as documentation only in this checkout.
9. Pacing compensates approximate centered uniform scale and translation; it is not a complete affine/3D inversion. No interval list or numeric dead-runtime percentage is returned.
10. Watermark screen is exposure/corner-brightness heuristic on a still. No temporal persistence, OCR, semantic relevance or vision model exists there. Threshold30 differs from QC42.
11. Transport catches handler exceptions as parse errors; no full schema validation, timeout/cancellation system, atomic output, or queue exists. Tool failures can be JSON payloads rather than MCP `isError`.
12. `-y` overwrites render destination. Successful process exit is not an automatic media-probe acceptance check.
13. Packaging includes `mcp` only; root-relative skills/scripts are not declared wheel resources. Source checkout recommended, no claim complete standalone wheel installation verified.
14. Setup helper merges valid JSON configuration but resets unreadable JSON to an empty object before writing. Article recommends inspect-only `--json`, not automatic installation.
15. Pacing full captured output and retained float arrays grow with duration. No bounded-memory streaming claim.
16. README/architecture anecdotes, “broadcast-quality,” illustrative fallback residual ranges, speed claims and “100% production ready” test slogan are not repeated as established product results.

## Actual local validation

Executed by root agent on 2026-10-18 against the exact pinned clone in an isolated Python3.14.7 environment:

- `python mcp/test_server.py`: completed successfully.
- `python mcp/test_image_motion_server.py`: completed successfully.
- `python tests/run_intensive_tests.py`:16 checks passed,0 failed;5.53s overall harness elapsed. This is one execution, not a throughput benchmark.

Exact outputs inspected by writing agent: `/tmp/cinelogic-intensive-tests.log`; public record `/projects/cinelogic/validation.json` and `/projects/cinelogic/validation-log.txt`. These public artifacts were authored by root with ANSI/private paths removed and the overbroad final readiness slogan replaced by a scoped note.

Measured synthetic results:

| Fixture/check | Observed result |
|---|---|
| Sharp image | Mean luma135.4, sharpness2571.87; accepted. |
| Underexposed image | Luma17.0; rejected. |
| Blurred image | Sharpness0.65; rejected. |
| Black-edge fixture | Letterbox11.1%; rejected. |
| Jump seam | Difference114.67; rejected. |
| Identical seam | Difference0.0. |
| Camera-only zoom | Raw23.78; local residual2.41; static-scene flag. |
| Moving rectangle/arm | Raw47.72; local residual46.51; active verdict. |
| Encoded dolly | 1920×1080,H.264/yuv420p,72 frames,3.00s. |
| Protocol negative tests | Both servers returned -32700 for malformed JSON and -32601 for unknown tools. |

No GPU generation, paid API, independently labeled corpus, or real-film QC benchmark was run. Smoke scripts' PASS text alone is narrower evidence than a fully asserted conformance suite. Sixteen fixture checks do not establish general production readiness.

## Editorial scope

Article is approximately4000 words including frontmatter. It contains source-pinned implementation links, actual validation artifact links, exact CLI examples, formulas, limitations and next reliability work. No new claim is made about personal motivation, team ownership, client outcomes or historical model performance. Root owns cover design, project data, rack preview and website integration.
