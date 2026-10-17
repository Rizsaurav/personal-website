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

const bays = [
  {
    id: 11,
    name: "BioTwin",
    category: "01 / HackRice",
    note: "Wearables give you numbers. This gives you understanding.",
    type: "biotwin",
  },
  {
    id: 12,
    name: "PlayScript",
    category: "02 / TXST Shipathon",
    note: "Play the story. Reimagine the ending.",
    type: "playscript",
  },
  {
    id: 13,
    name: "AI Interviewer",
    category: "03 / Google hackathon",
    note: "An interviewer that reads your code as you type.",
    type: "interview",
  },
  {
    id: 1,
    name: "VideoMaxx",
    category: "04 / Agentic production",
    note: "From a single topic to the final cut.",
    type: "film",
  },
];

const CELLS = 144;

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
  "Open-source projects · each with a build story",
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
      const die = one(".boot-die");

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

      const boot = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: one(".boot"),
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
          pin: bootStage,
          scrub: SCRUB,
          refreshPriority: 10,
          invalidateOnRefresh: true,
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
        .fromTo(
          die,
          { "--out": 0 },
          { "--out": 1, duration: 1.4, ease: "none" },
          7.3,
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
          7.6,
        )
        .to(
          q(".boot-rails i"),
          {
            y: (i: number) => (i - 6.5) * window.innerHeight * 0.3,
            scaleY: 3,
            opacity: 0.5,
            duration: 2.2,
            ease: "power3.in",
          },
          7.9,
        )
        .to(q(".boot-rails i"), { opacity: 0, duration: 0.4 }, 8.9)
        .to(one(".boot-field-wrap"), { opacity: 0, duration: 0.8 }, 7.4)
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
        .to(die, { scale: 24, duration: 2, ease: "power3.in" }, 7.2)
        .to(die, { opacity: 0, duration: 0.4 }, 8.9);

      /* ---- Scene 1.5: the chip. Nodes light up around it, the die shot annotates, the camera dives in ---- */
      const mf = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: one(".manifesto"),
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.4)}`,
          pin: one(".mf-stage"),
          scrub: SCRUB,
          refreshPriority: 9,
          invalidateOnRefresh: true,
        },
      });
      gsap.set(q(".mf-pcb"), { rotateX: 64, xPercent: -50, yPercent: -50 });
      const nodes = q(".mf-node");
      const lines = q(".mf-lines line");
      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
      mf.fromTo(
        one(".mf-far"),
        { y: 0 },
        { y: () => window.innerHeight * 0.4, duration: 6 },
        0,
      )
        .fromTo(
          one(".mf-near"),
          { y: 0 },
          { y: () => window.innerHeight * 0.9, duration: 6 },
          0,
        )
        .fromTo(
          one(".mf-chip"),
          { scale: 0.8, rotateX: 35, rotateZ: -8 },
          { scale: 1, rotateX: 0, rotateZ: 0, duration: 1, ease: "power3.out" },
          0,
        )
        .from(
          nodes,
          {
            opacity: 0,
            scale: 0.6,
            stagger: 0.14,
            duration: 0.3,
            ease: "back.out(2)",
          },
          0.4,
        )
        .to(lines, { strokeDashoffset: 0, stagger: 0.14, duration: 0.3 }, 0.45)
        .to([nodes, one(".mf-lines")], { opacity: 0, duration: 0.4 }, 1.9)
        .to(
          one(".mf-map"),
          { scale: 1.45, duration: 0.6, ease: "power3.inOut" },
          1.9,
        )
        .from(
          q(".mf-callout u"),
          {
            scaleX: 0,
            transformOrigin: "0 50%",
            stagger: 0.15,
            duration: 0.35,
          },
          2.3,
        )
        .from(
          q(".mf-callout span"),
          {
            opacity: 0,
            y: 12,
            stagger: 0.15,
            duration: 0.4,
            ease: "power2.out",
          },
          2.4,
        )
        .to(q(".mf-callout"), { opacity: 0, duration: 0.35 }, 3.6)
        // dive into the package: it becomes the next scene
        .to(
          one(".mf-map"),
          { scale: 30, duration: 1.3, ease: "power3.in" },
          3.7,
        )
        .to(one(".mf-map"), { opacity: 0, duration: 0.3 }, 4.7)
        .to(q(".mf-pcb"), { opacity: 0, duration: 0.6 }, 4.3);

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
        q(c).map((n) =>
          gsap.quickTo(n, "skewX", { duration: 0.5, ease: "power3.out" }),
        ),
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
      function onRigUpdate(self: ScrollTrigger) {
        const t = self.progress * (self.animation?.duration() ?? total);
        const idx = Math.max(
          0,
          Math.min(bays.length - 1, Math.round((t - intro - hold / 2) / step)),
        );
        if (idx !== lastBay) {
          lastBay = idx;
          panels.forEach((p, j) => p.classList.toggle("is-active", j === idx));
          q(".hud-unit").forEach((u, j) =>
            u.classList.toggle("is-on", j === idx),
          );
          meters.bayLabel.textContent = bays[idx].name;
          meters.bay.textContent = `0${idx + 1} / 0${bays.length}`;
          meters.stack.textContent = projects
            .find((pr) => pr.id === bays[idx].id)!
            .tech.slice(0, 3)
            .join(" · ");
        }
        meters.pos.textContent = `${Math.round(self.progress * 100)}%`;
        // layers lean into the motion: velocity becomes skew
        const lean = gsap.utils.clamp(-9, 9, self.getVelocity() / -260);
        skewers.forEach((sk) => sk(lean));
      }

      const rig = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: one(".rig"),
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 4.6)}`,
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
        // depth: ghost numeral and the live output slide against the card
        const span =
          (i === 0 ? intro : move) + hold + (i < bays.length - 1 ? move : 0);
        rig.fromTo(
          ghost,
          { x: i === 0 ? 0 : 340 },
          {
            x: i < bays.length - 1 ? -340 : 0,
            duration: span,
            ease: "none",
          },
          arrive,
        );
        rig.fromTo(
          out,
          { x: i === 0 ? 0 : 70 },
          {
            x: i < bays.length - 1 ? -70 : 0,
            duration: span,
            ease: "none",
          },
          arrive,
        );
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
      // transition props: each moves at its own depth, one per bay-to-bay move
      const propDefs = [
        { sel: ".prop-fins", f: 1.9, k: 0 },
        { sel: ".prop-fan", f: 0.75, k: 1 },
        { sel: ".prop-mem", f: 1.35, k: 2 },
      ];
      propDefs.forEach(({ sel, f, k }) => {
        const node = one(sel);
        const base = () =>
          W() * 0.5 + (k + 0.5) * f * W() - node.offsetWidth / 2;
        for (let i = 0; i < bays.length - 1; i++) {
          rig.fromTo(
            node,
            { x: () => base() - i * f * W() },
            {
              x: () => base() - (i + 1) * f * W(),
              duration: move,
              ease: "power3.inOut",
            },
            intro + i * step + hold,
          );
        }
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
          rotation: 720,
          transformOrigin: "50% 50%",
          duration: travel,
          ease: "none",
        },
        intro + hold,
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
        intro + step + hold + 0.1,
      );

      // layers at different depths travel different distances
      const dolly = intro + hold;
      rig.fromTo(
        one(".rig-back"),
        { x: 0 },
        {
          x: () => -(bays.length - 1) * W() * 0.28,
          duration: travel,
          ease: "none",
        },
        dolly,
      );
      rig.fromTo(
        one(".rig-fore"),
        { x: 0 },
        {
          x: () => -(bays.length - 1) * W() * 1.55,
          duration: travel,
          ease: "none",
        },
        dolly,
      );
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
      gate(one(".manifesto"));
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
        },
      });
      gsap.set(q(".boot-story li"), { opacity: 0, x: -20 });
      dive
        .fromTo(
          one(".boot-die"),
          { rotateX: 64, rotateZ: -18, scale: 0.8, "--w": 0 },
          { rotateX: 14, rotateZ: 0, scale: 1, "--w": 1, duration: 1 },
          0,
        )
        .to(
          q(".boot-story li"),
          { opacity: 1, x: 0, stagger: 0.28, duration: 0.3 },
          0.6,
        )
        .fromTo(one(".boot-die"), { "--k": 0 }, { "--k": 3, duration: 1 }, 0.6)
        .to(one(".boot-die"), { rotateX: 0, duration: 0.8 }, 1.6)
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
          one(".boot-die"),
          { "--out": 0 },
          { "--out": 1, duration: 0.7 },
          2.6,
        )
        .to(
          one(".boot-die"),
          { scale: 16, duration: 1.1, ease: "power3.in" },
          2.9,
        )
        .to(one(".boot-die"), { opacity: 0, duration: 0.3 }, 3.7);
      q(".mf-entry, .mf-callout").forEach((li) => {
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
      gsap.fromTo(
        one(".mf-chip"),
        { scale: 0.7, opacity: 0.2 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: one(".mf-chip"),
            start: "top 92%",
            end: "top 55%",
            scrub: true,
          },
        },
      );
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
  const dieAt = (e: React.PointerEvent<HTMLDivElement>) => {
    const wrap = e.currentTarget;
    const die = wrap.firstElementChild as HTMLElement;
    const r = wrap.getBoundingClientRect();
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
    if (e.pointerType === "touch") return;
    const { wrap, die, nx, ny, col, row } = dieAt(e);
    wrap.style.transform = `perspective(900px) rotateX(${(-ny * 16).toFixed(1)}deg) rotateY(${(nx * 16).toFixed(1)}deg)`;
    const cells = die.children;
    [0, -1, 1, -12, 12].forEach((d, k) => {
      const i = row * 12 + col + d;
      const c = cells[i] as HTMLElement | undefined;
      if (!c || (Math.abs(d) === 1 && Math.floor(i / 12) !== row)) return;
      c.style.setProperty("--h", k === 0 ? "1" : "0.55");
      window.setTimeout(() => c.style.setProperty("--h", "0"), 320);
    });
  };
  const dieDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { wrap, die, nx, ny, col, row } = dieAt(e);
    die.style.setProperty("--cx", String(col));
    die.style.setProperty("--cy", String(row));
    die.classList.remove("is-rip");
    void die.offsetWidth; // restart the CSS animation from the new origin
    die.classList.add("is-rip");
    wrap.style.transform = `perspective(900px) rotateX(${(-ny * 22).toFixed(1)}deg) rotateY(${(nx * 22).toFixed(1)}deg) scale(0.97)`;
    navigator.vibrate?.(8);
  };
  const dieRest = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };

  /** Keyboard focus on an off-screen bay scrolls the playhead to it. */
  const reveal = (i: number) => {
    const st = rigST.current;
    if (!st) return;
    const intro = 1,
      step = 2,
      total = 1 + 3 * step + 0.8 + 1.4;
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
      <div className="boot">
        <div className="boot-stage">
          <DotField />
          <div className="boot-rails" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ top: `${((i + 0.5) / 14) * 100}%` }} />
            ))}
          </div>
          <div className="jx-corner jx-tl" aria-hidden="true">
            <span>SR—01 / BOOT SEQUENCE</span>
          </div>
          <div className="jx-corner jx-br" aria-hidden="true">
            <span>SCROLL ↓</span>
          </div>
          <h2 className="boot-title">
            <span className="sr-only">Compute in. Useful things out.</span>
            <span className="boot-line boot-line-a">
              <Chars text="Compute in." />
            </span>
            <span className="boot-line boot-line-b">
              <em>
                <Chars text="Useful things out." />
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
            <div
              className="boot-die"
              onAnimationEnd={(e) => e.currentTarget.classList.remove("is-rip")}
            >
              <u className="boot-scan" />
              {Array.from({ length: CELLS }, (_, i) => {
                const r = Math.floor(i / 12),
                  c = i % 12;
                return (
                  <i
                    key={i}
                    style={
                      {
                        "--d": (Math.hypot(c - 5.5, r - 5.5) / 7.78).toFixed(3),
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
          <ol className="boot-story">
            <li>
              <span>01</span>A question worth asking.
            </li>
            <li>
              <span>02</span>A pipeline that runs itself.
            </li>
            <li>
              <span>03</span>Something people can use.
            </li>
          </ol>
          <p className="boot-hint" aria-hidden="true">
            Touch the die
          </p>
        </div>
      </div>

      {/* ---------------------------- THE BOARD ---------------------------- */}
      <div className="manifesto" id="about">
        <div className="mf-stage">
          <p className="sr-only">
            What I do: {board.map((b) => `${b.t}, ${b.d}`).join(" ")}
          </p>
          {[
            { b: farBoard, cls: "mf-far" },
            { b: nearBoard, cls: "mf-near" },
          ].map(({ b, cls }) => (
            <svg
              key={cls}
              className={`mf-pcb ${cls}`}
              viewBox="0 0 1600 1200"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <g fill="none" stroke="currentColor" strokeWidth="2">
                {b.paths.map((d, i) => (
                  <path key={i} d={d} pathLength={1} />
                ))}
                {b.vias.map(([x, y], i) => (
                  <circle key={`v${i}`} cx={x} cy={y} r="7" />
                ))}
              </g>
            </svg>
          ))}
          <div className="mf-map" aria-hidden="true">
            <svg
              className="mf-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {nodePos.map((p, i) => (
                <line
                  key={i}
                  x1={p.x}
                  y1={p.y}
                  x2="50"
                  y2="50"
                  pathLength={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            <div className="mf-chip">
              <i className="mf-pins mf-pins-x" />
              <i className="mf-pins mf-pins-y" />
              <div className="mf-package">
                {/* swap src/assets/chip.jpg in later for a different photo here */}
                <img src={chipPhoto} alt="" />
                <span className="mf-marking">SR—01 / SAURAV RIJAL</span>
                <b className="mf-notch" />
              </div>
            </div>
            {board.map((b, i) => (
              <span
                className="mf-node"
                key={b.tag}
                style={{ left: `${nodePos[i].x}%`, top: `${nodePos[i].y}%` }}
              >
                <i />
                {b.tag}
              </span>
            ))}
          </div>
          <ul className="mf-callouts" aria-hidden="true">
            {callouts.map((c, i) => (
              <li className={`mf-callout mf-c${i + 1}`} key={c}>
                <u />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ----------------------------- RIG ------------------------------ */}
      <div className="rig" id="work">
        <div className="rig-stage">
          <div className="rig-back" aria-hidden="true">
            <span>COMPUTE RACK · COMPUTE RACK · COMPUTE RACK</span>
          </div>
          <div className="rig-hud" aria-hidden="true">
            <div className="hud-top">
              <span>02 / SELECTED SYSTEMS</span>
              <ol>
                {bays.map((b, i) => (
                  <li className="hud-unit" key={b.id}>
                    <i />
                    U0{i + 1}
                  </li>
                ))}
              </ol>
            </div>
            <div className="hud-bottom">
              <dl className="hud-meters">
                <div>
                  <dt>Scroll</dt>
                  <dd className="m-pos">0%</dd>
                </div>
                <div>
                  <dt>Bay</dt>
                  <dd className="m-idx">01 / 04</dd>
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
