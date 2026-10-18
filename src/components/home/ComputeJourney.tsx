import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { projects, type Project } from "@/data/projects";
import {
  gsap,
  ScrollTrigger,
  IMMERSIVE_QUERY,
  COMPACT_MOTION_QUERY,
  scrollToY,
  setDarkStage,
  SCRUB,
  LITE,
  startSmoothScroll,
  gate,
} from "@/lib/motion";
import chipPhoto from "@/assets/h.jpg";
import { Output } from "./rack-outputs";
import { Chars } from "./reveal";
import { DotField } from "./DotField";
import "./compute-rack.css";
import "./gpu-journey.css";
import "./render-polish.css";
import "./experience-polish.css";

const bays = [
  {
    id: 14,
    name: "CineLogic",
    category: "01 / Cinematography systems",
    note: "Creative intent. Inspectable tools. A reproducible shot.",
    type: "cinelogic",
  },
  {
    id: 11,
    name: "BioTwin",
    category: "02 / HackRice",
    note: "Wearables give you numbers. This gives you understanding.",
    type: "biotwin",
  },
  {
    id: 12,
    name: "PlayScript",
    category: "03 / TXST Shipathon",
    note: "Play the story. Reimagine the ending.",
    type: "playscript",
  },
  {
    id: 13,
    name: "AI Interviewer",
    category: "04 / Google hackathon",
    note: "An interviewer that reads your code as you type.",
    type: "interview",
  },
  {
    id: 1,
    name: "VideoMaxx",
    category: "05 / Agentic production",
    note: "From a single topic to the final cut.",
    type: "film",
  },
];

const CELLS = 144;

/** Etched interconnect revealed when the camera dives into the die (vector, stays sharp). */
const ETCH = [
  "M83 36 H98 V12 H68",
  "M10 24 H2 V41 H29",
  "M17 77 H7 V54 H22",
  "M53 24 H39 V38 H29",
  "M4 30 H2 V11 H18",
  "M73 90 H58 V68 H68",
  "M50 57 H36 V69 H55",
  "M81 79 H52 V91 H73",
  "M43 65 H58 V90 H47",
  "M36 6 H58 V2 H79",
  "M52 78 H28 V63 H15",
  "M35 63 H61 V89 H85",
  "M17 79 H36 V56 H20",
  "M47 69 H61 V87 H42",
];

/** Bite-sized GPU notes. Each line is either a general fact or something Saurav measured himself. */
const gpuNotes = [
  { at: 0, text: "" },
  {
    at: 2.9,
    text: "Streaming multiprocessors wake up. Each runs threads in warps of 32.",
  },
  {
    at: 4.6,
    text: "HBM sits beside the die. LLM decoding is limited by memory bandwidth, not compute.",
  },
  {
    at: 5.3,
    text: "Occupancy: how many warps an SM keeps in flight to hide memory latency.",
  },
  {
    at: 6.9,
    text: "I took a 27B model in FP8 from under 25 to about 200 tokens a second on an H100.",
  },
  { at: 8.4, text: "Every token starts here." },
];
const rigNotes = [
  "Prefill reads the whole prompt at once. Decode writes one token at a time.",
  "The KV cache trades GPU memory for not recomputing the past.",
  "Batching puts more requests through each pass, so throughput climbs.",
  "Speculative decoding: a draft guesses ahead, the big model verifies.",
];

const board = [
  {
    t: "Independent projects",
    d: "Projects that start from a concrete annoyance.",
    tag: "Projects",
  },
  {
    t: "Research",
    d: "Empirical ML and energy systems, in the open.",
    tag: "Research",
  },
  {
    t: "AI systems",
    d: "Agentic pipelines and LLM evaluation.",
    tag: "AI systems",
  },
  {
    t: "HPC & inference",
    d: "Serving open-weight models on GPUs.",
    tag: "HPC",
  },
  {
    t: "Hackathons & teams",
    d: "Building fast, with other people.",
    tag: "Hackathons",
  },
  {
    t: "Full-stack development",
    d: "React frontends, Postgres backends, shipped.",
    tag: "Full-stack",
  },
  {
    t: "End-to-end automation",
    d: "Pipelines that run themselves.",
    tag: "Pipelines",
  },
  {
    t: "Away from the keyboard",
    d: "There is usually a football involved.",
    tag: "Football",
  },
];

const callouts = [
  "B.S. Computer Science · Texas State · Applied Math minor",
  "SWE intern at LaunchBox · agentic internal tools",
  "Hackathon builds, shipped · BioTwin, PlayScript, AI Interviewer",
  "Seeking forward-deployed AI roles · grad school, Fall 2027",
];

/** Satellite positions around the chip (percent of the map square). */
const nodePos = board.map((_, i) => {
  const a = ((i * 360) / board.length - 90) * (Math.PI / 180);
  return { x: 50 + Math.cos(a) * 44, y: 50 + Math.sin(a) * 44 };
});

/** Deterministic PCB-style routes: orthogonal runs with 45° chamfers. */
function routes(seed: number, count: number) {
  let r = seed;
  const rnd = () => (r = (r * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const paths: string[] = [];
  const vias: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    let x = Math.round(rnd() * 32) * 50;
    let y = Math.round(rnd() * 24) * 50;
    let d = `M${x} ${y}`;
    vias.push([x, y]);
    for (let k = 0; k < 4; k++) {
      const horiz = k % 2 === 0;
      const len = (2 + Math.round(rnd() * 5)) * 50 * (rnd() > 0.5 ? 1 : -1);
      if (horiz) x += len;
      else y += len;
      const c = 25 * Math.sign(len);
      d += horiz ? ` H${x - c} l${c} ${c}` : ` V${y - c} l${-c} ${c}`;
    }
    vias.push([x, y]);
    paths.push(d);
  }
  return { paths, vias };
}
const farBoard = routes(7, 16);
const nearBoard = routes(31, 8);

export function ComputeJourney() {
  const root = useRef<HTMLElement>(null);
  const rigST = useRef<ScrollTrigger | null>(null);
  const heatTimers = useRef(new Map<HTMLElement, number>());
  const lastHeatCell = useRef(-1);
  const pointerFrame = useRef(0);
  const cellCache = useRef(new WeakMap<HTMLElement, HTMLElement[]>());
  useEffect(() => {
    const timers = heatTimers.current;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      cancelAnimationFrame(pointerFrame.current);
    };
  }, []);
  useEffect(() => startSmoothScroll(), []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = <T extends Element = HTMLElement>(s: string) =>
      Array.from(el.querySelectorAll<T>(s));
    const one = <T extends Element = HTMLElement>(s: string) =>
      el.querySelector<T>(s)!;
    const mm = gsap.matchMedia();

    /* ------------------------------------------------------------------ */
    /* Desktop: two pinned scenes, one continuous camera move              */
    /* ------------------------------------------------------------------ */
    mm.add(IMMERSIVE_QUERY, () => {
      el.classList.add("is-immersive");

      /* ---- Scene 1: boot sequence (page → machine → through the die) ---- */
      const bootStage = one(".boot-stage");
      const titleA = one(".boot-line-a");
      // the whole package moves; the die grid inside inherits its CSS variables
      const die = one(".boot-chip");

      // The stage never opens empty: its first beat is time-based and plays as it scrolls into view.
      const introChars = q(".boot-line-a .jx-char");
      const introRails = q(".boot-rails i");
      gsap.set(introChars, { yPercent: 120, rotate: 6 });
      gsap.set(introRails, { scaleX: 0, transformOrigin: "left center" });
      const bootIntro = gsap
        .timeline({ paused: true })
        .to(
          introRails,
          { scaleX: 1, stagger: 0.05, duration: 0.8, ease: "power3.out" },
          0,
        )
        .to(
          introChars,
          {
            yPercent: 0,
            rotate: 0,
            stagger: 0.04,
            duration: 0.9,
            ease: "power3.out",
          },
          0.15,
        );
      ScrollTrigger.create({
        trigger: one(".boot"),
        start: "top 92%",
        onEnter: () => bootIntro.play(),
        onLeaveBack: () => bootIntro.reverse(),
      });

      // one quiet line of GPU context that changes with the scene; text only swaps on a phase change
      const noteEl = one(".gpu-note");
      const noteText = one(".gpu-note b");
      let noteIdx = -1;
      const showNote = (t: number) => {
        let i = 0;
        gpuNotes.forEach((n, k) => {
          if (t >= n.at) i = k;
        });
        if (i === noteIdx) return;
        noteIdx = i;
        noteText.textContent = gpuNotes[i].text;
        noteEl.classList.toggle("is-on", !!gpuNotes[i].text);
        noteEl.classList.remove("is-swap");
        void noteEl.offsetWidth;
        noteEl.classList.add("is-swap");
      };
      const boot = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: one(".boot"),
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.9)}`,
          pin: bootStage,
          scrub: SCRUB,
          refreshPriority: 10,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            showNote(self.progress * (self.animation?.duration() ?? 10.5)),
        },
      });
      boot
        .fromTo(
          bootStage,
          { "--dark": 0, clipPath: "inset(3% 2.5% round 28px)" },
          {
            "--dark": 1,
            clipPath: "inset(0% 0% round 0px)",
            duration: 0.8,
          },
          0,
        )
        .to(
          titleA,
          {
            scale: 0.26,
            x: () => -(bootStage.offsetWidth / 2 - titleA.offsetWidth / 2 - 40),
            y: () => -(titleA.offsetTop - 92),
            transformOrigin: "0 0",
            duration: 1.8,
            ease: "power3.inOut",
          },
          2.6,
        )
        .fromTo(
          die,
          { rotateX: 76, rotateZ: -24, scale: 0.3, opacity: 0 },
          {
            rotateX: 60,
            rotateZ: -24,
            scale: 1,
            opacity: 1,
            duration: 1.8,
            ease: "power2.out",
          },
          2.9,
        )
        // the die is driven by three CSS variables on one element, not hundreds of per-cell tweens
        .fromTo(
          die,
          { "--w": 0 },
          { "--w": 1, duration: 2.2, ease: "none" },
          3.1,
        )
        .from(
          q(".boot-line-b .jx-char"),
          {
            yPercent: 120,
            rotate: -6,
            stagger: 0.03,
            duration: 0.8,
            ease: "power3.out",
          },
          5,
        )
        .to(
          die,
          {
            rotateX: 0,
            rotateZ: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          4.7,
        )
        // story beats: the die re-forms as each line lands
        .from(
          q(".boot-story li"),
          {
            opacity: 0,
            x: -24,
            stagger: 0.8,
            duration: 0.5,
            ease: "power2.out",
          },
          5.3,
        )
        .fromTo(
          die,
          { "--k": 0 },
          { "--k": 3, duration: 1.7, ease: "none" },
          5.3,
        )
        .to(
          [
            q(".boot-line-b"),
            q(".boot-story"),
            q(".boot-hint"),
            q(".jx-corner"),
            titleA,
          ],
          {
            opacity: 0,
            duration: 0.7,
          },
          8.6,
        )
        .to(
          q(".boot-rails i"),
          {
            y: (i: number) => (i - 6.5) * window.innerHeight * 0.3,
            scaleY: 3,
            opacity: 0.5,
            duration: 1.4,
            ease: "power3.in",
          },
          8.9,
        )
        .to(
          q(".boot-rails i"),
          {
            opacity: 0.55,
            stagger: { amount: 0.45, from: "center" },
            duration: 0.25,
            ease: "sine.out",
          },
          8.15,
        )
        .to(q(".boot-rails i"), { opacity: 0, duration: 0.4 }, 9.9)
        .to(one(".boot-field-wrap"), { opacity: 0, duration: 0.8 }, 8.4)
        .fromTo(
          one(".boot-scan"),
          { yPercent: -100 },
          {
            yPercent: 100,
            duration: 1.4,
            ease: "power1.inOut",
          },
          4.6,
        )
        // the annotated die shot: who is on this chip
        .to(q(".boot-story"), { opacity: 0, duration: 0.3 }, 6.9)
        .from(
          q(".boot-callout u"),
          {
            scaleX: 0,
            transformOrigin: "0 50%",
            stagger: 0.15,
            duration: 0.35,
          },
          7.1,
        )
        .from(
          q(".boot-callout span"),
          {
            opacity: 0,
            y: 12,
            stagger: 0.15,
            duration: 0.4,
            ease: "power2.out",
          },
          7.2,
        )
        .to(q(".boot-callout"), { opacity: 0, duration: 0.4 }, 8.3)
        // then the camera dives into the chip
        .to(die, { scale: 24, duration: 2, ease: "power3.in" }, 8.4)
        // as we fall in, the photo gives way to the etched interconnect underneath
        .to(one(".die-photo"), { opacity: 0, duration: 0.6 }, 8.7)
        .fromTo(
          one(".die-etch"),
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          8.7,
        )
        .to(die, { opacity: 0, duration: 0.4 }, 10.1);

      /* ---- Scene 2: horizontal rig (camera tracks along the rack) ---- */
      const stage = one(".rig-stage");
      const track = one(".rig-track");
      const panels = q(".rig-panel");
      const hud = one(".rig-hud");
      const meters = {
        pos: one(".m-pos"),
        bay: one(".m-idx"),
        stack: one(".m-stack"),
        bayLabel: one(".m-bay"),
        fill: one(".rig-ruler-fill"),
      };
      const skewers = [".rig-back", ".rig-ghost", ".rig-fore"].flatMap((c) =>
        q(c).map((node) => ({
          panel: panels.findIndex((panel) => panel.contains(node)),
          set: gsap.quickTo(node, "skewX", {
            duration: 0.22,
            ease: "power3.out",
          }),
          reset: gsap.quickSetter(node, "skewX", "deg"),
          leaning: false,
        })),
      );
      const intro = 1;
      const hold = 0.8;
      const move = 1.2;
      const step = hold + move;
      const W = () => window.innerWidth;
      const travel = (bays.length - 1) * step;
      const total = intro + travel + hold + 1.4;

      // HUD shows only real state: scroll position, active bay, its stack
      let lastBay = -1;
      let lastPercent = -1;
      const hudUnits = q(".hud-unit");
      const settleLean = gsap
        .delayedCall(0.12, () => skewers.forEach((sk) => sk.set(0)))
        .pause();
      function onRigUpdate(self: ScrollTrigger) {
        const t = self.progress * (self.animation?.duration() ?? total);
        const idx = Math.max(
          0,
          Math.min(bays.length - 1, Math.round((t - intro - hold / 2) / step)),
        );
        if (idx !== lastBay) {
          lastBay = idx;
          panels.forEach((p, j) => p.classList.toggle("is-active", j === idx));
          hudUnits.forEach((u, j) => {
            u.classList.toggle("is-on", j === idx);
            if (j === idx) u.setAttribute("aria-current", "true");
            else u.removeAttribute("aria-current");
          });
          meters.bayLabel.textContent = bays[idx].name;
          one(".hud-note b").textContent = rigNotes[idx % rigNotes.length];
          meters.bay.textContent = `0${idx + 1} / 0${bays.length}`;
          meters.stack.textContent = projects
            .find((pr) => pr.id === bays[idx].id)!
            .tech.slice(0, 3)
            .join(" · ");
        }
        const percent = Math.round(self.progress * 100);
        if (percent !== lastPercent) {
          meters.pos.textContent = `${percent}%`;
          lastPercent = percent;
        }
        // Lean belongs to the dolly, with a smooth envelope and a still reading beat.
        const phase = (t - intro - hold) / step;
        const dolly = Math.floor(phase);
        const elapsed = (phase - dolly) * step;
        const moving = dolly >= 0 && dolly < bays.length - 1 && elapsed < move;
        const weight = moving ? Math.sin((elapsed / move) * Math.PI) : 0;
        const lean =
          gsap.utils.clamp(-3, 3, self.getVelocity() / -600) * weight;
        skewers.forEach((sk) => {
          const nearby =
            sk.panel < 0 ||
            (moving && (sk.panel === dolly || sk.panel === dolly + 1));
          if (!moving || !nearby) {
            if (sk.leaning) {
              sk.set.tween.pause();
              sk.reset(0);
              sk.leaning = false;
            }
          } else {
            sk.leaning = true;
            sk.set(lean);
          }
        });
        if (moving) settleLean.restart(true);
        else settleLean.pause();
      }

      const rig = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: one(".rig"),
          start: "top top",
          end: () =>
            `+=${Math.round(window.innerHeight * ((4.6 * bays.length) / 4))}`,
          pin: stage,
          scrub: SCRUB,
          refreshPriority: 8,
          invalidateOnRefresh: true,
          onUpdate: (self) => onRigUpdate(self),
        },
      });
      rigST.current = rig.scrollTrigger!;

      rig.from(hud, { opacity: 0, y: -14, duration: 0.8 }, 0.2);

      panels.forEach((panel, i) => {
        const card = panel.querySelector<HTMLElement>(".rig-bay")!;
        const lids = Array.from(panel.querySelectorAll(".rig-lid"));
        const ghost = panel.querySelector(".rig-ghost")!;
        const out = panel.querySelector(".rack-output")!;
        const s = intro + i * step; // start of this bay's hold
        const arrive = i === 0 ? 0 : s - move;

        if (i === 0) {
          // The tunnel from the boot scene opens straight onto the first bay.
          rig.fromTo(
            card,
            { scale: 0.5, opacity: 0, z: -700, rotateX: 14 },
            {
              scale: 1,
              opacity: 1,
              z: 0,
              rotateX: 0,
              duration: intro,
              ease: "power3.out",
            },
            0,
          );
        } else {
          rig.fromTo(
            card,
            {
              rotateY: 32,
              scale: 0.8,
              opacity: 0.35,
              z: -260,
            },
            {
              rotateY: 0,
              scale: 1,
              opacity: 1,
              z: 0,
              duration: move,
              ease: "power3.inOut",
            },
            s - move,
          );
        }
        if (i < bays.length - 1) {
          rig.to(
            card,
            {
              rotateY: -32,
              scale: 0.8,
              opacity: 0.35,
              z: -260,
              duration: move,
              ease: "power3.inOut",
            },
            s + hold,
          );
        }
        // enclosure panels peel apart on arrival, close as the bay leaves
        rig.fromTo(
          lids,
          { xPercent: 0 },
          {
            xPercent: (j: number) => (j === 0 ? -104 : 104),
            duration: 0.9,
            ease: "power2.inOut",
          },
          i === 0 ? 0.15 : s - 0.55,
        );
        if (i < bays.length - 1) {
          rig.to(
            lids,
            { xPercent: 0, duration: 0.6, ease: "power2.in" },
            s + hold + 0.1,
          );
        }
        // Depth travels with arrival/departure, then settles while the card is read.
        [
          { node: ghost, distance: 340 },
          { node: out, distance: 70 },
        ].forEach(({ node, distance }) => {
          rig.fromTo(
            node,
            { x: i === 0 ? 0 : distance },
            { x: 0, duration: i === 0 ? intro : move, ease: "power3.inOut" },
            arrive,
          );
          if (i < bays.length - 1) {
            rig.to(
              node,
              { x: -distance, duration: move, ease: "power3.inOut" },
              s + hold,
            );
          }
        });
      });

      // the camera itself: three dollies, each followed by a held beat
      for (let i = 0; i < bays.length - 1; i++) {
        rig.fromTo(
          track,
          { x: () => -i * W() },
          {
            x: () => -(i + 1) * W(),
            duration: move,
            ease: "power3.inOut",
          },
          intro + i * step + hold,
        );
      }
      // Hardware crosses only during its own dolly, clearing completely for reading.
      const propDefs = [
        { sel: ".prop-fins", f: 1.9, k: 0, opacity: 0.5 },
        { sel: ".prop-fan", f: 0.75, k: 1, opacity: 1 },
        { sel: ".prop-mem", f: 1.35, k: 2, opacity: 1 },
      ];
      propDefs.forEach(({ sel, f, k, opacity }) => {
        const node = one(sel);
        const at = intro + k * step + hold;
        const centre = () => W() * 0.5 - node.offsetWidth / 2;
        gsap.set(node, { autoAlpha: 0 });
        rig
          .fromTo(
            node,
            { x: () => centre() + f * W() * 0.5 },
            {
              x: () => centre() - f * W() * 0.5,
              duration: move,
              ease: "power3.inOut",
            },
            at,
          )
          .to(
            node,
            { autoAlpha: opacity, duration: 0.18, ease: "sine.out" },
            at,
          )
          .to(
            node,
            { autoAlpha: 0, duration: 0.18, ease: "sine.in" },
            at + move - 0.18,
          );
      });
      rig.fromTo(
        q(".prop-fins i"),
        { scaleY: 0.15 },
        {
          scaleY: 1,
          stagger: { amount: 0.6, from: "edges" },
          duration: 0.5,
          ease: "power2.out",
        },
        intro + hold + 0.1,
      );
      rig.fromTo(
        one(".prop-fan svg"),
        { rotation: 0 },
        {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: move,
          ease: "none",
        },
        intro + step + hold,
      );
      rig.fromTo(
        q(".prop-mem > div"),
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.5,
          ease: "power2.out",
        },
        intro + 2 * step + hold + 0.1,
      );

      // Each depth layer shares the camera's dolly and its settled reading beats.
      [
        { node: one(".rig-back"), depth: 0.28 },
        { node: one(".rig-fore"), depth: 1.55 },
      ].forEach(({ node, depth }) => {
        for (let i = 0; i < bays.length - 1; i++) {
          rig.fromTo(
            node,
            { x: () => -i * W() * depth },
            {
              x: () => -(i + 1) * W() * depth,
              duration: move,
              ease: "power3.inOut",
            },
            intro + i * step + hold,
          );
        }
      });
      // Existing ruler carries the signal on a move; no idle loop or new layer.
      for (let i = 0; i < bays.length - 1; i++) {
        rig.fromTo(
          meters.fill,
          { opacity: 0.45 },
          {
            opacity: 1,
            duration: move / 2,
            repeat: 1,
            yoyo: true,
            ease: "sine.inOut",
          },
          intro + i * step + hold,
        );
      }
      rig.fromTo(
        meters.fill,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: total - 0.4,
        },
        0.2,
      );

      // exit: the machine powers down and the page colour returns
      const exit = intro + travel + hold;
      rig
        .to(
          panels[bays.length - 1].querySelector(".rig-bay"),
          {
            scale: 0.86,
            opacity: 0,
            y: -50,
            duration: 0.9,
            ease: "power2.in",
          },
          exit,
        )
        .to(
          panels[bays.length - 1].querySelectorAll(".rig-lid"),
          {
            xPercent: 0,
            duration: 0.6,
            ease: "power2.in",
          },
          exit,
        )
        .to(q(".rig-ghost"), { opacity: 0, duration: 0.5 }, exit)
        .to(
          [q(".rig-props"), q(".prop-fins")],
          { opacity: 0, duration: 0.5 },
          exit,
        )
        .to(hud, { opacity: 0, duration: 0.5 }, exit + 0.3)
        .to(one(".rig-back"), { opacity: 0, duration: 0.6 }, exit + 0.3)
        .to(one(".rig-fore"), { opacity: 0, duration: 0.6 }, exit + 0.3)
        .to(stage, { "--dark": 0, duration: 0.9 }, exit + 0.3)
        .fromTo(
          one(".rig-end"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          exit + 0.7,
        )
        .to({}, { duration: 0.2 }, total - 0.2);

      gate(one(".boot"));
      gate(one(".rig"));

      // header follows the stage: dark while the machine is on screen
      const bootST = boot.scrollTrigger!;
      ScrollTrigger.create({
        trigger: one(".boot"),
        start: () => bootST.start + (bootST.end - bootST.start) * 0.1,
        end: () =>
          rig.scrollTrigger!.start +
          (rig.scrollTrigger!.end - rig.scrollTrigger!.start) * 0.88,
        onToggle: (self) => {
          setDarkStage("journey", self.isActive);
        },
      });

      return () => {
        el.classList.remove("is-immersive");
        // Desktop gates must not leave the compact dive or cards hidden after a resize.
        q(".boot, .manifesto, .rig").forEach((scene) =>
          scene.classList.remove("is-off"),
        );
        setDarkStage("journey", false);
        rigST.current = null;
      };
    });

    /* ------------------------------------------------------------------ */
    /* Tablet / phone: still scrubbed, never pinned                        */
    /* ------------------------------------------------------------------ */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    mm.add(COMPACT_MOTION_QUERY, () => {
      if (reduced.matches) return;
      // phones: the dive is real too. A tall section holds a sticky stage (no pin spacer); the die lights
      // up, tells its story, then the camera pushes through it.
      el.classList.add("is-dive");
      const dive = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: one(".boot"),
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * (self.animation?.duration() ?? 4);
            const phase =
              t < 0.3
                ? 0
                : t < 0.9
                  ? 1
                  : t < 1.6
                    ? 2
                    : t < 2.2
                      ? 3
                      : t < 2.9
                        ? 4
                        : 5;
            const el = one(".gpu-note");
            if (el.dataset.i === String(phase)) return;
            el.dataset.i = String(phase);
            one(".gpu-note b").textContent = gpuNotes[phase].text;
            el.classList.toggle("is-on", !!gpuNotes[phase].text);
          },
        },
      });
      gsap.set(q(".boot-story li"), { opacity: 0, x: -20 });
      dive
        .fromTo(
          one(".boot-chip"),
          { rotateX: 64, rotateZ: -18, scale: 0.8, "--w": 0 },
          { rotateX: 14, rotateZ: 0, scale: 1, "--w": 1, duration: 1 },
          0,
        )
        .to(
          q(".boot-story li"),
          { opacity: 1, x: 0, stagger: 0.28, duration: 0.3 },
          0.6,
        )
        .fromTo(one(".boot-chip"), { "--k": 0 }, { "--k": 3, duration: 1 }, 0.6)
        .to(one(".boot-chip"), { rotateX: 0, duration: 0.8 }, 1.6)
        .to(
          [
            q(".boot-story"),
            one(".boot-line-a"),
            one(".boot-line-b"),
            q(".boot-hint"),
          ],
          { opacity: 0, duration: 0.5 },
          2.6,
        )
        .fromTo(
          one(".boot-chip"),
          { "--out": 0 },
          { "--out": 1, duration: 0.7 },
          2.6,
        )
        .to(
          one(".boot-chip"),
          { scale: 16, duration: 1.1, ease: "power3.in" },
          2.9,
        )
        .to(one(".boot-chip"), { opacity: 0, duration: 0.3 }, 3.7);
      q(".boot-callout").forEach((li) => {
        gsap.fromTo(
          li,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: li,
              start: "top 92%",
              end: "top 70%",
              scrub: true,
            },
          },
        );
      });
      q(".rig-bay").forEach((card) => {
        gsap.fromTo(
          card,
          { rotateX: 14, scale: 0.92, y: 40, opacity: 0.4 },
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 38%",
              scrub: 0.6,
            },
          },
        );
      });
      return () => el.classList.remove("is-dive");
    });

    return () => mm.revert();
  }, []);

  /**
   * The die answers touch and pointer. Hovering tilts it toward the cursor and leaves a short heat
   * trail; a tap or click sends a ripple outward from the exact cell (with a small haptic on phones)
   * and presses the die toward the finger, then it springs back.
   */
  const dieAt = (e: {
    currentTarget: HTMLDivElement;
    clientX: number;
    clientY: number;
  }) => {
    const wrap = e.currentTarget;
    const die = wrap.querySelector<HTMLElement>(".boot-die")!;
    const r = die.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    return {
      wrap,
      die,
      nx,
      ny,
      col: Math.min(11, Math.max(0, Math.floor((nx + 0.5) * 12))),
      row: Math.min(11, Math.max(0, Math.floor((ny + 0.5) * 12))),
    };
  };
  const dieMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      e.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    cancelAnimationFrame(pointerFrame.current);
    const position = {
      currentTarget: e.currentTarget,
      clientX: e.clientX,
      clientY: e.clientY,
    };
    pointerFrame.current = requestAnimationFrame(() => {
      pointerFrame.current = 0;
      const { wrap, die, nx, ny, col, row } = dieAt(position);
      tipAt(wrap, nx, ny);
      wrap.style.setProperty("--mx", `${((nx + 0.5) * 100).toFixed(1)}%`);
      wrap.style.setProperty("--my", `${((ny + 0.5) * 100).toFixed(1)}%`);
      wrap.style.transform = `perspective(900px) rotateX(${(-ny * 16).toFixed(1)}deg) rotateY(${(nx * 16).toFixed(1)}deg)`;
      const cell = row * 12 + col;
      if (lastHeatCell.current === cell) return;
      lastHeatCell.current = cell;
      let cells = cellCache.current.get(die);
      if (!cells) {
        cells = Array.from(die.querySelectorAll<HTMLElement>(":scope > i"));
        cellCache.current.set(die, cells);
      }
      [0, -1, 1, -12, 12].forEach((d, k) => {
        const i = row * 12 + col + d;
        const c = cells[i] as HTMLElement | undefined;
        if (!c || (Math.abs(d) === 1 && Math.floor(i / 12) !== row)) return;
        c.style.setProperty("--h", k === 0 ? "1" : "0.55");
        window.clearTimeout(heatTimers.current.get(c));
        heatTimers.current.set(
          c,
          window.setTimeout(() => {
            c.style.setProperty("--h", "0");
            heatTimers.current.delete(c);
          }, 320),
        );
      });
    });
  };
  /** What the pointer is over on the package, in one line. */
  const tipAt = (wrap: HTMLElement, nx: number, ny: number) => {
    const tip = wrap.parentElement?.querySelector<HTMLElement>(".gpu-tip");
    if (!tip) return;
    const label =
      Math.abs(nx) > 0.55
        ? "HBM: memory stacked beside the die, terabytes a second of bandwidth"
        : Math.abs(ny) < 0.035
          ? "L2 cache: shared by every SM. A hit here skips a trip to HBM"
          : "SM cluster: threads run in warps of 32, in lockstep";
    if (tip.textContent !== label) tip.textContent = label;
    tip.classList.add("is-on");
  };
  const dieDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { wrap, die, nx, ny, col, row } = dieAt(e);
    tipAt(wrap, nx, ny);
    die.style.setProperty("--cx", String(col));
    die.style.setProperty("--cy", String(row));
    die.classList.remove("is-rip");
    void die.offsetWidth; // restart the CSS animation from the new origin
    die.classList.add("is-rip");
    wrap.style.transform = `perspective(900px) rotateX(${(-ny * 22).toFixed(1)}deg) rotateY(${(nx * 22).toFixed(1)}deg) scale(0.97)`;
    navigator.vibrate?.(8);
  };
  const dieRest = (e: React.PointerEvent<HTMLDivElement>) => {
    const tip = e.currentTarget.parentElement?.querySelector(".gpu-tip");
    window.setTimeout(
      () => tip?.classList.remove("is-on"),
      e.pointerType === "touch" ? 1600 : 0,
    );
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = 0;
    lastHeatCell.current = -1;
    e.currentTarget.style.transform = "";
  };

  /** Keyboard focus on an off-screen bay scrolls the playhead to it. */
  const reveal = (i: number) => {
    const st = rigST.current;
    if (!st) return;
    const intro = 1,
      step = 2,
      total = 1 + (bays.length - 1) * step + 0.8 + 1.4;
    const t = intro + i * step + 0.4;
    const y = st.start + (t / total) * (st.end - st.start);
    if (Math.abs(window.scrollY - y) > window.innerHeight * 0.4) scrollToY(y);
  };

  return (
    <section ref={root} className="journey" aria-label="Selected systems">
      <a href="#archive" className="sr-only focus:not-sr-only skip-ride">
        Skip animated section
      </a>

      {/* ---------------------------- BOOT ------------------------------ */}
      <div className="boot" id="about">
        <div className="boot-stage">
          <DotField />
          <div className="boot-rails" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ top: `${((i + 0.5) / 14) * 100}%` }} />
            ))}
          </div>
          <div className="jx-corner jx-tl" aria-hidden="true">
            <span>SR—01 / SAURAV RIJAL</span>
          </div>
          <div className="jx-corner jx-br" aria-hidden="true">
            <span>SCROLL ↓</span>
          </div>
          <h2 className="boot-title">
            <span className="sr-only">
              Built to ship. AI systems, end to end.
            </span>
            <span className="boot-line boot-line-a">
              <Chars text="Built to ship." />
            </span>
            <span className="boot-line boot-line-b">
              <em>
                <Chars text="AI systems, end to end." />
              </em>
            </span>
          </h2>
          <div
            className="boot-die-wrap"
            aria-hidden="true"
            onPointerMove={dieMove}
            onPointerDown={dieDown}
            onPointerUp={dieRest}
            onPointerLeave={dieRest}
            onPointerCancel={dieRest}
          >
            <div className="boot-chip">
              <b className="chip-sub" />
              <b className="chip-hbm chip-hbm-l">
                <i />
                <i />
                <i />
                <i />
              </b>
              <b className="chip-hbm chip-hbm-r">
                <i />
                <i />
                <i />
                <i />
              </b>
              <span className="chip-mark">SAURAV RIJAL · SR—01</span>
              <div
                className="boot-die"
                onAnimationEnd={(e) => {
                  if (e.animationName === "die-rip-light")
                    e.currentTarget.classList.remove("is-rip");
                }}
              >
                <img className="die-photo" src={chipPhoto} alt="" />
                <svg
                  className="die-etch"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {ETCH.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                  {ETCH.map((d, i) => {
                    const m = d.match(/M(\d+) (\d+)/)!;
                    return <circle key={`c${i}`} cx={m[1]} cy={m[2]} r="1.1" />;
                  })}
                </svg>
                <u className="boot-scan" />
                {Array.from({ length: CELLS }, (_, i) => {
                  const r = Math.floor(i / 12),
                    c = i % 12;
                  return (
                    <i
                      key={i}
                      style={
                        {
                          "--d": (Math.hypot(c - 5.5, r - 5.5) / 7.78).toFixed(
                            3,
                          ),
                          "--r": r,
                          "--c": c,
                          "--t1": r < 6 && c < 6 ? 1 : 0.2,
                          "--t2": r % 2 === 0 ? 1 : 0.2,
                        } as React.CSSProperties
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <ol className="boot-story">
            <li>
              <span>01</span>Full-stack applications, built and shipped.
            </li>
            <li>
              <span>02</span>Agents that run whole pipelines.
            </li>
            <li>
              <span>03</span>Research you can reproduce.
            </li>
          </ol>
          <ul className="boot-callouts" aria-label="About Saurav">
            {callouts.map((c, i) => (
              <li className={`boot-callout bc-${i + 1}`} key={c}>
                <u aria-hidden="true" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <span className="gpu-tip" aria-hidden="true" />
          <p className="gpu-note" aria-hidden="true">
            <span>GPU 101</span>
            <b />
          </p>
          <p className="boot-hint" aria-hidden="true">
            Touch the chip
          </p>
        </div>
      </div>

      {/* ----------------------------- RIG ------------------------------ */}
      <div className="rig" id="work">
        <div className="rig-stage">
          <div className="rig-back" aria-hidden="true">
            <span>COMPUTE RACK · COMPUTE RACK · COMPUTE RACK</span>
          </div>
          <div className="rig-hud">
            <div className="hud-top">
              <span>02 / SELECTED SYSTEMS</span>
              <ol aria-label="Jump to project">
                {bays.map((b, i) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      className={`hud-unit${i === 0 ? " is-on" : ""}`}
                      aria-label={`Show ${b.name}`}
                      aria-current={i === 0 ? "true" : undefined}
                      onClick={() => reveal(i)}
                    >
                      <i aria-hidden="true" />
                      U0{i + 1}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="hud-bottom" aria-hidden="true">
              <dl className="hud-meters">
                <div>
                  <dt>Scroll</dt>
                  <dd className="m-pos">0%</dd>
                </div>
                <div>
                  <dt>Bay</dt>
                  <dd className="m-idx">01 / 0{bays.length}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd className="m-stack">
                    {projects
                      .find((p) => p.id === bays[0].id)!
                      .tech.slice(0, 3)
                      .join(" · ")}
                  </dd>
                </div>
              </dl>
              <p className="hud-note">
                <span>Inference note</span>
                <b>{rigNotes[0]}</b>
              </p>
              <div className="hud-now">
                <span>Now showing</span>
                <b className="m-bay">{bays[0].name}</b>
                <i className="rig-ruler">
                  <u className="rig-ruler-fill" />
                </i>
              </div>
            </div>
          </div>
          <div className="rig-props" aria-hidden="true">
            <div className="prop prop-fan">
              <svg
                viewBox="-100 -100 200 200"
                fill="none"
                stroke="currentColor"
              >
                <circle r="96" strokeWidth="1.2" />
                <circle r="90" strokeWidth=".5" />
                <circle r="16" strokeWidth="1.2" />
                {Array.from({ length: 9 }, (_, i) => (
                  <path
                    key={i}
                    strokeWidth="1.2"
                    transform={`rotate(${i * 40})`}
                    d="M10 -8 C 50 -40, 84 -34, 88 -8 C 70 -18, 44 -14, 14 6 Z"
                  />
                ))}
              </svg>
              <span>Cooling</span>
            </div>
            <div className="prop prop-mem">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i}>
                  <i />
                  <i />
                  <i />
                </div>
              ))}
              <span>Memory</span>
            </div>
          </div>
          <div className="prop prop-fins" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <i key={i} style={{ height: `${70 + ((i * 37) % 30)}%` }} />
            ))}
          </div>
          <div className="rig-viewport">
            <div className="rig-track">
              {bays.map((bay, index) => {
                const project = projects.find(
                  (p) => p.id === bay.id,
                ) as Project;
                return (
                  <div
                    className={`rig-panel${index === 0 ? " is-active" : ""}`}
                    key={bay.id}
                    onFocus={() => reveal(index)}
                  >
                    <div className="rig-ghost" aria-hidden="true">
                      0{index + 1}
                    </div>
                    <article
                      className="rack-bay rig-bay"
                      aria-labelledby={`project-${bay.id}`}
                    >
                      <div className="bay-face">
                        <span className="bay-light" />
                        <span>{bay.category}</span>
                        <span className="bay-vents" aria-hidden="true" />
                        <span className="bay-unit">
                          U{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="bay-body">
                        <div className="bay-copy">
                          <p className="rack-label">{bay.note}</p>
                          <h3 id={`project-${bay.id}`}>{bay.name}</h3>
                          <p className="bay-description">
                            {project.description}
                          </p>
                          <dl className="bay-evidence">
                            <div>
                              <dt>Build</dt>
                              <dd>{project.buildFocus}</dd>
                            </div>
                            <div>
                              <dt>Output</dt>
                              <dd>{project.result}</dd>
                            </div>
                          </dl>
                          <p className="bay-tech">
                            {project.tech.slice(0, 4).join(" / ")}
                          </p>
                          <div className="bay-links">
                            {project.blogSlug && (
                              <Link to={`/blogs/${project.blogSlug}`}>
                                Read the project <ArrowUpRight size={15} />
                              </Link>
                            )}
                            {project.codeUrl && (
                              <a
                                href={project.codeUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Github size={14} /> Code
                                <span className="sr-only"> for {bay.name}</span>
                              </a>
                            )}
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Live demo <ArrowUpRight size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                        <Output type={bay.type} />
                      </div>
                      <div className="rig-lid rig-lid-l" aria-hidden="true">
                        <span className="lid-serial">
                          SR—0{index + 1} / SYSTEM ENCLOSURE
                        </span>
                        <span className="lid-number">0{index + 1}</span>
                        <span className="lid-title">{bay.name}</span>
                      </div>
                      <div className="rig-lid rig-lid-r" aria-hidden="true">
                        <span className="lid-serial">LIFT TO EXPLORE</span>
                        <div className="lid-grille" />
                        <span className="lid-bottom">→ OUTPUT</span>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rig-fore" aria-hidden="true" />
          <div className="rig-end" aria-hidden="true">
            <span>End of rack</span>
            <b>
              More <em>projects.</em>
            </b>
          </div>
        </div>
      </div>
    </section>
  );
}
